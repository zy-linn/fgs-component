import {
    FuncCode,
    CreateFunctionRequest,
    CreateFunctionRequestBody,
    CreateFunctionRequestBodyCodeTypeEnum,
    CreateFunctionRequestBodyRuntimeEnum,
    CreateFunctionRequestBodyTypeEnum,
    DeleteFunctionRequest,
    FunctionGraphClient,
    ShowFunctionConfigRequest,
    UpdateFunctionCodeRequest,
    UpdateFunctionCodeRequestBody,
    UpdateFunctionCodeRequestBodyCodeTypeEnum,
    FuncVpc,
    UpdateFunctionConfigRequest,
    UpdateFunctionConfigRequestBody,
    StrategyConfig,
    UpdateFunctionConfigRequestBodyRuntimeEnum
} from "@huaweicloud/huaweicloud-sdk-functiongraph";
import { spinner } from "@serverless-devs/core";
import logger from "../common/logger";
import { IProperties, IRemoveProps } from "../interface/interface";
import { handlerResponse, startZip } from "../utils/util";
import { IFunctionProps, IFunctionResult } from "../interface/function.interface";

export class FunctionService {
    private metaData: any;
    private spin = spinner();

    constructor() { }

    /**
     * 部署函数
     * 1. 判断当前函数是否存在
     * 2. 函数存在，执行更新
     * 3. 不存在，执行创建
     */
    async deploy(props: IProperties, client: FunctionGraphClient) {
        try {
            if (!props.function) {
                throw new Error('请先在s.yml中配置函数信息');
            }
            if (!props.function.agencyName && (props.function.vpcId || props.function.subnetId)) {
                throw new Error('请先在s.yml中配置函数的委托名称');
            }
            if (props.function.codeType === 'obs' && !props.function.codeUrl) {
                throw new Error('请先在s.yml中配置函数函数代码包在OBS上的地址');
            }
            const isExist = await this.config(client, props.urn);
            const response = isExist ? await this.update(props, client, this.metaData) : await this.create(props, client);
            return this.handleResponse(response.func_urn ? response : this.metaData);
        } catch (err) {
            throw err;
        }
    }

    /**
     * 删除函数
     * @returns 
     */
    async remove({ functionName, urn }: IRemoveProps, client: FunctionGraphClient) {
        this.spin.info(`开始删除函数[${functionName}].`);
        logger.debug(`开始删除函数[${functionName}].`);
        try {
            const request = new DeleteFunctionRequest().withFunctionUrn(urn);
            const result: any = await client.deleteFunction(request);
            handlerResponse(result);
            this.spin.succeed(`函数[${functionName}]删除成功.`);
        } catch (error) {
            this.spin.fail(`函数[${functionName}]删除失败.`);
            logger.error(`函数[${functionName}]删除失败. err=${(error as Error).message}`);
            throw error;
        }
    }

    /**
     * 创建函数
     * @returns 
     */
    private async create(props: IProperties, client: FunctionGraphClient) {
        const functionInfo = props.function;
        const body = new CreateFunctionRequestBody()
            .withFuncName(functionInfo.functionName)
            .withPackage(functionInfo.package || 'default')
            .withRuntime(functionInfo.runtime as CreateFunctionRequestBodyRuntimeEnum)
            .withCodeType((functionInfo.codeType || 'zip') as CreateFunctionRequestBodyCodeTypeEnum)
            .withHandler(functionInfo.handler || 'index.handler')
            .withTimeout(functionInfo.timeout || 30)
            .withMemorySize(functionInfo.memorySize || 128)
            .withType(CreateFunctionRequestBodyTypeEnum.V2);
        functionInfo.agencyName && body.withXrole(functionInfo.agencyName);
        if (functionInfo.vpcId && functionInfo.subnetId) {
            body.withFuncVpc(new FuncVpc().withVpcId(functionInfo.vpcId).withSubnetId(functionInfo.subnetId));
        }
        functionInfo.environmentVariables && body.withUserData(JSON.stringify(functionInfo.environmentVariables));
        functionInfo.dependVersionList && body.withDependVersionList(functionInfo.dependVersionList);
        functionInfo.description && body.withDescription(functionInfo.description);
        if (functionInfo.codeType === 'obs') {
            body.withCodeUrl(functionInfo.codeUrl);
        } else {
            const zipFile = await startZip(functionInfo.code.codeUri);
            this.spin.succeed("File compression completed");
            body.withFuncCode(new FuncCode().withFile(zipFile))
        }
        this.spin.info(`Start creating function ${functionInfo.functionName}.`);
        try {
            const result: any = await client.createFunction(new CreateFunctionRequest().withBody(body));
            handlerResponse(result);
            if ((functionInfo.concurrentNum && functionInfo.concurrentNum !== result.strategy_config?.concurrent_num)
                || (functionInfo.concurrency && functionInfo.concurrency !== result.strategy_config?.concurrency)) { // 更新最大实例数
                await this.updateConfig(props, client, result);
            }
            return result;
        } catch (error) {
            this.spin.fail(`Failed to create Function ${functionInfo.functionName}.`);
            throw error;
        }
    }

    /**
     * 更新函数
     * @returns 
     */
    private async update(props: IProperties, client: FunctionGraphClient, config: IFunctionResult) {
        if (!props.type || props.type === 'code') {
            await this.updateCode(props, client, config);
        }
        if (!props.type || props.type === 'config') {
            await this.updateConfig(props, client, config);
        }
        return config;
    }

