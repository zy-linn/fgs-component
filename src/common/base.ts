import logger from "./logger";
import { commandParse, help } from "@serverless-devs/core";
import * as deloyHelp from "../help/deploy";
import * as removeHelp from '../help/remove';
import { CommandType, ICredentials, IInputs, MethodType } from "../interface/interface";
import { IamClient } from "../clients/iam.client";
import { FunctionClient } from "../clients/function.client";

const COMMAND: string[] = ["all", "function", "trigger", "help"];

export class CammandBase {

    private helpCommand = {
        [MethodType.DEPLOY]: sub => deloyHelp[`deploy${sub ? '_' + sub : ''}`.toLocaleUpperCase()],
        [MethodType.REMOVE]: sub => removeHelp[`remove${sub ? '_' + sub : ''}`.toLocaleUpperCase()]
    };

    async handleInputs(inputs, type = MethodType.DEPLOY): Promise<IInputs> {
        logger.debug(`inputs.props: ${JSON.stringify(inputs.props)}`);

        if (!inputs.credentials.AccessKeyID || !inputs.credentials.SecretAccessKey) {
            throw new Error("Havn't set huaweicloud credentials. Run $s config add .");
        }

        const parsedArgs: { [key: string]: any } = commandParse(inputs, {
            boolean: ["help"],
            alias: { help: "h" },
        });

        const parsedData = parsedArgs?.data || {};
        const rawData = parsedData._ || [];

        const subCommand = rawData[0] || CommandType.ALL;
        logger.debug(`deploy subCommand: ${subCommand}`);
        if (!COMMAND.includes(subCommand)) {
            help(this.helpCommand[type]);
            throw new Error(`Does not support ${subCommand} command.`);
        }

        if (parsedData.help) {
            help(this.helpCommand[type](rawData[0]))
            return { isHelp: true, subCommand };
        }

        const props = inputs.props || {};

        if (!props.region) {
            throw new Error("Region not found, please input one.");
        }
        const credentials: ICredentials = inputs.credentials;
        const projectId = await new IamClient().build(credentials).getProject(props.region);

        if (!projectId) {
            throw new Error(`ProjectId not found. region = ${props.region}.`);
        }

        const client = new FunctionClient().build(credentials, props.region, projectId);
        return {
            projectId,
            credentials,
            subCommand,
            props: { ...props, projectId },
            client,
            args: props.args,
        };
    }
}
