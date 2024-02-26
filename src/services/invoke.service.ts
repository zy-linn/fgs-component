import path from "path";
import { commandParse, spinner, help } from "@serverless-devs/core";
import logger from "../common/logger";
import { ICredentials, IInputs, IProperties, InputProps } from "../interface/interface";
import { INVOKE } from "../help/invoke";
import { getFunctionClient, handlerUrn } from "../utils/util";
import { FunctionClient } from "../clients/function.client";
import { EventService } from "./event.service";
import { InvokeFunctionRequest } from "@huaweicloud/huaweicloud-sdk-functiongraph";
export interface IInvoke {
    region?: string;
    functionName?: string;
    qualifier?: string;
    urn?: string;
    eventName?: string;
    eventFile?: string;
    eventStdin?: boolean;
}

export class InvokeService {
    private spin = spinner();
    public async handleInputs(inputs: InputProps): Promise<IInputs> {
        logger.debug(`inputs.props: ${JSON.stringify(inputs.props)}`);
        if (!inputs?.credentials?.AccessKeyID || !inputs?.credentials?.SecretAccessKey) {
            throw new Error("Havn't set huaweicloud credentials. Run $s config add .");
        }

        const parsedArgs: { [key: string]: any } = commandParse(inputs, {
            boolean: ["help", "debug"],
            alias: {
                help: "h",
                'event-name': 'n',
                'event-stdin': 's',
                'event-file': 'f',
            },
        });

        const parsedData = parsedArgs?.data || {};

        if (parsedData.help) {
            help(INVOKE);
            return { isHelp: true };
        }

        const props: IProperties = inputs.props;

        const endProps: IInvoke = {
            region: parsedData.region || props?.region,
            functionName: parsedData['function-name'] || props?.function?.functionName,
            qualifier: parsedData.qualifier ?? 'latest',
            eventStdin: parsedData['event-stdin'],
            eventFile: parsedData['event-file'],
            eventName: parsedData['event-name'],
        };

        if (!endProps.region) {
            throw new Error("Region not found. Please specify with --region");
        }

        if (!endProps.functionName) {
            throw new Error("Function Name not found. Please specify with --function-name.");
        }

        const credentials: ICredentials = inputs.credentials;

        const { client, projectId } = await getFunctionClient(credentials, endProps.region);

        endProps.urn = handlerUrn(endProps.region, projectId, 'default', endProps.functionName, endProps.qualifier);
        logger.debug(`endProps: ${JSON.stringify(endProps)}`);
        return {
            credentials,
            baseDir: path.dirname(inputs.path.configPath),
            props: { ...endProps, projectId },
            client,
            args: props.args,
        };
    }

    public async invoke(props: IInvoke, client: FunctionClient) {
        this.spin.info(`Invoking function [${props.functionName}].`);
        logger.debug(`Invoking function [${props.functionName}].`);
        try {
            const event = await new EventService().getEvent(props);
            const request = new InvokeFunctionRequest();
            request.withFunctionUrn(props.urn);
            request.withXCffLogType("tail");
            request.withXCFFRequestVersion("v1");
            request.withBody(JSON.parse(event));
            const result = await client.getFunctionClient().invokeFunction(request);
            this.spin.succeed(`Function [${props.functionName}] invoke success.`);
            logger.log("========= FGS invoke Logs begin =========");
            logger.log(result.log);
            logger.log("========= FGS invoke Logs end =========\n");
            logger.log(`FGS Invoke Result[code: ${result.status}]`);
            logger.log(result.result);
        } catch (err) {
            this.spin.fail(`Invoke function [${props.functionName}] failed.`);
            logger.error(`Invoke function [${props.functionName}] failed. err=${(err as Error).message}`);
            throw err;
        }
    }
}