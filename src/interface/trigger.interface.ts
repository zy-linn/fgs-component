export enum Auth {
    IAM = 'IAM',
    App = 'App',
    NONE = 'None'
}

export enum protocol {
    HTTP = 'HTTP',
    HTTPS = 'HTTPS'
}

export enum ScheduleType {
    RATE = 'Rate',
    CRON = 'Cron'
}

export interface IApigProps {
    name?: string;
    groupName?: string;
    auth?: Auth;
    protocol?: protocol;
    timeout?: number;
}

export interface IObsProps {
    bucket?: string;
    events?: Array<string>;
    name?: string;
    prefix?: string;
    suffix?: string;
}

export interface ITimerProps {
    name?: string;
    scheduleType?: ScheduleType;
    schedule?: string;
    userEvent?: string;
}
export enum TypeCode {
    APIG = 'APIG',
    OBS = 'OBS',
    TIMER = 'TIMER'
}

export enum TriggerStatus {
    ACTIVE = 'ACTIVE',
    DISABLED = 'DISABLED'
}

export interface ITriggerProps {
    triggerId?: string;
    triggerTypeCode: string; // 触发器类型。
    status?: string; // 触发器状态，取值为ACTIVE,DISABLED。
    eventTypeCode?: string; // 消息代码。
    eventData: IObsProps | ITimerProps | IApigProps; // 事件结构体。
}

export interface IEventData {
    [key: string]: any
}

export interface ITriggerResult {
    trigger_id?: string;
    trigger_type_code: string; // 触发器类型。
    trigger_status?: string; // 触发器状态，取值为ACTIVE,DISABLED。
    event_type_code?: string; // 消息代码。
    event_data: IEventData; // 事件结构体。
}