    /**
     * 更新函数代码
     * @returns 
     */
    private async updateCode(props: IProperties, client: FunctionGraphClient, config: IFunctionResult) {
        this.spin.info(`开始更新函数[${props.function.functionName}]代码.`);
        logger.debug(`开始更新函数[${props.function.functionName}]代码.`);
        try {
            const body = new UpdateFunctionCodeRequestBody()
                .withCodeType(props.function.codeType as UpdateFunctionCodeRequestBodyCodeTypeEnum)
                .withDependVersionList(props.function.dependVersionList ?? config.depend_version_list);
            if (props.function.codeType === 'obs') {
                body.withCodeUrl(props.function.codeUrl);
            } else {
                const zipFile = await startZip(props.function.code.codeUri);
                this.spin.succeed("File compression completed");
                body.withFuncCode(new FuncCode().withFile(zipFile))
            }

            const result: any = await client.updateFunctionCode(new UpdateFunctionCodeRequest().withBody(body).withFunctionUrn(config.func_urn));
            handlerResponse(result);
            this.spin.succeed(`函数[${props.function.functionName}]代码更新成功.`);
            logger.debug(`函数[${props.function.functionName}]代码更新成功.`);
        } catch (error) {
            this.spin.fail(`函数[${props.function.functionName}]代码更新失败.`);
            logger.error(`函数[${props.function.functionName}]代码更新失败. err=${(error as Error).message}`);
            throw error;
        }
    }

    /**
     * 更新函数配置
     * @param props 
     * @param client 
     * @param config 
     */
    private async updateConfig(props: IProperties, client: FunctionGraphClient, config: IFunctionResult) {
        this.spin.info(`开始更新函数[${props.function.functionName}]配置.`);
        logger.debug(`开始更新函数[${props.function.functionName}]配置.`);
        try {
            const body = this.getConfigRequestBody(props.function, config);
            const request = new UpdateFunctionConfigRequest().withFunctionUrn(props.urn).withBody(body);
            const result: any = client.updateFunctionConfig(request);
            handlerResponse(result);
            this.spin.succeed(`函数[${props.function.functionName}]配置更新成功.`);
            logger.debug(`函数[${props.function.functionName}]配置更新成功.`);
        } catch (error) {
            this.spin.fail(`函数[${props.function.functionName}]配置更新失败.`);
            logger.error(`函数[${props.function.functionName}]配置更新失败. err=${(error as Error).message}`);
            throw error;
        }

    }

    /**
     * 校验函数是否存在
     * @param props 
     * @returns 
     */
    private async config(client: FunctionGraphClient, urn = ''): Promise<boolean> {
        try {
            const request = new ShowFunctionConfigRequest().withFunctionUrn(urn);
            this.metaData = await client.showFunctionConfig(request);
            return this.metaData.httpStatusCode >= 200 && this.metaData.httpStatusCode < 300;
        } catch (err) {
            return false;
        }
    }

    /**
     *  处理函数信息输出
     * @param response
     * @returns
     */
    private handleResponse(response: any) {
        const content = [
            { desc: "Function Name", example: `${response.func_name}` },
            { desc: "Function URN", example: `${response.func_urn}` },
            { desc: "Project name", example: `${response.project_name}` },
            { desc: "Runtime", example: `${response.runtime}` },
            { desc: "Handler", example: `${response.handler}` },
            { desc: "Code size", example: `${response.code_size}` },
            { desc: "Timeout", example: `${response.timeout}` },
            { desc: "Description", example: `${response.description || "No description"}` },
            { desc: "More", example: 'https://console.huaweicloud.com/functiongraph/#/serverless/dashboard' }
        ];

        logger.debug(`Function handle response${JSON.stringify(content)}`);
        return {
            res: [
                {
                    header: "Function",
                    content,
                },
            ],
            functionUrn: response.func_urn,
        };
    }

    /**
     * 获取配置更新参数
     * @param functionInfo 
     * @param config 
     * @returns 
     */
    private getConfigRequestBody(functionInfo: IFunctionProps, config: IFunctionResult) {
        const body = new UpdateFunctionConfigRequestBody();
        body.withFuncName(config.func_name).withRuntime(config.runtime as UpdateFunctionConfigRequestBodyRuntimeEnum)
            .withHandler(functionInfo.handler ?? config.handler)
            .withTimeout(functionInfo.timeout ?? config.timeout)
            .withMemorySize(functionInfo.memorySize ?? config.memory_size)
            .withDescription(functionInfo.description ?? config.description)
            .withXrole(functionInfo.agencyName ?? config.xrole);

        // 最大实例数
        const strategy = new StrategyConfig().withConcurrency(400).withConcurrentNum(10);
        if (config.strategy_config) {
            strategy.withConcurrency(functionInfo.concurrency ?? config.strategy_config.concurrent_num);
            strategy.withConcurrentNum(functionInfo.concurrentNum ?? config.strategy_config.concurrent_num);
        } else {
            functionInfo.concurrency && strategy.withConcurrency(functionInfo.concurrency);
            functionInfo.concurrentNum && strategy.withConcurrentNum(functionInfo.concurrentNum);
        }
        body.withStrategyConfig(strategy);

        const vpc = new FuncVpc();
        if (functionInfo.vpcId && functionInfo.subnetId) {
            vpc.withVpcId(functionInfo.vpcId).withSubnetId(functionInfo.subnetId);
            body.withFuncVpc(vpc);
        } else if (config.func_vpc) {
            vpc.withCidr(config.func_vpc.cidr).withGateway(config.func_vpc.gateway)
                .withSubnetId(config.func_vpc.subnet_id).withSubnetName(config.func_vpc.subnet_name)
                .withVpcId(config.func_vpc.vpc_id).withVpcName(config.func_vpc.vpc_name);
        }
        body.withFuncVpc(vpc);

        if (functionInfo.environmentVariables) { // 环境变量
            body.withUserData(JSON.stringify(functionInfo.environmentVariables));
        } else {
            body.withUserData(config.user_data ?? '{}');
        }
        return body;
    }
}

