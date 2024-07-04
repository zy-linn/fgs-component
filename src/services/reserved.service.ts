import * as fs from 'fs-extra';
import { commandParse, help, spinner } from "@serverless-devs/core";
import {
    CronConfig,
    TacticsConfig,
    ListReservedInstanceConfigsRequest,
    UpdateFunctionReservedInstancesCountRequest,
    UpdateFunctionReservedInstancesCountRequestBody
} from "@huaweicloud/huaweicloud-sdk-functiongraph";
import { RESERVED, RESERVED_GET, RESERVED_PUT } from "../help/reserved";
import { ICredentials, IInputs } from "../interface/interface";
import logger from "../common/logger";
import { getFunctionClient, handlerErrorMsg, handlerResponse, handlerUrn } from "../utils/util";
import { FunctionClient } from "../clients/function.client";

interface IReservedProps {
    region: string;
    functionName: string;
    urn: string;
    qualifierType?: 'version' | 'alias';
    idleMode?: boolean;
    qualifierName?: string;
    count?: number;
    config?: string;
    tacticsConfig?: any;
};

const RESERVED_COMMAND: string[] = ['get', 'put'];
const RESERVED_COMMAND_HELP_KEY = {
    get: RESERVED_GET,
    put: RESERVED_PUT,
};

