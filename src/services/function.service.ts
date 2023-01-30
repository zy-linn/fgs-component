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
    UpdateFunctionCodeRequestBodyCodeTypeEnum
} from "@huaweicloud/huaweicloud-sdk-functiongraph";
import logger from "../common/logger";
import { IFunctionProps } from "../interface/interface";
import { startZip } from "../utils/util";

export class FunctionService {
    private functionInfo: IFunctionProps;
    private functionUrn = '';
    private metaData: any;
    private logMap = {
        createFunction: {
            success: `Function {name} is created successfully.`,
            failed: `Failed to create Function {name}.`
        },
        deleteFunction: {
            success: `Function {name} is deleted successfully.`,
            failed: `Failed to delete Function {name}.`
        },
        updateFunctionCode: {
            success: `The code of function {name} is updated successfully.`,
            failed: `Failed to update the code of function {name}.`
        },
        updateFunctionConfig: {
            success: `The configuration of function {name} is updated successfully.`,
            failed: `Failed to update the configuration of function {name}.`
        },
    };

    constructor(
        public readonly client: FunctionGraphClient,
        public readonly props: any = {},
        public readonly spin: any
    ) {
        this.handlerInputs(props);
    }

    /**
     * 部署函数
     * 1. 判断当前函数是否存在
     * 2. 函数存在，执行更新
     * 3. 不存在，执行创建
     */
    async deploy() {
        try {
            const isExist = await this.config();
            const response = isExist ? await this.update() : await this.create();
            return this.handleResponse(response.func_urn ? response : this.metaData);
        } catch (err) {
            throw err;
        }
    }

    /**
     * 删除函数
     * @returns 
     */
    async remove() {
        this.spin.info(`Start remove function ${this.functionInfo.func_name}.`);
        try {
            const request = new DeleteFunctionRequest().withFunctionUrn(this.getNoVersionUrn());
            const result = await this.client.deleteFunction(request);
            return this.handerResult(result, this.logMap.deleteFunction);
        } catch (err) {
            throw err;
        }
    }

    getUrn() {
        return this.functionUrn;
    }

    /**
     * 创建函数
     * @returns 
     */
    private async create() {
        this.spin.info(`Start creating function ${this.functionInfo.func_name}.`);
        const zipFile = await startZip(this.functionInfo.code.codeUri);
        this.spin.succeed("File compression completed");
        const body = new CreateFunctionRequestBody()
            .withFuncName(this.functionInfo.func_name)
            .withPackage(this.functionInfo.package)
            .withRuntime(this.functionInfo.runtime as CreateFunctionRequestBodyRuntimeEnum)
            .withCodeType(CreateFunctionRequestBodyCodeTypeEnum.ZIP)
            .withHandler(this.functionInfo.handler)
            .withTimeout(this.functionInfo.timeout)
            .withMemorySize(this.functionInfo.memory_size)
            .withType(CreateFunctionRequestBodyTypeEnum.V2)
            .withFuncCode(new FuncCode().withFile(zipFile))
        const result: any = await this.client.createFunction(new CreateFunctionRequest().withBody(body));
        return this.handerResult(result, this.logMap.createFunction);
    }

    /**
     * 更新函数
     * @returns 
     */
    private async update() {
        return await this.updateCode();
    }

    /**
     * 更新函数代码
     * @returns 
     */
    private async updateCode() {
        this.spin.info(`start update the code of function ${this.functionInfo.func_name}.`);
        const zipFile = await startZip(this.functionInfo.code.codeUri);
        const body = new UpdateFunctionCodeRequestBody()
            .withCodeType(UpdateFunctionCodeRequestBodyCodeTypeEnum.ZIP)
            .withFuncCode(new FuncCode().withFile(zipFile));

        if (Array.isArray(this.metaData.depend_version_list) && this.metaData.depend_version_list.length > 0) {
            body.withDependVersionList(this.metaData.depend_version_list)
        }
        const result = await this.client.updateFunctionCode(new UpdateFunctionCodeRequest().withBody(body).withFunctionUrn(this.functionUrn));
        return this.handerResult(result, this.logMap.updateFunctionCode);
    }

    // private async updateConfig() {

    // }


    /**
     * 校验函数是否存在
     * @param props 
     * @returns 
     */
    private async config() {
        try {
            const request = new ShowFunctionConfigRequest().withFunctionUrn(this.functionUrn);
            this.metaData = await this.client.showFunctionConfig(request);
            return this.metaData.httpStatusCode >= 200 && this.metaData.httpStatusCode < 300;
        } catch (err) {
            throw err;
        }
    }

    /**
     * 处理函数信息
     * @param props 
     */
    private async handlerInputs(props: any = {}) {
        const { region, projectId, function: funcProps } = props;
        this.functionInfo = {
            func_name: funcProps.functionName,
            handler: funcProps.handler || 'index.handler',
            memory_size: funcProps.memorySize || 128,
            timeout: funcProps.timeout || 30,
            runtime: funcProps.runtime,
            package: funcProps.package || 'default',
            code_type: 'zip',
            code: {
                codeUri: funcProps.code.codeUri
            }
        };
        this.functionUrn = this.handlerUrn(region, projectId, this.functionInfo.package, this.functionInfo.func_name);
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
     * 封装URN
     * @param region 
     * @param projectId 
     * @param funPackage 
     * @param name 
     * @returns 
     */
    private handlerUrn(region, projectId, funPackage, name) {
        return `urn:fss:${region}:${projectId}:function:${funPackage}:${name}:latest`;
    }

    /**
     * 处理函数结果
     * FSS.0409 代码没有更新
     * @param result 处理结果
     * @param type 展示内容
     * @returns 
     */
    private handerResult(result: any = {}, type: { success: string; failed: string }) {
        const { httpStatusCode, errorMsg, errorCode } = result;
        if (httpStatusCode >= 200 && httpStatusCode < 300 || errorCode === "FSS.0409") {
            this.spin.succeed(type.success.replace('{name}', this.functionInfo.func_name));
            logger.debug(type.success.replace('{name}', this.functionInfo.func_name));
            return result;
        }
        this.spin.fail(type.failed.replace('{name}', this.functionInfo.func_name));
        logger.error(`${type.failed.replace('{name}', this.functionInfo.func_name)} result = ${JSON.stringify(result)}`);
        throw new Error(JSON.stringify({ errorMsg, errorCode }));
    }

    private getNoVersionUrn() {
        const urns = this.functionUrn.split(':');
        urns.pop();
        return urns.join(':');
    }
}
