import { commandParse, help } from "@serverless-devs/core";
import logger from "../common/logger";
import { DEPLOY, DEPLOY_ALL, DEPLOY_FUNCTION, DEPLOY_TRIGGER } from "../help/deploy";
import { ICredentials, IInputs, IProperties, InputProps } from "../interface/interface";
import { getFunctionClient, handlerUrn } from "../utils/util";
import { FunctionClient } from "../clients/function.client";
import { TriggerService } from "./trigger.service";
import { FunctionService } from "./function.service";

const DEPLOY_SUPPORT_CONFIG_ARGS = ['code', 'config'];
const DEPLOY_COMMAND = ["all", "function", "trigger", "help"];
const DEPLOY_COMMAND_HELP_KEY = {
    all: DEPLOY_ALL,
    function: DEPLOY_FUNCTION,
    trigger: DEPLOY_TRIGGER,
};
export class DeployService {
    public async handleInputs(inputs: InputProps): Promise<IInputs> {
        logger.debug(`inputs.props: ${JSON.stringify(inputs.props)}`);
        logger.debug(`inputs.args: ${JSON.stringify(inputs.args)}`);
        logger.debug(`inputs.argsObj: ${JSON.stringify(inputs.argsObj)}`);
        if (!inputs.credentials.AccessKeyID || !inputs.credentials.SecretAccessKey) {
            throw new Error("Havn't set huaweicloud credentials. Run $s config add .");
        }

        const parsedArgs: { [key: string]: any } = commandParse(inputs, {
            boolean: ["help"],
            string: ['type'],
            alias: { help: "h" },
        });

        const parsedData = parsedArgs?.data || {};
        const rawData = parsedData._ || [];

        const subCommand = rawData[0] || 'all';
        logger.debug(`Deploy subCommand: ${subCommand}`);
        if (!DEPLOY_COMMAND.includes(subCommand)) {
            help(DEPLOY);
            throw new Error(`Does not support ${subCommand} command.`);
        }

        if (parsedData.help) {
            help(DEPLOY_COMMAND_HELP_KEY[subCommand])
            return { isHelp: true, subCommand };
        }

        if (parsedData.type && !DEPLOY_SUPPORT_CONFIG_ARGS.includes(parsedData.type)) {
            help(DEPLOY_COMMAND_HELP_KEY.function);
            throw new Error(
                `Type does not support ${parsedData.type}, only config and code are supported`,
            );
        }

        const props: IProperties = inputs.props;

        if (!props?.region) {
            throw new Error("Region not found. Please specify with --region");
        }

        const credentials: ICredentials = inputs.credentials;

        const { client, projectId } = await getFunctionClient(credentials, props.region);

        const urn = handlerUrn(props.region, projectId, 'default', props.function.functionName, 'latest');
        return {
            credentials,
            subCommand,
            props: { ...props, urn, type: parsedData.type },
            client,
            args: props.args,
        };
    }

    async deploy(subCommand, props: IProperties, client: FunctionClient) {
        let result = [];
        if (['all', 'function'].includes(subCommand)) {
            const funcInfo = await this.function(props, client);
            result = result.concat(funcInfo.res);
        }
        if (['all', 'trigger'].includes(subCommand)) {
            if (subCommand === 'all' && !props.trigger) {
                return result;
            }
            const triggerInfo = await this.trigger(props, client);
            result = result.concat(triggerInfo);
        }
        return result;
    }

    private async function(props: IProperties, client: FunctionClient) {
        const service = new FunctionService();
        return await service.deploy(props, client.getFunctionClient());
    }

    private async trigger(props: IProperties, client: FunctionClient) {
        const trigger = new TriggerService();
        return await trigger.deploy(props, client);
    }
}