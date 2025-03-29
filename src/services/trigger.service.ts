import {
    CreateFunctionTriggerRequest,
    CreateFunctionTriggerRequestBody,
    CreateFunctionTriggerRequestBodyTriggerStatusEnum,
    CreateFunctionTriggerRequestBodyTriggerTypeCodeEnum,
    DeleteFunctionTriggerRequest,
    DeleteFunctionTriggerRequestTriggerTypeCodeEnum,
    ListFunctionTriggersRequest,
    TriggerEventDataRequestBody,
    UpdateTriggerRequest,
    UpdateTriggerRequestBody,
    UpdateTriggerRequestTriggerTypeCodeEnum
} from "@huaweicloud/huaweicloud-sdk-functiongraph";
import { spinner } from '@serverless-devs/core';
import { ApigClient } from "../clients/apig.client";
import { FunctionClient } from "../clients/function.client";
import { IApigProps, IEventData, IObsProps, ITimerProps, ITriggerProps, ITriggerResult, TypeCode } from "../interface/trigger.interface";
import { handlerResponse, isString, promptForConfirmOrDetails, randomLenChar, tableShow } from "../utils/util";
import logger from "../common/logger";
import { IProperties, IRemoveProps } from "../interface/interface";

export class TriggerService {
    private spin = spinner();
    private triggerInsMap = {
        [TypeCode.APIG]: (client, props, funcName) => new ApigTrigger(client, props, funcName),
        [TypeCode.OBS]: (client, props, funcName) => new ObsTrigger(client, props, funcName),
        [TypeCode.TIMER]: (client, props, funcName) => new TimerTrigger(client, props, funcName),
    };
    private triggerType: Trigger;

    private supportList = ['APIG', 'OBS', 'TIMER'];

    private supportEditList = ['TIMER'];

    /**
     * 部署触发器
     * @param props 
     * @param client 
     * @returns 
     */
    public async deploy(props: IProperties, client: FunctionClient) {
        if (!props?.trigger) {
            throw new Error('First configure triggers in s.yml.');
        }
        if (!this.supportList.includes(props.trigger.triggerTypeCode)) {
            throw new Error('Only APIG, OBS, and timer triggers available.');
        }
        const triggerType = props.trigger.triggerTypeCode as TypeCode;
        this.triggerType = this.triggerInsMap[triggerType](client, props.trigger, props.function.functionName);
        try {
            const trigger: ITriggerResult = await this.getTrigger(client, props.urn, triggerType, this.triggerType.getTriggerName());
            if (trigger) {
                if (this.supportEditList.includes(trigger.trigger_type_code)
                    && trigger.trigger_status !== this.triggerType.triggerStatus) {
                    return this.update(client, trigger.trigger_id, props.urn);
                }
                return this.handleResponse(trigger);
            }
            return this.create(client, props.urn);
        } catch (error) {
            throw error;
        } finally {
            this.spin.stop();
        }
    }

    /**
     * 删除触发器
     * @param param0 
     * @param client 
     */
    public async remove({ isYml, triggerName, triggerType, triggerInfo, urn, functionName, version }: IRemoveProps, client: FunctionClient) {
        if (!isYml && !triggerType) {
            throw new Error('Trigger type is required. Please specify with --trigger-type');
        }
        if (!isYml && !triggerName) {
            throw new Error('Trigger name is required. Please specify with --trigger-name');
        }

        if (isYml && !triggerInfo) {
            throw new Error('First configure triggers in s.yml.');
        }
        try {
            this.spin.info(`Deleting trigger.`);
            logger.debug(`Deleting trigger.`);
            const type = triggerType ? triggerType : triggerInfo?.triggerTypeCode;
            const funcUrn = version ? `${urn}:${version}` : `${urn}:latest`;
            this.triggerType = this.triggerInsMap[type](client, { ...triggerInfo, triggerTypeCode: type }, functionName);
            const trigger: ITriggerResult = await this.getTrigger(client, funcUrn, type, triggerName);
            if (!trigger) {
                throw new Error('The trigger does not exist');
            }

            const request = this.triggerType.getDeleteRequest(trigger.trigger_id, funcUrn);
            const result: any = await client.getFunctionClient().deleteFunctionTrigger(request);
            handlerResponse(result);
            this.spin.succeed(`Trigger deleted.`);
            logger.debug(`Trigger deleted.`);
        } catch (error) {
            this.spin.fail(`Delete trigger failed.`);
            logger.error(`Delete trigger failed. err=${(error as Error).message}`);
            throw error;
        }
    }

    /**
     * 创建触发器
     * @returns 
     */
    private async create(client: FunctionClient, urn = '') {
        this.spin.info(`Creating trigger.`);
        logger.debug(`Creating trigger.`);
        try {
            const request = await this.triggerType.getCreateRequest(urn);
            const result: any = await client.getFunctionClient().createFunctionTrigger(request);
            handlerResponse(result);
            this.spin.succeed(`Trigger created.`);
            logger.debug(`Trigger created.`);
            return this.handleResponse(result);
        } catch (err) {
            this.spin.fail(`Create trigger failed.`);
            logger.error(`Create trigger failed. err=${(err as Error).message}`);
            throw err;
        }
    }

