## function 字段

| 参数名                                              | 必填  | 类型                               | 参数描述                                                               |
| --------------------------------------------------- | ----- | ---------------------------------- | ---------------------------------------------------------------------- |
| functionName          | True  | String     | 函数名称                         |
| handler          | True  | String     | 函数执行入口，规则：xx.xx，必须包含“. ”   |
| [runtime](#runtime)           | True  | String     | 运行时   |
| package          | False  | String     | 函数所属的分组Package，用于用户针对函数的自定义分组，默认为default   |
| memorySize          | True  | Number     | 函数消耗的内存。 单位M。 取值范围为：128、256、512、768、1024、1280、1536、1792、2048、2560、3072、3584、4096   |
| timeout          | True  | Number     | 函数执行超时时间，超时函数将被强行停止，范围3～900秒   |
| [codeType](#code-type)          | True  | String     | 函数代码类型  |
| codeUrl          | False  | String     | 当CodeType为obs时，该值为函数代码包在OBS上的地址，CodeType为其他值时，该字段为空。  |
| userData(别名environmentVariables)       | False | [Struct](#environment-variables)    | 环境变量。最多定义20个，总长度不超过4KB |
| xrole(别名agencyName)          | False  | String     | 委托名称，需要IAM支持，并在IAM界面创建委托，当函数需要访问其他服务时，必须提供该字段  |
| funcVpc          | False  | [Struct](#func-vpc)     | 虚拟私有云唯一标识。配置时，agencyName必填。https://console.huaweicloud.com/vpc/#/vpc/vpcs/list  |
| domainNames          | False  | String     | 内网域名配置，更新函数时生效  |
| dependVersionList          | False  | List\<String\>        | 依赖包，取依赖包的ID  |
| code          | False  | [Struct](#func-code)        | 本地代码地址，当CodeType为zip时，必填  |
| concurrency          | False  | Number        | 单函数最大实例数，取值-1到1000。 -1代表该函数实例数无限制； 0代表该函数被禁用  |
| concurrentNum          | False  | Number        | 单实例最大并发数，取值-1到1000  |
| enterpriseProjectId          | False  | String        | 企业项目ID，默认值为 0  |
| initializerHandler          | False  | String        | 函数初始化入口 |
| initializerTimeout          | False  | Number        | 函数初始化超时时间，超时函数将被强行停止，范围 1 ~ 300秒。当前配置初始化函数时，此参数必填 |
| description             | False | String                             | function 的简短描述        |


参考案例：

```yaml
function:
  functionName: event-function
  description: this is a test
  runtime: Node.js14.18
  handler: index.handler
  memorySize: 128
  timeout: 60
  code: 
    codeUri: ./code
  environmentVariables:
    test: 123
    hello: world
```

### runtime

runtime 目前支持

`Node.js14.18`、`Node.js12.13`、`Node.js10.16`、`Node.js8.10`、`nodejs6`、`nodejs4.4`  
`Python3.9`、`Python3.6`、`Python2.7`
`Java11`、`Java8`  
`Go1.x`、`Go1.8`  
`PHP7.3`  
`http`  
`Custom`

### Code Type
函数代码类型:

- inline: UI在线编辑代码。 
- zip: 函数代码为zip包。 
- obs: 函数代码来源于obs存储。 
- jar: 函数代码为jar包，主要针对Java函数。

### Func Code 
| 参数名              | 必填  | 类型   | 参数描述                                                                       |
| ------------------- | ----- | ------ | ------------------------------------------------------------------------------ |
| codeUri          | True  | String | 本地代码地址                          |


### Environment Variables

Object 格式，例如：

```
DB_connection: jdbc:mysql://rm-bp90434sds45c.mysql.rds.aliyuncs.com:3306/litemall
```

### Func Vpc 
函数VPC配置

| 参数名              | 必填  | 类型   | 参数描述                                                                       |
| ------------------- | ----- | ------ | ------------------------------------------------------------------------------ |
| vpcId          | True  | String | VPC唯一标识|
| subnetId          | True  | String | 子网编码|  
| cidr          | False  | String | 子网掩码|   
| gateway          | False  | String | 网关| 

当然不推荐通过明文将敏感信息写入到`s.yaml`
