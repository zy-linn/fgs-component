import { FunctionClient } from "../clients/function.client";
import logger from "../common/logger";
import { IInputs, ICredentials } from "../interface/interface";

import { commandParse, help, spinner } from "@serverless-devs/core";
import { getFunctionClient, handlerResponse, handlerUrn, isString, tableShow } from "../utils/util";
import { CreateVersionAliasRequest, CreateVersionAliasRequestBody, DeleteVersionAliasRequest, ListVersionAliasesRequest, ShowVersionAliasRequest, UpdateVersionAliasRequest, UpdateVersionAliasRequestBody } from "@huaweicloud/huaweicloud-sdk-functiongraph";
import { ALIAS, ALIAS_GET, ALIAS_LIST, ALIAS_PUBLISH } from "../help/alias";


interface IAliasProps {
    region: string;
    functionName: string;
    aliasName?: string;
    urn: string;
    version?: string;
    gVersion?: string;
    weight?: number;
    description?: string;
    table?: boolean;
};

const ALIAS_COMMAND: string[] = ['get', 'list', 'publish'];
const ALIAS_COMMAND_HELP_KEY = {
    get: ALIAS_GET,
    list: ALIAS_LIST,
    publish: ALIAS_PUBLISH,
};

export class AliasService {
    private spin = spinner();
    public async handleInputs(inputs): Promise<IInputs> {
        logger.debug(`inputs.props: ${JSON.stringify(inputs.props)}`);
        logger.debug(`inputs.args: ${JSON.stringify(inputs.args)}`);
        logger.debug(`inputs.argsObj: ${JSON.stringify(inputs.argsObj)}`);
        if (!inputs.credentials.AccessKeyID || !inputs.credentials.SecretAccessKey) {
            throw new Error("Havn't set huaweicloud credentials. Run $s config add .");
        }

        const parsedArgs: { [key: string]: any } = commandParse(inputs, {
            boolean: ["help", 'table'],
            string: ['region', 'function-name', 'alias-name', 'version', 'description', 'gversion', 'weight'],
            alias: { help: "h" },
        });

        const parsedData = parsedArgs?.data || {};
        const rawData = parsedData._ || [];

        const subCommand = rawData[0];
        logger.debug(`alias subCommand: ${subCommand}`);
        if (!ALIAS_COMMAND.includes(subCommand)) {
            help(ALIAS);
            throw new Error(`Does not support ${subCommand} command.`);
        }

        if (parsedData.help) {
            help(ALIAS_COMMAND_HELP_KEY[subCommand])
            return { isHelp: true, subCommand };
        }

        const props = inputs.props || {};

        const endProps: IAliasProps = {
            region: parsedData.region || props.region,
            functionName: parsedData['function-name'] || props.function?.functionName,
            aliasName: parsedData['alias-name'],
            urn: '',
            version: parsedData.version ?? 'latest',
            gVersion: parsedData.gversion,
            weight: parseInt(parsedData.weight),
            description: parsedData.description,
            table: parsedData.table ?? false
        };
        if (!endProps.region) {
            throw new Error("Region not found. Please specify with --region");
        }

        if (!endProps.functionName) {
            throw new Error("Function Name not found. Please specify with --function-name.");
        }

        const credentials: ICredentials = inputs.credentials;

        const { client, projectId } = await getFunctionClient(credentials, endProps.region);

        endProps.urn = handlerUrn(endProps.region, projectId, 'default', endProps.functionName);
        return {
            credentials,
            subCommand,
            props: { ...endProps, projectId },
            client,
            args: props.args,
        };
    }

    /**
     * 获取别名详细信息
     * @param props 
     * @param client 
     * @returns 
     */
    async get(props: IAliasProps, client: FunctionClient) {
        const { aliasName, urn } = props;
        if (!aliasName) {
            throw new Error('AliasName is required. Please specify with --alias-name');
        }
        this.spin.info(`开始获取别名[${aliasName}]详情.`);
        logger.debug(`开始获取别名[${aliasName}]详情.`);
        try {
            const request = new ShowVersionAliasRequest().withFunctionUrn(urn).withAliasName(aliasName);
            const result = await client.getFunctionClient().showVersionAlias(request);
            return this.handlerPublish(result);
        } catch (err) {
            this.spin.fail(`获取别名[${aliasName}]详情失败`);
            logger.error(`获取别名[${aliasName}]详情失败. err=${(err as Error).message}`);
            throw err;
        } finally {
            this.spin.stop();
        }
    }

    /**
     * 获取别名列表
     * @param props 
     * @param client 
     * @param showSpin 
     * @returns 
     */
    async list(props: IAliasProps, client: FunctionClient, showSpin = true) {
        showSpin && this.spin.info(`开始获取函数[${props.functionName}]别名列表.`);
        logger.debug(`开始获取函数[${props.functionName}]别名列表.`);
        try {
            const request = new ListVersionAliasesRequest().withFunctionUrn(props.urn);
            const result = await client.getFunctionClient().listVersionAliases(request);
            const data = this.handlerList(result);
            if (props.table) {
                this.showAliasTable(data);
                return;
            }
            return data;
        } catch (err) {
            showSpin && this.spin.fail(`获取函数[${props.functionName}]别名列表失败.`);
            logger.error(`获取函数[${props.functionName}]别名列表失败. err=${(err as Error).message}`);
            throw err;
        } finally {
            this.spin.stop();
        }
    }

