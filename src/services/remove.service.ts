import { commandParse, help } from "@serverless-devs/core";
import { ICredentials, IInputs, IProperties, IRemoveProps, InputProps } from "../interface/interface";
import logger from "../common/logger";
import { REMOVE, REMOVE_ALIAS, REMOVE_FUNCTION, REMOVE_TRIGGER, REMOVE_VERSION } from "../help/remove";
import { extendFunctionInfos, getFunctionClient, handlerUrn, isYml } from "../utils/util";
import { FunctionClient } from "../clients/function.client";
import { VersionService } from "./version.service";
import { AliasService } from "./alias.service";
import { TriggerService } from "./trigger.service";
import { FunctionService } from "./function.service";

const REMOVE_COMMAND = ['function', 'trigger', 'version', 'alias',];
const REMOVE_COMMAND_HELP_KEY = {
    function: REMOVE_FUNCTION,
    trigger: REMOVE_TRIGGER,
    version: REMOVE_VERSION,
    alias: REMOVE_ALIAS
};
export class RemoveService {
    public async handleInputs(inputs: InputProps): Promise<IInputs> {
        logger.debug(`inputs.props: ${JSON.stringify(inputs.props)}`);
        logger.debug(`inputs.args: ${JSON.stringify(inputs.args)}`);
        logger.debug(`inputs.argsObj: ${JSON.stringify(inputs.argsObj)}`);
        if (!inputs.credentials.AccessKeyID || !inputs.credentials.SecretAccessKey) {
            throw new Error("Havn't set huaweicloud credentials. Run $s config add .");
        }

        const parsedArgs: { [key: string]: any } = commandParse(inputs, {
            boolean: ["help", 'table'],
            string: ['region', 'function-name', 'alias-name', 'version-name', 'trigger-name'],
            alias: { help: "h" },
        });

        const parsedData = parsedArgs?.data || {};
        const rawData = parsedData._ || [];

        const subCommand = rawData[0] || 'function';
        logger.debug(`Remove subCommand: ${subCommand}`);
        if (!REMOVE_COMMAND.includes(subCommand)) {
            help(REMOVE);
            throw new Error(`Does not support ${subCommand} command.`);
        }

        if (parsedData.help) {
            help(REMOVE_COMMAND_HELP_KEY[subCommand])
            return { isHelp: true, subCommand };
        }

        const props: IProperties = inputs.props;
        props.function = extendFunctionInfos(props.function);
        logger.debug(`props: ${JSON.stringify(props)}`);

        const endProps: IRemoveProps = {
            region: parsedData.region || props?.region,
            functionName: parsedData['function-name'] || props?.function?.functionName,
            urn: '',
            aliasName: parsedData['alias-name'],
            version: parsedData['version-name'],
            triggerType: parsedData['trigger-type'],
            triggerName: parsedData['trigger-name'],
            triggerInfo: props.trigger,
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

    async function(props: IRemoveProps, client: FunctionClient) {
        const service = new FunctionService();
        return await service.remove(props, client.getFunctionClient());
    }

    async trigger(props: IRemoveProps, client: FunctionClient) {
        const trigger = new TriggerService();
        return await trigger.remove(props, client);
    }

    async version(props: IRemoveProps, client: FunctionClient) {
        const version = new VersionService();
        return await version.remove(props, client);
    }

    async alias(props: IRemoveProps, client: FunctionClient) {
        const alias = new AliasService();
        return await alias.remove(props, client);
    }
}