export class ReservedService {
    private spin = spinner();
    public async handleInputs(inputs): Promise<IInputs> {
        logger.debug(`inputs.props: ${JSON.stringify(inputs.props)}`);
        logger.debug(`inputs.args: ${JSON.stringify(inputs.args)}`);
        logger.debug(`inputs.argsObj: ${JSON.stringify(inputs.argsObj)}`);
        if (!inputs.credentials.AccessKeyID || !inputs.credentials.SecretAccessKey) {
            handlerErrorMsg(this.spin, logger, "Havn't set huaweicloud credentials. Run $s config add .");
        }

        const parsedArgs: { [key: string]: any } = commandParse(inputs, {
            boolean: ["help", 'table'],
            string: ['region', 'function-name', 'qualifier-type', 'qualifier-name', 'idle-mode', 'config', 'config-path'],
            alias: { help: "h" },
        });

        const parsedData = parsedArgs?.data || {};
        const rawData = parsedData._ || [];

        const subCommand = rawData[0];
        logger.debug(`reserved subCommand: ${subCommand}`);
        if (!RESERVED_COMMAND.includes(subCommand)) {
            help(RESERVED);
            handlerErrorMsg(this.spin, logger, `Does not support ${subCommand} command.`);
        }

        if (parsedData.help) {
            help(RESERVED_COMMAND_HELP_KEY[subCommand])
            return { isHelp: true, subCommand };
        }

        const props = inputs.props || {};
        logger.debug(`parsedData: ${JSON.stringify(parsedData)}`);

        const endProps: IReservedProps = {
            region: parsedData.region || props.region,
            functionName: parsedData['function-name'] || props.function?.functionName,
            qualifierType: parsedData['qualifier-type'] ?? 'version',
            qualifierName: parsedData['qualifier-name'] ?? 'latest',
            idleMode: parsedData['idle-mode'] ?? false,
            count: parsedData['count'],
            config: parsedData['config'],
            urn: '',
        };
        if (!endProps.region) {
            handlerErrorMsg(this.spin, logger, "Region not found. Please specify with --region");
            return;
        }

        if (!endProps.functionName) {
            handlerErrorMsg(this.spin, logger, "Function Name not found. Please specify with --function-name.");
        }

        if (endProps.config) {
            try {
                const fileStr = fs.readFileSync(endProps.config, 'utf8');
                endProps['tacticsConfig'] = JSON.parse(fileStr);
            } catch (ex) {
                handlerErrorMsg(this.spin, logger,
                    `Reading ${endProps.config} file failed, please check whether this file exists and is a standard JSON`,
                );
            }
        }

        const credentials: ICredentials = inputs.credentials;

        const { client, projectId } = await getFunctionClient(credentials, endProps.region);
        const tag = this.getTag(endProps.qualifierType, parsedData['qualifier-name']);
        endProps.urn = handlerUrn(endProps.region, projectId, 'default', endProps.functionName, tag);
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
     * 获取函数预留实例信息
     * @param props 
     * @param client 
     * @returns 
     */
    async get(props: IReservedProps, client: FunctionClient) {
        const { functionName, urn } = props;
        this.spin.info(`Querying reserved instances [${functionName}]`);
        logger.debug(`Querying reserved instances [${functionName}]`);
        try {
            const request = new ListReservedInstanceConfigsRequest().withFunctionUrn(urn);
            const result = await client.getFunctionClient().listReservedInstanceConfigs(request);
            const res = this.handlerReservedInstancesConfig(result, functionName);
            logger.debug(`Reserved instances [${functionName}] queried. res = ${JSON.stringify(res)}`);
            return res;
        } catch (err) {
            this.spin.fail(`Query reserved instances [${functionName}] failed.`);
            logger.error(`Query reserved instances [${functionName}] failed. err=${(err as Error).message}`);
            throw err;
        } finally {
            this.spin.stop();
        }
    }

    /**
     * 设置函数预留实例信息
     * @param props 
     * @param client 
     * @returns 
     */
    async put(props: IReservedProps, client: FunctionClient) {
        const { functionName, urn, count } = props;
        // 判断预留实例数是否配置
        if (count === undefined || count === null) {
            handlerErrorMsg(this.spin, logger, "Count not found. Please specify with --count.");
        }

        // 判断预留实例数是否为数字
        if (isNaN(Number(count))) {
            handlerErrorMsg(this.spin, logger, "Count must be number. Please specify with --count.");
        }
        const insCount = count < 0 ? 0 : count;
        this.spin.info(`Updating reserved instances [${functionName}]`);
        logger.debug(`Updating reserved instances [${functionName}]`);
        try {
            // 当 count 等于 0 时，表示删除
            const cronConfigs = this.getCronConfig(insCount, props.tacticsConfig?.scheduleConfig);
            const body = new UpdateFunctionReservedInstancesCountRequestBody()
                .withCount(insCount)
                .withIdleMode(props.idleMode)
                .withTacticsConfig(new TacticsConfig().withCronConfigs(cronConfigs));
            const request = new UpdateFunctionReservedInstancesCountRequest().withFunctionUrn(urn).withBody(body);
            logger.debug(`put request = ${JSON.stringify(request)}`);
            const result = await client.getFunctionClient().updateFunctionReservedInstancesCount(request);
            const res = this.handlerReservedInstances(result);
            this.spin.succeed(`Reserved instances [${functionName}] updated.`);
            logger.debug(`Updated reserved instances [${functionName}]. res = ${JSON.stringify(res)}`);
            return res;
        } catch (err) {
            this.spin.fail(`Updated reserved instances [${functionName}] failed.`);
            logger.error(`Updated reserved instances [${functionName}] failed. err=${(err as Error).message}`);
            throw err;
        } finally {
            this.spin.stop();
        }
    }

    private handlerReservedInstancesConfig(result, functionName) {
        handlerResponse(result);
        logger.debug(`result = ${JSON.stringify(result)}`);
        return result.reserved_instances?.map(ins => {
            return {
                functionName,
                count: ins.min_count,
                idleMode: ins.idle_mode,
                qualifierType: ins.qualifier_type,
                qualifierName: ins.qualifier_name,
                scheduleConfig: ins.tactics_config?.cron_configs?.map(c => {
                    return {
                        name: c.name,
                        cron: c.cron,
                        count: c.count,
                        startTime: new Date(c.start_time * 1000).toJSON(),
                        expiredTime: new Date(c.expired_time * 1000).toJSON(),
                    };
                }) ?? []
            };
        });
    }

    private handlerReservedInstances(result) {
        handlerResponse(result);
        logger.debug(`result = ${JSON.stringify(result)}`);
        return result.tactics_config?.cron_configs?.map(c => {
            return {
                name: c.name,
                cron: c.cron,
                count: c.count,
                startTime: new Date(c.start_time * 1000).toJSON(),
                expiredTime: new Date(c.expired_time * 1000).toJSON(),
            };
        }) ?? [];
    }

    private getTag(type, name) {
        if (type === 'alias' && name) {
            return `!${name}`;
        }
        return name ?? 'latest';
    }

    private getCronConfig(count, scheduleConfig = []): Array<CronConfig> {
        if (count <= 0) {
            return [];
        }
        return scheduleConfig.map(s => {
            return new CronConfig()
                .withCount(s.count < count ? count : s.count)
                .withName(s.name)
                .withCron(s.cron)
                .withStartTime(new Date(s.startTime).getTime() / 1000)
                .withExpiredTime(new Date(s.expiredTime).getTime() / 1000)
        })
    }
}