    /**
     * 更新触发器
     * @param triggerId 
     * @returns 
     */
    private async update(client: FunctionClient, triggerId = '', urn = '') {
        this.spin.info(`Updating trigger.`);
        logger.debug(`Updating trigger.`);
        try {
            const request = this.triggerType.getUpdateRequest(triggerId, this.triggerType.triggerStatus, urn);
            const result: any = await client.getFunctionClient().updateTrigger(request);
            handlerResponse(result);
            this.spin.succeed(`Trigger updated.`);
            logger.debug(`Trigger updated.`);
            return this.handleResponse(result);
        } catch (err) {
            this.spin.fail(`Update trigger failed.`);
            logger.error(`Update trigger failed. err=${(err as Error).message}`);
            throw err;
        }
    }


    /**
     * 校验触发器是否存在
     * 1. 获取本地存储的触发器ID
     * 2. 获取当前函数的触发器列表
     * 3. 触发器ID存在，通过ID获取对应的触发器
     * 4. 触发器ID不存在，通过EventData的内容判断触发器是否存在
     * @returns 
     */
    private async getTrigger(client: FunctionClient, urn = '', triggerType = '', triggerName = ''): Promise<ITriggerResult | null> {
        try {
            const request = new ListFunctionTriggersRequest().withFunctionUrn(urn);
            const result: any = await client.getFunctionClient().listFunctionTriggers(request);
            handlerResponse(result);
            const list = result.filter(res => res.trigger_type_code === triggerType);
            for (let i = 0; i < list.length; i++) {
                const isEqual = await this.triggerType.isEqual(list[i].event_data, triggerName);
                if (isEqual) {
                    return list[i];
                }
            }
            return null;
        } catch (err) {
            return null;
        }
    }

    /**
     *  处理函数信息输出
     * @param response
     * @returns
     */
    private handleResponse(response: any) {
        const triggerInfo = [
            {
                desc: "TriggerId",
                example: response.trigger_id,
            },
            {
                desc: "TriggerTypeCode",
                example: response.trigger_type_code,
            },
            {
                desc: "TriggerStatus",
                example: response.trigger_status,
            },
        ];
        const eventDataInfo = Object.keys(response.event_data || {}).map(key => {
            return {
                desc: key,
                example: response.event_data[key]
            }
        }).filter(key => isString(key.example));

        return [
            {
                header: "Trigger",
                content: triggerInfo,
            },
            {
                header: "Trigger event data",
                content: eventDataInfo,
            },
        ];
    }
}

export class Trigger {
    constructor(
        public readonly client: FunctionClient,
        public readonly triggerInfo: ITriggerProps = { triggerTypeCode: TypeCode.APIG, eventData: {} },
        public readonly functionName = '',
    ) { }

    /**
     * 获取触发器类型
     * @returns 
     */
    get triggerTypeCode() {
        return this.triggerInfo.triggerTypeCode;
    }

    /**
     * 获取触发器状态
     * @returns 
     */
    get triggerStatus() {
        return this.triggerInfo.status;
    }

    getTriggerName() {
        return this.triggerInfo.eventData.name;
    }

    /**
     * 封装创建触发器请求体
     * @returns 
     */
    async getCreateRequest(urn = ''): Promise<CreateFunctionTriggerRequest> {
        const eventData = await this.getEventData();
        const body = new CreateFunctionTriggerRequestBody()
            .withEventData(eventData as TriggerEventDataRequestBody)
            .withTriggerStatus(this.triggerInfo.status as CreateFunctionTriggerRequestBodyTriggerStatusEnum)
            .withEventTypeCode(this.triggerInfo.eventTypeCode)
            .withTriggerTypeCode(this.triggerInfo.triggerTypeCode as CreateFunctionTriggerRequestBodyTriggerTypeCodeEnum);
        return new CreateFunctionTriggerRequest()
            .withBody(body)
            .withFunctionUrn(urn);
    }

    /**
     * 封装更新触发器的请求体
     * @param triggerId 触发器ID
     * @returns 
     */
    getUpdateRequest(triggerId = '', status, urn = ''): UpdateTriggerRequest {
        const body = new UpdateTriggerRequestBody()
            .withTriggerStatus(status);
        return new UpdateTriggerRequest()
            .withTriggerId(triggerId)
            .withBody(body)
            .withFunctionUrn(urn)
            .withTriggerTypeCode(this.triggerInfo.triggerTypeCode.toString() as UpdateTriggerRequestTriggerTypeCodeEnum);
    }

    /**
     *  封装删除触发器的请求体
     * @param triggerId 触发器ID
     * @returns 
     */
    getDeleteRequest(triggerId = '', urn = ''): DeleteFunctionTriggerRequest {
        return new DeleteFunctionTriggerRequest()
            .withTriggerId(triggerId)
            .withFunctionUrn(urn)
            .withTriggerTypeCode(this.triggerInfo.triggerTypeCode.toString() as DeleteFunctionTriggerRequestTriggerTypeCodeEnum);
    }

