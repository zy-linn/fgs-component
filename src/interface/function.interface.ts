export interface IFunctionProps
  extends BasicConfig,
    PermissionConfig,
    NetConfig,
    ConcurrencyConfig,
    LogConfig,
    AdvancedConfig {
  functionName: string; // 函数名称
  runtime: string; // 运行时
  codeType: string; // 函数代码类型
  package?: string;
  codeUrl?: string;
  environmentVariables?: { [prop: string]: any };
  vpcId?: string;
  subnetId?: string;
  dependVersionList?: Array<string>; // 依赖版本id列表
  code?: {
    codeUri: string;
  };
  userData?: any;
  encryptedUserData?: any;
}

export interface BasicConfig {
  memorySize?: number;
  timeout?: number;
  handler?: string;
  description?: string;
  enterpriseProjectId?: string;
}

export interface PermissionConfig {
  xrole?: string;
  appXrole?: string;
  /**
   * @deprecated 使用xrole代替
   */
  agencyName?: string;
}

export interface NetConfig {
  networkController?: any;
  /**
   * @deprecated 使用funcVpc下配置
   */
  vpcId?: string;
  /**
   * @deprecated 使用funcVpc下配置
   */
  subnetId?: string;
  domainNames?: any[];
  funcVpc: {
    vpcName?: string;
    vpcId: string;
    subnetName?: string;
    subnetId?: string;
    cidr?: string;
    gateway?: string;
  };
}

export interface ConcurrencyConfig {
  concurreny?: number;
  concurrentNum?: number;
}

export interface LogConfig {
  ltsGroupId?: string;
  ltsStreamId?: string;
  ltsGroupName?: string;
  ltsStreamName: string; // 当前SDK需要此值存在
}

export interface AdvancedConfig {
  initializerHandler?: string;
  initializerTimeout?: number;
  enableDynamicMemory: boolean;
  preStopHandler?: string;
  preStopTimeout?: number;
}

export interface IFunctionResult {
  func_name: string; // 函数名称
  func_urn?: string;
  package: string; // 函数所属的分组Package
  runtime: string; // 运行时
  timeout: number; // 函数执行超时时间
  handler: string; // 函数执行入口
  memory_size: number; // 函数消耗的内存
  namespace?: string;
  project_name?: string;
  code_type?: string; // 函数代码类型
  code_filename?: string; // 函数的文件名
  func_code?: IFuncCode; // FuncCode结构返回体。
  description?: string; // 函数描述
  initializer_handler?: string; // 函数初始化入口
  initializer_timeout?: number; // 初始化超时时间
  enterprise_project_id?: string; // 企业项目ID
  type?: string; // 函数版本
  user_data?: string; // 用户自定义的name/value信息
  encrypted_user_data?: string; // 用户自定义的name/value信息，用于需要加密的配置。
  app_xrole?: string; // 函数使用的权限委托名称
  xrole?: string; // 函数使用的权限委托名称
  depend_version_list?: Array<string>; // 依赖版本id列表
  func_vpc?: IVpc;
  strategy_config: IStrategyConfig;
  version: string;
  code?: {
    codeUri: string;
  };
  network_controller: {
    disable_public_network?: boolean;
    trigger_access_vpcs?: any[];
  };
  domain_names: string;
  log_group_id: string;
  log_stream_id: string;
  enable_dynamic_memory: boolean;
}

export interface IFuncCode {
  file: string;
  link: string;
}

export interface IVpc {
  vpc_id: string;
  vpc_name: string;
  subnet_id: string;
  subnet_name: string;
  cidr: string;
  gateway: string;
}

export interface IStrategyConfig {
  concurrency: number;
  concurrent_num: number;
}
