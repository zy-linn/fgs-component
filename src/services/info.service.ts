import path from "path";
import { commandParse, help, spinner } from "@serverless-devs/core";
import logger from "../common/logger";
import { ICredentials, IInputs, IProperties, InputProps } from "../interface/interface";
import { getFunctionClient, handlerUrn } from "../utils/util";
import { FunctionClient } from "../clients/function.client";
import { ShowFunctionConfigRequest } from "@huaweicloud/huaweicloud-sdk-functiongraph";
import { INFO } from "../help/info";
export interface IInfo {
    region?: string;
    functionName?: string;
    qualifier?: string;
    urn?: string;
    projectId?: string;
}

export class InfoService {
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
            },
        });

        const parsedData = parsedArgs?.data || {};

        if (parsedData.help) {
            help(INFO);
            return { isHelp: true };
        }

        const props: IProperties = inputs.props;

        const endProps: IInfo = {
            region: parsedData.region || props?.region,
            functionName: parsedData['function-name'] || props?.function?.functionName,
            qualifier: parsedData.qualifier ?? 'latest',
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

    public async info(props: IInfo, client: FunctionClient) {
        this.spin.info(`Displaying function [${props.functionName}] information.`);
        logger.debug(`Displaying function [${props.functionName}] information.`);
        try {
            const request = new ShowFunctionConfigRequest().withFunctionUrn(props.urn);
            const result: any = await client.getFunctionClient().showFunctionConfig(request);
            logger.debug('config: ' + JSON.stringify(result));
            const res = `fgs-deploy-test:
    region: ${props.region}
    function:
        functionName: ${result.func_name}
        handler: ${result.handler}
        memorySize: ${result.memory_size}
        timeout: ${result.timeout}
        runtime: ${result.runtime}
        description: ${result.description ?? ''}
        environmentVariables: ${result.user_data ?? '{}'}`;
            this.spin.succeed(`Display function [${props.functionName}] information success.`);
            logger.log(res);
        } catch (err) {
            logger.error(`Display function [${props.functionName}] information failed. err=${(err as Error).message}`);
            throw err;
        }
    }
}