# version 命令

`version` 命令是进行函数版本操作的命令；主要包括版本的查看、发布、删除等功能。

- [命令解析](#命令解析)
- [version list 命令](#version-list-命令)
  - [参数解析](#参数解析)
  - [操作案例](#操作案例)
- [version publish 命令](#version-publish-命令)
  - [参数解析](#参数解析-1)
  - [操作案例](#操作案例-1)
- [remove version 命令](remove.md#remove-version-命令)

## 命令解析

当执行命令`version -h`/`version --help`时，可以获取帮助文档。

在该命令中，包括了两个子命令：

- [list：查看版本列表](#version-list-命令)
- [publish：发布版本](#version-publish-命令)

## version list 命令

`version list` 命令，是查看服务已发布的版本列表的命令。

当执行命令`version list -h`/`version list --help`时，可以获取帮助文档。

> 当前命令还支持部分全局参数（例如`-a/--access`, `--debug`等），详情可参考 [Serverless Devs 全局参数文档](https://serverless-devs.com/serverless-devs/command/readme#全局参数)

### 参数解析

| 参数全称     | 参数缩写 | Yaml 模式下必填 | Cli 模式下必填 | 参数含义                                                                                                                                                                                                                                                                                                   |
| ------------ | -------- | --------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| region       | -        | 选填            | 必填           | 地区，取值范围 |
| function-name       | -        | 选填            | 必填           | 函数名称 |
| table        | -        | 选填            | 选填           | 是否以表格形式输出 |                                             
### 操作案例

- **有资源描述文件（Yaml）时**，可以直接执行`s version list`查看当前函数所发布的版本列表；
- **纯命令行形式（在没有资源描述 Yaml 文件时）**，需要指定服务所在地区以及服务名称，例如`s cli fgs version list --region cn-north-4 --function-name fg-test`；


> ⚠️ 注意：    
> - 执行`cli` 模式时，如果密钥信息不是`default`，需要添加 `access`参数，例如`s cli fgs version list --region cn-north-4 --function-name fg-test --access xxxx`

上述命令的执行结果示例：

```text
fg-test:
  -
    version:        1
    description:      test publish version
    lastModifiedTime: 2021-11-08T06:07:00Z
```

如果指定了`--table`参数，输出示例：

```text
  ┌───────────┬──────────────────────┬──────────────────────┐
  │ version   │     description      │   lastModifiedTime   │
  ├───────────┼──────────────────────┼──────────────────────┤
  │ 1         │ test publish version │ 2021-11-08T06:07:00Z │
  └───────────┴──────────────────────┴──────────────────────┘
```

## version publish 命令

`version publish` 命令，是用于发布版本的命令。

当执行命令`version publish -h`/`version publish --help`时，可以获取帮助文档。

> 当前命令还支持部分全局参数（例如`-a/--access`, `--debug`等），详情可参考 [Serverless Devs 全局参数文档](https://serverless-devs.com/serverless-devs/command/readme#全局参数)

### 参数解析

| 参数全称              | 参数缩写 | Yaml 模式下必填 | Cli 模式下必填 | 参数含义                                                                                                                                                                                                                                                                                                   |
| --------------------- | -------- | --------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| region                | -        | 选填            | 必填           | 地区      |
| function-name         | -        | 选填            | 必填           | 函数名称  |
| version-name               | -        | 选填            | 选填           | 版本号    |
| description           | -        | 选填            | 选填           | 版本描述  |

### 操作案例

- **有资源描述文件（Yaml）时**，可以直接执行`s version publish`进行版本的发布；
- **纯命令行形式（在没有资源描述 Yaml 文件时）**，需要指定服务所在地区以及服务名称，例如`s cli fgs version publish --region cn-north-4 --function-name fg-test --version-name 1 --description "test publish version"`；

> ⚠️ 注意：    
> - 执行`cli` 模式时，如果密钥信息不是`default`，需要添加 `access`参数，例如`s cli fgs version publish --region cn-north-4 --function-name fg-test --version-name 1 --description "test publish version" --access xxxx`


上述命令的执行结果示例：

```text
fg-test:
  version:        1
  description:      test publish version
  lastModifiedTime: 2021-11-08T06:07:00Z
```
