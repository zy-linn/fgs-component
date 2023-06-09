import { FunctionClient } from "../clients/function.client";
import logger from "../common/logger";
import { VERSION, VERSION_LIST, VERSION_PUBLISH } from "../help/version";
import { ICredentials, IInputs, IProperties, InputProps } from "../interface/interface";

import { commandParse, help, spinner } from "@serverless-devs/core";
import { getFunctionClient, handlerResponse, handlerUrn, isYml, tableShow } from "../utils/util";
import { CreateFunctionVersionRequest, CreateFunctionVersionRequestBody, DeleteFunctionRequest, ListFunctionVersionsRequest } from "@huaweicloud/huaweicloud-sdk-functiongraph";

export interface IVersion {
    region: string;
    functionName: string;
    urn?: string;
    version?: string;
    description?: string;
    table?: boolean;
    isYml?: boolean;
}

const VERSION_COMMAND: string[] = ['list', 'publish'];
const VERSION_COMMAND_HELP_KEY = {
    list: VERSION_LIST,
    publish: VERSION_PUBLISH,
};

export class VersionService {
    private spin = spinner();
    public async handleInputs(inputs: InputProps): Promise<IInputs> {
        logger.debug(`inputs.props: ${JSON.stringify(inputs.props)}`);
        if (!inputs?.credentials?.AccessKeyID || !inputs?.credentials?.SecretAccessKey) {
            throw new Error("Havn't set huaweicloud credentials. Run $s config add .");
        }

        const parsedArgs: { [key: string]: any } = commandParse(inputs, {
            boolean: ["help", "table"],
            string: ['region', 'function-name', 'version-name', 'description'],
            alias: { help: "h" },
        });

        const parsedData = parsedArgs?.data || {};
        const rawData = parsedData._ || [];

        const subCommand = rawData[0];
        logger.debug(`version subCommand: ${subCommand}`);
        if (!VERSION_COMMAND.includes(subCommand)) {
            help(VERSION);
            throw new Error(`Does not support ${subCommand} command.`);
        }

        if (parsedData.help) {
            help(VERSION_COMMAND_HELP_KEY[subCommand])
            return { isHelp: true, subCommand };
        }

        const props: IProperties = inputs.props;

        const endProps: IVersion = {
            region: parsedData.region || props?.region,
            functionName: parsedData['function-name'] || props?.function?.functionName,
            version: parsedData['version-name'],
            description: parsedData.description,
            table: parsedData.table ?? false,
            isYml: isYml(inputs.path.configPath)
        };

        if (!endProps.region) {
            throw new Error("Region not found. Please specify with --region");
        }

        if (!endProps.functionName) {
            throw new Error("Function Name not found. Please specify with --function-name.");
        }

        const credentials: ICredentials = inputs.credentials;

        const { client, projectId } = await getFunctionClient(credentials, endProps.region);

        endProps.urn = handlerUrn(endProps.region, projectId, 'default', endProps.functionName, endProps.version);
        logger.debug(`endProps: ${JSON.stringify(endProps)}`);
        return {
            subCommand,
            props: endProps,
            client,
        };
    }

    /**
     * 获取版本列表
     * @param props 
     * @param client 
     * @returns 
     */
    async list(props: IVersion, client: FunctionClient) {
        this.spin.info(`Querying versions of function [${props.functionName}].`);
        logger.debug(`Querying versions of function [${props.functionName}].`);
        try {
            const request = new ListFunctionVersionsRequest().withFunctionUrn(props.urn);
            const result = await client.getFunctionClient().listFunctionVersions(request);
            const data = this.handlerList(result);
            logger.debug(`Versions of function [${props.functionName}] queried. res = ${JSON.stringify(data)}`);
            if (props.table) {
                tableShow(data, ['version', 'description', 'lastModifiedTime']);
                return;
            }
            return data;
        } catch (err) {
            this.spin.fail(`Query versions of function [${props.functionName}] failed.`);
            logger.error(`Query versions of function [${props.functionName}] failed. err=${(err as Error).message}`);
            throw err;
        }

    }

    /**
     * 发布版本
     * @param props 
     * @param client 
     * @returns 
     */
    async publish(props: IVersion, client: FunctionClient) {
        this.spin.info(`Publishing version of function [${props.functionName}].`);
        logger.debug(`Publishing version of function [${props.functionName}].`);
        try {
            const request = new CreateFunctionVersionRequest().withFunctionUrn(props.urn);
            const body = new CreateFunctionVersionRequestBody();
            props.version && body.withVersion(props.version);
            props.description && body.withDescription(props.version);
            request.withBody(body);
            const result = await client.getFunctionClient().createFunctionVersion(request);
            return this.handlerPublish(result);
        } catch (err) {
            this.spin.fail(`Publish version of function [${props.functionName}] failed.`);
            logger.error(`Publish version of function [${props.functionName}] failed. err=${(err as Error).message}`);
            throw err;
        }
    }

    /**
     * 版本删除
     * @param props 
     * @param client 
     */
    async remove({ version, urn }: IVersion, client: FunctionClient) {
        if (!version) {
            throw new Error('VersionName is required. Please specify with --version-name');
        }
        if (version === 'latest') {
            throw new Error('version name cannot be latest.');
        }
        try {
            this.spin.info(`Deleting version [${version}].`);
            logger.debug(`Deleting version [${version}].`);
            const request = new DeleteFunctionRequest().withFunctionUrn(`${urn}:${version}`);
            const result: any = await client.getFunctionClient().deleteFunction(request);
            handlerResponse(result);
            this.spin.succeed(`Version [${version}] deleted.`);
        } catch (error) {
            this.spin.fail(`Delete version [${version}] failed.`);
            logger.error(`Delete version [${version}] failed. err=${(error as Error).message}`);
            throw error;
        }
    }

    /**
     * 处理列表信息
     * @param result 
     * @returns 
     */
    private handlerList(result) {
        handlerResponse(result);
        return result.versions.filter(v => v.version !== 'latest').map(v => this.handlerInfo(v));
    }

    /**
     * 处理发布信息
     * @param result 
     * @returns 
     */
    private handlerPublish(result) {
        handlerResponse(result);
        return this.handlerInfo(result);
    }

    /**
     * 处理版本信息
     * @param result 
     * @returns 
     */
    private handlerInfo(info) {
        return {
            version: info.version,
            description: info.version_description ?? '--',
            lastModifiedTime: info.last_modified
        }
    }
}