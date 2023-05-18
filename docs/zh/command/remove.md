---
title: Remove 命令
description: 'Remove 命令'
position: 3
category: '构建&部署'
---

# Remove 命令

`remove` 命令是对已经部署的资源进行移除的操作。

- [命令解析](#命令解析)
  - [参数解析](#参数解析)
  - [操作案例](#操作案例)
- [remove function 命令](#remove-function-命令)
  - [参数解析](#参数解析-1)
  - [操作案例](#操作案例-1)
- [remove trigger 命令](#remove-trigger-命令)
  - [参数解析](#参数解析-2)
  - [操作案例](#操作案例-2)
- [remove version 命令](#remove-version-命令)
  - [参数解析](#参数解析-3)
  - [操作案例](#操作案例-3)
- [remove alias 命令](#remove-alias-命令)
  - [参数解析](#参数解析-4)
  - [操作案例](#操作案例-4)

>  ⚠️ 注意： **值得注意的是，资源一旦移除可能无法恢复，所以在使用移除功能时，请您慎重操作**


## 命令解析

当执行命令`remove -h`/`remove --help`时，可以获取帮助文档。

在该命令中，包括了四个子命令：
- [function：删除指定的函数](#remove-function-命令)
- [trigger：删除指定的触发器](#remove-trigger-命令)
- [version：删除指定的版本](#remove-version-命令)
- [alias：删除指定的别名](#remove-alias-命令)

### 参数解析

| 参数全称   | 参数缩写 | Yaml模式下必填 | 参数含义                                                     |
| ---------- | -------- | -------------- | ------------------------------------------------------------ |
| assume-yes | y        | 选填           | 在交互时，默认选择`y`                                        |


### 操作案例

**有资源描述文件（Yaml）时**，可以直接执行`s remove `进行资源删除，部署完成的输出示例：

```text
Function [myFunction] deleted successfully.
```

## remove function 命令

`remove function` 命令，是删除指定函数的命令。默认会把整个函数删除，包含所有的版本、别名以及触发器。

当执行命令`remove function -h`/`remove function --help`时，可以获取帮助文档。

### 参数解析

| 参数全称      | 参数缩写 | Yaml模式下必填 | Cli模式下必填 | 参数含义                                                     |
| ------------ | -------- | -------------- | ------------- | ------------------------------------------------------------ |
| region       | -        | 选填           | 必填          | 地区 |
| function-name | -        | 选填           | 必填          | 函数名                                                       |
| assume-yes   | y        | 选填           | 选填          | 在交互时，默认选择`y`            |

> 当前命令还支持部分全局参数（例如`-a/--access`, `--debug`等），详情可参考 [Serverless Devs 全局参数文档](https://serverless-devs.com/serverless-devs/command/readme#全局参数)

### 操作案例

- **有资源描述文件（Yaml）时**，可以直接执行`s remove function`删除指定的函数；
- **纯命令行形式（在没有资源描述 Yaml 文件时）**，需要指定服务所在地区以及服务名称，例如`s cli fgs remove function --region cn-north-4  --function-name fgs-test`；

> ⚠️ 注意：    
> - 执行`cli` 模式时，如果密钥信息不是`default`，需要添加 `access`参数，例如`s cli fgs remove function --region cn-north-4  --function-name fgs-test --access xxxx`

上述命令的执行结果示例：

```text
Function [fg-test] deleted.
```

## remove trigger 命令

`remove trigger` 命令，是删除指定触发器的命令。

当执行命令`remove trigger -h`/`remove trigger --help`时，可以获取帮助文档。

### 参数解析

| 参数全称     | 参数缩写 | Yaml模式下必填 | Cli模式下必填 | 参数含义                                                     |
| ------------ | -------- | -------------- | ------------- | ------------------------------------------------------------ |
| region       | -        | 选填           | 必填          | 地区 |
| function-name | -        | 选填           | 必填          | 函数名                                                       |
| version-name | -        | 选填           | 选填          | 指定版本，不设置默认为latest版本      |
| trigger-type | -        | 选填           | 必填          | 触发器类型      |
| trigger-name | -        | 选填           | 必填          | 触发器名，`APIG` 为 API名称， `OBS` 为 桶名， `TIMER`  为 触发器名称   |
| assume-yes   | y        | 选填           | 选填          | 在交互时，默认选择`y` |

> 当前命令还支持部分全局参数（例如`-a/--access`, `--debug`等），详情可参考 [Serverless Devs 全局参数文档](https://serverless-devs.com/serverless-devs/command/readme#全局参数)

### 操作案例

- **有资源描述文件（Yaml）时**，可以直接执行`s remove trigger`删除 Yaml 中声明的触发器；
- **纯命令行形式（在没有资源描述 Yaml 文件时）**，需要指定服务所在地区以及服务名称，例如`s cli fgs remove trigger --region cn-north-4  --function-name fgs-test --trigger-type APIG --trigger-name fgs-test-trigger`；

上述命令的执行结果示例：

```text
Trigger [fgs-test-trigger] deleted.
```

## remove version 命令

`remove version` 命令，是用户删除指定已发布的版本命令。

当执行命令`remove version -h`/`remove version --help`时，可以获取帮助文档。

### 参数解析

| 参数全称     | 参数缩写 | Yaml模式下必填 | Cli模式下必填 | 参数含义                                                     |
| ------------ | -------- | -------------- | ------------- | ------------------------------------------------------------ |
| region       | -        | 选填           | 必填          | 地区 |
| function-name | -        | 选填           | 必填          | 服务名                                                       |
| version-name   | -        | 必填           | 必填          | 版本名称，不能为`latest`        |

> 当前命令还支持部分全局参数（例如`-a/--access`, `--debug`等），详情可参考 [Serverless Devs 全局参数文档](https://serverless-devs.com/serverless-devs/command/readme#全局参数)

### 操作案例

- **有资源描述文件（Yaml）时**，可以直接执行`s remove version --version-name versionName`删除指定`versionName`的版本；
- **纯命令行形式（在没有资源描述 Yaml 文件时）**，需要指定服务所在地区以及服务名称，例如`s cli fgs remove version --region cn-north-4 --function-name fgs-test --version-name v1`；

上述命令的执行结果示例：

```text
Version [v1] deleted.
```

## remove alias 命令

`remove alias` 命令，是删除指定服务别名的命令。

当执行命令`remove alias -h`/`remove alias --help`时，可以获取帮助文档。

### 参数解析

| 参数全称     | 参数缩写 | Yaml模式下必填 | Cli模式下必填 | 参数含义                                                     |
| ------------ | -------- | -------------- | ------------- | ------------------------------------------------------------ |
| region       | -        | 选填           | 必填          | 地区 |
| function-name | -        | 选填           | 必填          | 服务名                                                       |
| alias-name   | -        | 必填           | 必填          | 别名                                                         |

> 当前命令还支持部分全局参数（例如`-a/--access`, `--debug`等），详情可参考 [Serverless Devs 全局参数文档](https://serverless-devs.com/serverless-devs/command/readme#全局参数)

### 操作案例

- **有资源描述文件（Yaml）时**，可以直接执行`s remove alias --alias-name aliasName`删除指定别名；
- **纯命令行形式（在没有资源描述 Yaml 文件时）**，需要指定服务所在地区以及服务名称，例如`s cli fgs remove alias --region cn-north-4 --function-name fgs-test --alias-name pre`；

上述命令的执行结果示例：

```text
Alias [pre] deleted.
```