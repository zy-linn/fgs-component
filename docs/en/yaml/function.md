## function Field

| Parameter Name                                             | Required | Type                              | Description                                                              |
| --------------------------------------------------- | ----- | ---------------------------------- | ---------------------------------------------------------------------- |
| functionName          | True  | String     | Function name                        |
| handler          | True  | String     | Handler of the function in the format "xx.xx". It must contain a period (.).  |
| [runtime](#runtime)           | True  | String     | Runtime  |
| package          | False  | String     | Package (or group) to which the function belongs. Default: **default**  |
| memorySize          | True  | Number     | Memory (MB) consumed by the function. Options: 128, 256, 512, 768, 1024, 1280, 1536, 1792, 2048, 2560, 3072, 3584, and 4096  |
| timeout          | True  | Number     | Maximum duration the function can be executed. Range: 3s–900s  |
| [codeType](#code-type)          | True  | String     | Function code type |
| codeUrl          | False  | String     | If **CodeType** is set to **obs**, enter the OBS URL of the function code package. If **CodeType** is not set to **obs**, leave this parameter blank. |
| environmentVariables       | False | [Struct](#environment-variables)    | Environment variables. Max. 20, with up to 4 KB.|
| agencyName          | False  | String     | Name of an agency created in Identity and Access Management (IAM). This is required when the function needs to access other services. |
| vpcId          | False  | String     | Virtual Private Cloud (VPC) ID. agencyName is required when this parameter is set.https://console.huaweicloud.com/vpc/#/vpc/vpcs/list  |
| subnetId          | False  | String     | Subnet ID. agencyName is required when this parameter is set.https://console.huaweicloud.com/vpc/#/vpc/subnets  |
| dependVersionList          | False  | List\<String\>        | Dependency ID |
| code          | False  | [Struct](#func-code)        | Local code address, which is required if **CodeType** is set to **zip**. |
| concurrency          | False  | Number        | Maximum number of instances for the function. Range: –1 to 1000. **–1** indicates that the number of instances is unlimited, and **0** indicates that the function is disabled. |
| concurrentNum          | False  | Number        | Maximum number of requests per instance. Range: –1 to 1000 |
| description             | False | String                             | Description about **function**.       |


Example:

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

### Runtime

Supported runtimes:

`Node.js18.15`、`Node.js16.17`、`Node.js 14.18`, `Node.js 12.13`, `Node.js 10.16`, `Node.js 8.10`, `Node.js 6`, `Node.js 4.4` 
`Python 3.9`, `Python 3.6`, `Python 2.7`
`Java 11`, `Java 8` 
`Go 1.x`, `Go 1.8` 
`PHP 7.3` 
`HTTP` 
`Custom`

### Code Type
Supported code types:

- **inline**: Edit code on the UI.
- **zip**: A ZIP file.
- **obs**: From an OBS bucket.
- **jar**: A JAR file, mainly for Java functions.

### Function Code
| Parameter Name             | Required | Type  | Description                                                                      |
| ------------------- | ----- | ------ | ------------------------------------------------------------------------------ |
| codeUri          | True  | String | Local code address                         |


### Environment Variables

Object format. For example:

```
DB_connection: jdbc:mysql://rm-bp90434sds45c.mysql.rds.aliyuncs.com:3306/litemall
```

Do not write sensitive information to `s.yaml` in plaintext.
