# Info 命令

`info` 命令是查看函数线上资源详情的命令。

- [命令解析](#命令解析)
  - [参数解析](#参数解析)
  - [操作案例](#操作案例)

## 命令解析

当执行命令`info -h`/`info --help`命令时，可以获取帮助文档。

### 参数解析

| 参数全称      | 参数缩写 | Yaml模式下必填 | Cli模式下必填 | 参数含义                                                     |
| ------------- | -------- | -------------- | ------------- | ------------------------------------------------------------ |
| region        | -        | 选填           | 必填          | 地区 |
| function-name | -        | 选填           | 选填          | 函数名  |

> 当前命令还支持部分全局参数（例如`-a/--access`, `--debug`等），详情可参考 [Serverless Devs 全局参数文档](https://serverless-devs.com/serverless-devs/command/readme#全局参数)

### 操作案例

- **有资源描述文件（Yaml）时**，可以直接执行`s info`获取函数详情；
- **纯命令行形式（在没有资源描述 Yaml 文件时）**，需要根据需求，指定服务名，函数名等信息，例如`s cli fgs info --region cn-north-4 --function-name functionName`；

上述命令的执行结果示例：

```text
fgs-deploy-test:
    region: cn-north-4
    function:
      name: functionName
      runtime: python3
      handler: index.handler
      timeout: 60
      memorySize: 128
      description: this is a test
      environmentVariables: {}
```