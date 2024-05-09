import { FunctionClient } from "../clients/function.client";
import logger from "../common/logger";
import { IInputs, ICredentials } from "../interface/interface";

import { commandParse, help, spinner } from "@serverless-devs/core";
import { extendFunctionInfos, getFunctionClient, handlerResponse, handlerUrn, isString, tableShow } from "../utils/util";
import { CreateVersionAliasRequest, CreateVersionAliasRequestBody, DeleteVersionAliasRequest, ListVersionAliasesRequest, ShowVersionAliasRequest, UpdateVersionAliasRequest, UpdateVersionAliasRequestBody, VersionStrategy, VersionStrategyRules } from "@huaweicloud/huaweicloud-sdk-functiongraph";
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
    resolvePolicy?: string;
    rulePolicy?: string;
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
            string: ['region', 'function-name', 'alias-name', 'version-name', 'description', 'gversion', 'weight'],
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
        props.function = extendFunctionInfos(props.function);
        logger.debug(`props: ${JSON.stringify(props)}`);

        const endProps: IAliasProps = {
            region: parsedData.region || props.region,
            functionName: parsedData['function-name'] || props.function?.functionName,
            aliasName: parsedData['alias-name'],
            urn: '',
            version: parsedData['version-name'] ?? 'latest',
            gVersion: parsedData.gversion,
            weight: parseInt(parsedData.weight),
            description: parsedData.description,
            resolvePolicy: parsedData['resolve-policy']?.toLocaleLowerCase(),
            rulePolicy: parsedData['rule-policy'],
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
        logger.debug(`endProps: ${JSON.stringify(endProps)}`);
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
        this.spin.info(`Querying details about alias [${aliasName}]`);
        logger.debug(`Querying details about alias [${aliasName}]`);
        try {
            const request = new ShowVersionAliasRequest().withFunctionUrn(urn).withAliasName(aliasName);
            const result = await client.getFunctionClient().showVersionAlias(request);
            const res = this.handlerPublish(result);
            logger.debug(`Details about alias [${aliasName}] queried. res = ${JSON.stringify(res)}`);
            return res;
        } catch (err) {
            this.spin.fail(`Query details about alias [${aliasName}] failed.`);
            logger.error(`Query details about alias [${aliasName}] failed.. err=${(err as Error).message}`);
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
        showSpin && this.spin.info(`Querying aliases of function [${props.functionName}].`);
        logger.debug(`Querying aliases of function [${props.functionName}].`);
        try {
            const request = new ListVersionAliasesRequest().withFunctionUrn(props.urn);
            const result = await client.getFunctionClient().listVersionAliases(request);
            const data = this.handlerList(result);
            logger.debug(`Query aliases of function [${props.functionName}]. res = ${JSON.stringify(data)}`);
            if (props.table) {
                this.showAliasTable(data);
                return;
            }
            return data;
        } catch (err) {
            showSpin && this.spin.fail(`Query aliases of function [${props.functionName}] failed.`);
            logger.error(`Query aliases of function [${props.functionName}] failed. err=${(err as Error).message}`);
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
        const { aliasName } = props;
        try {
            this.checkPublishParams(props);
            this.spin.info(`Publishing alias [${aliasName}].`);
            logger.debug(`Publishing alias [${aliasName}].`);
            const aliasConfig = await this.findAlias(props, client);
            const result = aliasConfig ? await this.updateAlias(props, client) : await this.createAlias(props, client);
            const res = this.handlerPublish(result);
            this.spin.succeed(`Alias [${aliasName}] published.`);
            logger.debug(`Alias [${aliasName}] published.`);
            return res;
        } catch (err) {
            this.spin.fail(`Publish alias [${aliasName}] failed.`);
            logger.error(`Publish alias [${aliasName}] failed. err=${(err as Error).message}`);
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
            this.spin.info(`Deleting alias [${aliasName}].`);
            logger.debug(`Deleting alias [${aliasName}].`);
            const request = new DeleteVersionAliasRequest().withFunctionUrn(urn).withAliasName(aliasName);
            const result: any = await client.getFunctionClient().deleteVersionAlias(request);
            handlerResponse(result);
            this.spin.succeed(`Alias [${aliasName}] deleted.`);
            logger.debug(`Alias [${aliasName}] deleted.`);
        } catch (error) {
            this.spin.fail(`Delete alias [${aliasName}] failed.`);
            logger.error(`Delete alias [${aliasName}] failed. err=${(error as Error).message}`);
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
    private checkPublishParams(props: IAliasProps) {
        const { weight, gVersion, aliasName, rulePolicy } = props;
        const hasWeight = !isNaN(weight);
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
        if (rulePolicy) {
            if (!gVersion) {
                throw new Error('Rule exists, gversion is required. Please specify with --gversion');
            }
            try {
                props.rulePolicy = JSON.parse(rulePolicy);
            } catch(err) {
                logger.error('The rule policy format is incorrect. Resolve policy uses percentage.');
                props.rulePolicy = null;
                props.resolvePolicy = 'percentage';
                return;
            } 
        }
    }

    /**
     * 创建别名
     * @param props 
     * @param client 
     * @returns 
     */
    private async createAlias(props: IAliasProps, client: FunctionClient) {
        const body = new CreateVersionAliasRequestBody().withName(props.aliasName).withVersion(props.version);
        this.handlerAliasBody(props, body);
        const request = new CreateVersionAliasRequest().withFunctionUrn(props.urn).withBody(body);
        logger.debug(`createAlias: ${JSON.stringify(request)}`);
        return await client.getFunctionClient().createVersionAlias(request);
    }

    /**
     * 更新别名
     * @param props 
     * @param client 
     * @returns 
     */
    private async updateAlias(props: IAliasProps, client: FunctionClient) {
        const body = new UpdateVersionAliasRequestBody().withVersion(props.version);
        this.handlerAliasBody(props, body);
        const request = new UpdateVersionAliasRequest().withFunctionUrn(props.urn).withAliasName(props.aliasName).withBody(body);
        logger.debug(`updateAlias: ${JSON.stringify(request)}`);
        return await client.getFunctionClient().updateVersionAlias(request);
    }

    /**
     * 处理Body
     * @param props 
     * @param body 
     * @returns 
     */
    private handlerAliasBody(props: IAliasProps, body: UpdateVersionAliasRequestBody | CreateVersionAliasRequestBody) {
        const { description, weight, gVersion, rulePolicy, resolvePolicy } = props;
        const hasWeight = !isNaN(weight);
        const isRule = resolvePolicy === 'rule';
        description && body.withDescription(description);
        if (hasWeight && !isRule) { //权重存在且灰度方式不为规则
            body.withAdditionalVersionWeights({ [gVersion]: weight });
            return;
        }
        if (!!rulePolicy && (!hasWeight || isRule)) { //规则配置存在且灰度方式为规则或泉州不存在
            const rules = this.handlerRules(rulePolicy);
            body.withAdditionalVersionStrategy({ [gVersion]: rules});
            return;
        }
    }

    /**
     * 解析规则配置
     * @param rulePolicy 
     * @returns 
     */
    private handlerRules(rulePolicy): VersionStrategy {
        const strategyConf = new VersionStrategy();
        strategyConf.withCombineType(rulePolicy.combine_type);
        const rules = rulePolicy.rules.map(r => new VersionStrategyRules().withOp(r.op).withParam(r.param).withRuleType(r.rule_type).withValue(r.value));
        strategyConf.withRules(rules);
        return strategyConf;
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
        const res = {
            name: info.name,
            version: info.version,
            description: info.description || '--',
            lastModifiedTime: info.last_modified
        }
        if (info.additional_version_strategy) {
            res['additionalVersionStrategy'] = info.additional_version_strategy;
        }
        if (info.additional_version_weights) {
            res['additionalVersionWeight'] = info.additional_version_weights;
        }
        return res;
    }

    /**
     * 表格展示别名列表
     * @param data 
     */
    private showAliasTable(data) {
        const showWeight = {
            value: 'additionalVersionWeight',
            formatter: (value) => {
                if (!value || isString(value)) {
                    return '--';
                }
                const gversion = Object.keys(value)[0];
                if (gversion) {
                    return `additionalVersion: ${gversion}\nWeight: ${value[gversion]}%`;
                }
                return '';
            },
        };
        const showStrategy = {
            value: 'additionalVersionStrategy',
            formatter: (value) => {
                if (!value || isString(value)) {
                    return '--';
                }
                const gversion = Object.keys(value)[0];
                if (gversion) {
                    const values = value[gversion];
                    const rules = values.rules.map(r => `${r.rule_type}:${r.param} ${r.op} ${r.value}`).join('\n');
                    return `combinType: ${values.combine_type}\nRules: \n${rules}`;
                }
                return '';
            },
        };
        tableShow(data, ['name', 'version', 'description', 'lastModifiedTime', showWeight, showStrategy]);
    }
}