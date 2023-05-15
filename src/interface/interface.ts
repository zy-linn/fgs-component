import { FunctionClient } from "../clients/function.client";
import { ITriggerProps } from "./trigger.interface";
import { IFunctionProps } from "./function.interface";

export enum ServiceType {
    APIG = 'apig',
    IAM = 'iam',
    FUNCTIONGRAPH = 'functiongraph',
    OBS = 'obs'
}

export enum MethodType {
    DEPLOY,
    REMOVE
}

export enum CommandType {
    ALL = 'all',
    FUNCTION = 'function',
    TRIGGER = 'trigger'
}

export interface ICredentials {
    AccountID?: string;
    AccessKeyID?: string;
    AccessKeySecret?: string;
    SecurityToken?: string;
    SecretID?: string;
    SecretKey?: string;
    SecretAccessKey?: string;
    KeyVaultName?: string;
    TenantID?: string;
    ClientID?: string;
    ClientSecret?: string;
    PrivateKeyData?: string
}

export interface InputProps {
    props: IProperties; // 用户自定义输入
    credentials: ICredentials; // 用户秘钥
    appName: string; // 
    project: {
      component: string; // 组件名（支持本地绝对路径）
      access: string; // 访问秘钥名
      projectName: string; // 项目名
    };
    command: string; // 执行指令
    args: string; // 命令行 扩展参数
    argsObj: any;
    path: {
      configPath: string // 配置路径
    }
}
  
export interface IProperties {
    region?: string;
    urn?: string;
    function?: IFunctionProps;
    triggers?: ITriggerProps;
    [prop: string]: any;
}

// 处理后的配置信息
export interface IInputs {
    projectId?: string;
    credentials?: ICredentials;
    subCommand?: string;
    props?: IProperties;
    client?: FunctionClient;
    args?: string;
    isHelp?: boolean
}

export interface IRemoveProps {
    region: string;
    functionName: string;
    urn: string;
    version?: string;
    aliasName?: string;
    triggerName?: string;
    triggerType?: string;
    triggerInfo?: ITriggerProps;
    isYml: boolean;
}