    /**
    * 判断触发器内容是否相等
    * @param trigger 
    * @param name 判断名称
    * @returns 
    */
    async isEqual(trigger: IEventData, name = ''): Promise<boolean> {
        return Promise.resolve(false);
    }

    /**
     * 获取触发器数据
     * @returns 
     */
    protected async getEventData(): Promise<IEventData> {
        return Promise.resolve({});
    };
}

/**
 * APIG 触发器
 */
export class ApigTrigger extends Trigger {
    private apigClient: ApigClient;
    private eventData: IEventData;

    /**
     * 获取APIG触发器的EventData
     * 1. 先获取API分组
     * 2. 如果分组存在，默认取第一个分组
     * 3. 如果不存在，先创建一个分组
     * @returns 
     */
    protected async getEventData(): Promise<IEventData> {
        if (this.eventData) {
            return this.eventData;
        }
        try {
            this.apigClient = this.client.getApigClient();
            const eventData: IApigProps = this.triggerInfo.eventData;
            const { groups } = await this.apigClient.listApiGroups();
            const group: any = await this.findGroups(groups, eventData.groupName ?? `APIG_${randomLenChar(6)}`);

            this.eventData = {
                group_id: group.id,
                sl_domain: group.sl_domain,
                name: group.name ?? this.functionName,
                path: `/${this.functionName}`,
                function_info: {
                    timeout: eventData.timeout ?? 5000
                },
                auth: eventData.auth ?? 'IAM',
                protocol: eventData.protocol ?? 'HTTPS',
                env_id: "DEFAULT_ENVIRONMENT_RELEASE_ID",
                env_name: "RELEASE",
                match_mode: "SWA",
                req_method: "ANY",
                backend_type: "FUNCTION",
                type: 1,
            }
            return this.eventData;
        } catch (err) {
            throw err;
        }
    };

    async isEqual(trigger: IEventData, name = ''): Promise<boolean> {
        if (name) {
            return name === trigger.name;
        }
        const eventData = await this.getEventData();
        return trigger && eventData.name === trigger.name
            && eventData.auth === trigger.auth
            && eventData.path === trigger.path
            && eventData.protocol === trigger.protocol
            && eventData.group_id === trigger.group_id
            && eventData.env_id === trigger.env_id;
    }

    private async findGroups(groups = [], groupName = '') {
        let group = groups.find(g => g.name === groupName);
        if (group) {
            return group;
        }
        let msg = `Group [${groupName}] not found.`;
        const suffix = '\nCreate now?';
        if (groups.length > 0) {
            tableShow(groups.slice(0, 20), ['name', 'id']);
            msg += `\nSelect an existing group or create one named [${groupName}].`;
        }
        if (await promptForConfirmOrDetails(`${msg}${suffix}`)) {
            const result = await this.apigClient.createApiGroup(groupName);
            return result;
        }
        throw new Error(`The configured groupname[${groupName}] does not exist.`);
    }
}

/**
 * OBS 触发器
 */
export class ObsTrigger extends Trigger {

    async getEventData(): Promise<IEventData> {
        const eventData: IObsProps = this.triggerInfo.eventData;
        return {
            bucket: eventData.bucket,
            events: eventData.events,
            name: eventData.name ?? `obs-event-${randomLenChar(6)}`,
            prefix: eventData.prefix ?? null,
            suffix: eventData.suffix ?? null
        };
    }

    async isEqual(trigger: IEventData, name = ''): Promise<boolean> {
        if (name) {
            return name === trigger.bucket;
        }
        const eventData: IObsProps = this.triggerInfo.eventData;
        return trigger && eventData.bucket === trigger.bucket
            && eventData.name === trigger.name
            && eventData.prefix === trigger.prefix
            && eventData.suffix === trigger.suffix
            && eventData.events === trigger.events;
    }

    getTriggerName() {
        const eventData: IObsProps = this.triggerInfo.eventData;
        return eventData.bucket;
    }
}

/**
 * TIMER 触发器
 */
export class TimerTrigger extends Trigger {

    async getEventData(): Promise<IEventData> {
        const eventData: ITimerProps = this.triggerInfo.eventData;
        return {
            name: eventData.name ?? `Timer-${randomLenChar(6)}`,
            schedule: eventData.schedule ?? '3m',
            schedule_type: eventData.scheduleType ?? 'Rate',
            user_event: eventData.userEvent
        };
    }

    async isEqual(trigger: IEventData, name = ''): Promise<boolean> {
        if (name) {
            return name === trigger.name;
        }
        const eventData: ITimerProps = this.triggerInfo.eventData;
        return trigger && eventData.name === trigger.name
            && eventData.schedule === trigger.schedule
            && eventData.scheduleType === trigger.schedule_type
            && eventData.userEvent === trigger.user_event;
    }
}