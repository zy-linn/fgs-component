export interface IFunctionProps {
    functionName: string; // 函数名称
    runtime: string; // 运行时
    timeout: number; // 函数执行超时时间
    handler: string; // 函数执行入口
    memorySize: number; // 函数消耗的内存
    codeType: string; // 函数代码类型
    package?: string;
    codeUrl?: string; 
    description?: string; // 函数描述
    environmentVariables?: { [prop: string]: any };
    agencyName?: string; // 委托名称
    vpcId?: string;
    subnetId?: string;
    dependVersionList?: Array<string>; // 依赖版本id列表
    code?: {
        codeUri: string;
    },
    concurrency?: number;
    concurrentNum?: number;
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
    },
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