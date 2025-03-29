## function 字段

| 参数名                              | 必填  | 类型                             | 参数描述                                                                                                                                                                                                                                                           |
| ----------------------------------- | ----- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| functionName                        | True  | String                           | 函数名称                                                                                                                                                                                                                                                           |
| handler                             | True  | String                           | 函数执行入口，规则：xx.xx，必须包含“. ”                                                                                                                                                                                                                            |
| [runtime](#runtime)                 | True  | String                           | 运行时                                                                                                                                                                                                                                                             |
| package                             | False | String                           | 函数所属的分组 Package，用于用户针对函数的自定义分组，默认为 default                                                                                                                                                                                               |
| memorySize                          | True  | Number                           | 函数消耗的内存。 单位 M。 取值范围为：128、256、512、768、1024、1280、1536、1792、2048、2560、3072、3584、4096                                                                                                                                                     |
| timeout                             | True  | Number                           | 函数执行超时时间，超时函数将被强行停止，范围 3 ～ 900 秒                                                                                                                                                                                                           |
| [codeType](#code-type)              | True  | String                           | 函数代码类型                                                                                                                                                                                                                                                       |
| codeUrl                             | False | String                           | 当 CodeType 为 obs 时，该值为函数代码包在 OBS 上的地址，CodeType 为其他值时，该字段为空。                                                                                                                                                                          |
| userData(别名 environmentVariables) | False | [Struct](#environment-variables) | 环境变量。最多定义 20 个，总长度不超过 4KB, userData 与 environmentVariables 同事存在时，userData 字段生效                                                                                                                                                         |
| xrole(别名 agencyName)              | False | String                           | 委托名称，需要 IAM 支持，并在 IAM 界面创建委托，当函数需要访问其他服务时，必须提供该字段                                                                                                                                                                           |
| funcVpc                             | False | [Struct](#func-vpc)              | 虚拟私有云唯一标识。配置时，agencyName 必填。https://console.huaweicloud.com/vpc/#/vpc/vpcs/list                                                                                                                                                                   |
| domainNames                         | False | [Struct](#domain-name)           | 内网域名配置，更新函数时生效。https://console.huaweicloud.com/dns/#/dns/privatezones                                                                                                                                                                               |
| dependVersionList                   | False | List\<String\>                   | 依赖包，取依赖包的 ID                                                                                                                                                                                                                                              |
| code                                | False | [Struct](#func-code)             | 本地代码地址，当 CodeType 为 zip 时，必填                                                                                                                                                                                                                          |
| concurrency                         | False | Number                           | 单函数最大实例数，取值-1 到 1000。 -1 代表该函数实例数无限制； 0 代表该函数被禁用                                                                                                                                                                                  |
| concurrentNum                       | False | Number                           | 单实例最大并发数，取值-1 到 1000                                                                                                                                                                                                                                   |
| enterpriseProjectId                 | False | String                           | 企业项目 ID，默认值为 0                                                                                                                                                                                                                                            |
| initializerHandler                  | False | String                           | 函数初始化入口                                                                                                                                                                                                                                                     |
| initializerTimeout                  | False | Number                           | 函数初始化超时时间，超时函数将被强行停止，范围 1 ~ 300 秒。当配置了初始化函数，此参数必填                                                                                                                                                                          |
| ltsGroupId                          | False | String                           | 日志组 ID                                                                                                                                                                                                                                                          |
| ltsGroupName                        | False | String                           | 日志组名称。当配置了日志组 ID，此参数必填                                                                                                                                                                                                                          |
| ltsStreamId                         | False | String                           | 日志流 ID。当配置了日志组 ID，此参数必填                                                                                                                                                                                                                           |
| ltsStreamName                       | False | String                           | 日志流名称。当配置了日志组 ID，此参数必填                                                                                                                                                                                                                          |
| enableLtsLog                        | False | Boolean                          | 启用日志配置开关。创建函数时，配置为 false 时不创建日志组日志流；为 true 时，若日志配置存在则使用日志配置，若日志配置不存在，则创建默认的日志组日志流。更新函数时，若为 true 且配置了日志配置，则开启日志；若为 false，则关闭日志。 2025 年 3 月 0.1.16 版本新增。 |
| ltsCustomTag                        | False | [Struct](#LTSCustomTag)          | 日志标签配置。创建函数时须同时配置 enableLtsLog 为 true；更新函数时如果已经开启日志，直接使用该配置即可，否则需要同时配置 enableLtsLog 为 true 及上文具体的日志配置。2025 年 3 月 0.1.16 版本新增。                                                                |
| tags                                | False | [Struct](#tags)                  | 标签                                                                                                                                                                                                                                                               |
| description                         | False | String                           | 描述信息                                                                                                                                                                                                                                                           |
| extend                              | False | [Struct](#extend)                | 扩展字段，多函数的公共属性放到 extend 字段中                                                                                                                                                                                                                       |

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

- inline: UI 在线编辑代码。
- zip: 函数代码为 zip 包。
- obs: 函数代码来源于 obs 存储。
- jar: 函数代码为 jar 包，主要针对 Java 函数。

### Func Code

| 参数名  | 必填 | 类型   | 参数描述     |
| ------- | ---- | ------ | ------------ |
| codeUri | True | String | 本地代码地址 |

### Environment Variables

Object 格式，例如：

```
DB_connection: jdbc:mysql://rm-bp90434sds45c.mysql.rds.aliyuncs.com:3306/litemall
```

### Func Vpc

函数 VPC 配置

| 参数名   | 必填  | 类型   | 参数描述     |
| -------- | ----- | ------ | ------------ |
| vpcId    | True  | String | VPC 唯一标识 |
| subnetId | True  | String | 子网编码     |
| cidr     | False | String | 子网掩码     |
| gateway  | False | String | 网关         |

当然不推荐通过明文将敏感信息写入到`s.yaml`

### Domain Name

数组对象格式，例如：

```
domainNames:
  - id: domainId1
    name: domainName1
  - id: domainId2
    name: domainName2
```

### LTSCustomTag

Object 格式，key value 均为 String，例如：

```
{
  tag1: "123",
  "tag-2": "some value"
}
```

### Tags

Object 格式，例如：

```
tags:
  tag1: value1
  tag2: value2
```

### Extend

Object 格式，例如：

`extend`：

```
  function:
    handler: index.handler
    userData:
      key: value
      hello: world
```

`s.yml`:

```
  function:
    functionName: name
    extend: ${extend.function}
    userData:
      key: value2
      key1: value1
```

合并后的效果：

```
  function:
    functionName: name
    handler: index.handler
    userData:
      key: value2
      key1: value1
      hello: world
```