    /**
     * 创建更新别名
     * @param props 
     * @param client 
     * @returns 
     */
    async publish(props: IAliasProps, client: FunctionClient) {
        const { weight, gVersion, aliasName } = props;
        const hasWeight = typeof weight === 'number';

        try {
            this.checkPublishParams(aliasName, gVersion, hasWeight);
            this.spin.info(`开始发布别名[${aliasName}].`);
            logger.debug(`开始发布别名[${aliasName}].`);
            const aliasConfig = await this.findAlias(props, client);
            const result = aliasConfig ? await this.updateAlias(props, client) : await this.createAlias(props, client);
            return this.handlerPublish(result);
        } catch (err) {
            this.spin.fail(`别名[${aliasName}]发布失败.`);
            logger.error(`别名[${aliasName}]发布失败. err=${(err as Error).message}`);
            throw err;
        } finally {
            this.spin.stop();
        }
    }

    /**
     * 删除别名
     * @param param0 
     * @param client 
     */
    async remove({ aliasName, urn }: IAliasProps, client: FunctionClient) {
        if (!aliasName) {
            throw new Error('AliasName is required. Please specify with --alias-name');
        }
        try {
            this.spin.info(`开始删除别名[${aliasName}].`);
            logger.debug(`开始删除别名[${aliasName}].`);
            const request = new DeleteVersionAliasRequest().withFunctionUrn(`${urn}:!${aliasName}`).withAliasName(aliasName);
            const result: any = client.getFunctionClient().deleteVersionAlias(request);
            handlerResponse(result);
            this.spin.succeed(`别名[${aliasName}]删除成功.`);
        } catch (error) {
            this.spin.fail(`别名[${aliasName}]删除失败.`);
            logger.error(`别名[${aliasName}]删除失败. err=${(error as Error).message}`);
            throw error;
        }
    }

    /**
     * 判断别名是否存在
     * @param props 
     * @param client 
     * @returns 
     */
    private async findAlias(props: IAliasProps, client: FunctionClient) {
        const list = await this.list({ ...props, table: false }, client, false);
        return list.find(l => l.name === props.aliasName);
    }
    /**
     * 校验参数是否正确
     * @param aliasName 别名
     * @param gVersion 灰度版本
     * @param hasWeight 权重
     */
    private checkPublishParams(aliasName = '', gVersion = '', hasWeight = false) {
        if (!aliasName) {
            throw new Error('AliasName is required. Please specify with --alias-name');
        }
        if (aliasName.length === 1 && !/[a-zA-Z]/.test(aliasName) ||
            aliasName.length > 1 && !/^[a-zA-Z][a-zA-Z0-9-_]{0,61}[a-zA-Z0-9]$/.test(aliasName)
        ) {
            throw new Error(`AliasName doesn't match expected format.\nPlease enter 1 to 63 characters, starting with a letter and ending with a letter or digit. Only letters, digits, hyphens(-), and underscores(_) are allowed.`);
        }
        if (hasWeight && !gVersion) {
            throw new Error('weight exists, gversion is required. Please specify with --gversion');
        }
        if (gVersion && !hasWeight) {
            throw new Error('gversion exists, weight is required. Please specify with --weight');
        }
    }

    /**
     * 创建别名
     * @param props 
     * @param client 
     * @returns 
     */
    private async createAlias(props: IAliasProps, client: FunctionClient) {
        const hasWeight = typeof props.weight === 'number';
        const body = new CreateVersionAliasRequestBody().withName(props.aliasName).withVersion(props.version);
        props.description && body.withDescription(props.description);
        hasWeight && body.withAdditionalVersionWeights({ [props.gVersion]: props.weight });
        const request = new CreateVersionAliasRequest().withFunctionUrn(props.urn).withBody(body);
        return await client.getFunctionClient().createVersionAlias(request);
    }

    /**
     * 更新别名
     * @param props 
     * @param client 
     * @returns 
     */
    private async updateAlias(props: IAliasProps, client: FunctionClient) {
        const hasWeight = typeof props.weight === 'number';
        const body = new UpdateVersionAliasRequestBody().withVersion(props.version);
        props.description && body.withDescription(props.description);
        hasWeight && body.withAdditionalVersionWeights({ [props.gVersion]: props.weight });
        const request = new UpdateVersionAliasRequest().withFunctionUrn(props.urn).withAliasName(props.aliasName).withBody(body);
        return await client.getFunctionClient().updateVersionAlias(request);
    }

    /**
     * 处理别名列表
     * @param result 
     * @returns 
     */
    private handlerList(result) {
        handlerResponse(result);
        return result.map(a => this.handlerAliasInfo(a));
    }

    /**
     * 处理别名信息
     * @param result 
     * @returns 
     */
    private handlerPublish(result) {
        handlerResponse(result);
        return this.handlerAliasInfo(result);
    }

    /**
     * 处理别名信息
     * @param result 
     * @returns 
     */
    private handlerAliasInfo(info) {
        return {
            name: info.name,
            version: info.version,
            additionalVersionWeight: info.additional_version_weights || '--',
            description: info.description || '--',
            lastModifiedTime: info.last_modified
        }
    }

    /**
     * 表格展示别名列表
     * @param data 
     */
    private showAliasTable(data) {
        const showWeight = {
            value: 'additionalVersionWeight',
            formatter: (value) => {
                if (isString(value)) {
                    return '--';
                }
                const gversion = Object.keys(value)[0];
                if (gversion) {
                    return `additionalVersion: ${gversion}\nWeight: ${value[gversion]}%`;
                }
                return '';
            },
        };
        tableShow(data, ['name', 'version', 'description', 'lastModifiedTime', showWeight]);
    }
}