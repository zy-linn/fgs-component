# alias 命令

`alias` 命令是对函数别名操作的命令；主要包括别名的查看、发布、修改、删除等功能。

- [alias 命令](#alias-命令)
  - [命令解析](#命令解析)
  - [alias get 命令](#alias-get-命令)
    - [参数解析](#参数解析)
    - [操作案例](#操作案例)
  - [alias list 命令](#alias-list-命令)
    - [参数解析](#参数解析-1)
    - [操作案例](#操作案例-1)
  - [alias publish 命令](#alias-publish-命令)
    - [参数解析](#参数解析-2)
    - [操作案例](#操作案例-2)
  - [remove alias 命令](remove.md#remove-alias-命令)

## 命令解析

当执行命令`alias -h`/`alias --help`时，可以获取帮助文档。

在该命令中，包括了三个子命令：

- [get：查看指定别名详情](#alias-get-命令)
- [list：获取别名列表](#alias-list-命令)
- [publish：发布/更新别名](#alias-publish-命令)

## alias get 命令

`alias get` 命令，是获取服务指定别名详情的命令。

当执行命令`alias get -h`/`alias get --help`时，可以获取帮助文档。

### 参数解析

| 参数全称      | 参数缩写  | Yaml 模式下必填 | Cli 模式下必填 | 参数含义     |
| ------------ | -------- | --------------- | ------------- | ----------- |
| region        | -        | 选填            | 必填           | 地区      |
| function-name | -        | 选填            | 必填           | 函数名称   |
| alias-name    | -        | 必填            | 必填           | 别名      |

> 当前命令还支持部分全局参数（例如`-a/--access`, `--debug`等），详情可参考 [Serverless Devs 全局参数文档](https://serverless-devs.com/serverless-devs/command/readme#全局参数)

### 操作案例

- **有资源描述文件（Yaml）时**，可以直接执行`s alias get --alias-name aliasName`进行指定的别名详情获取；
- **纯命令行形式（在没有资源描述 Yaml 文件时）**，需要指定服务所在地区以及服务名称，例如`s cli fgs alias get --region cn-north-4 --function-name fg-test --alias-name pre`；

> ⚠️ 注意：    
> - 执行`cli` 模式时，如果密钥信息不是`default`，需要添加 `access`参数，例如`s cli fgs alias get --region cn-north-4 --function-name fg-test --alias-name pre --access xxxx`

上述命令的执行结果示例：

```text
fg-test:
  aliasName:               pre
  versionId:               1
  description:             test publish version
  additionalVersionWeight:
  createdTime:             2021-11-08T06:51:36Z
  lastModifiedTime:        2021-11-08T06:54:02Z
```

## alias list 命令

`alias list` 命令，是进列举别名列表的命令。

当执行命令`alias list -h`/`alias list --help`时，可以获取帮助文档。

### 参数解析

| 参数全称     | 参数缩写 | Yaml 模式下必填 | Cli 模式下必填 | 参数含义  |
| ------------ | -------- | --------------- | -------------- | -------------- |
| region       | -        | 选填            | 必填           | 地区  |
| function-name | -        | 选填            | 必填           | 函数名称                          |
| table        | -        | 选填            | 选填           | 是否以表格形式输出   |

> 当前命令还支持部分全局参数（例如`-a/--access`, `--debug`等），详情可参考 [Serverless Devs 全局参数文档](https://serverless-devs.com/serverless-devs/command/readme#全局参数)

### 操作案例

- **有资源描述文件（Yaml）时**，可以直接执行`s alias list`获取别名列表；
- **纯命令行形式（在没有资源描述 Yaml 文件时）**，需要指定服务所在地区以及服务名称，例如`s cli fgs alias list --region cn-north-4 --function-name fg-test`；

> ⚠️ 注意：    
> - 执行`cli` 模式时，如果密钥信息不是`default`，需要添加 `access`参数，例如`s cli fgs alias list --region cn-north-4 --function-name fg-test --access xxxx`

上述命令的执行结果示例：

```text
fg-test:
  -
    name:                    a2
    version:                 v2
    description:             test
    lastModifiedTime:        2024-05-09T14:27:29+02:00
    additionalVersionWeight: 
      v1: 30
  -
    name:                      pre
    version:                   latest
    description:               --
    lastModifiedTime:          2024-05-09T14:21:29+02:00
    additionalVersionStrategy: 
      v1: 
        rules: 
          -
            rule_type: Header
            param:     ddd
            op:        =
            value:     test
          -
            rule_type: Header
            param:     ttt
            op:        in
            value:     test,hello
        combine_type: and
```

如果指定了`--table`参数，输出示例：

```text
  ┌──────┬─────────┬─────────────┬───────────────────────────┬─────────────────────────┬───────────────────────────┐
  │ name │ version │ description │     lastModifiedTime      │ additionalVersionWeight │ additionalVersionStrategy │
  ├──────┼─────────┼─────────────┼───────────────────────────┼─────────────────────────┼───────────────────────────┤
  │ a2   │ v2      │ test        │ 2024-05-09T14:27:29+02:00 │ additionalVersion: v1   │ --                        │
  │      │         │             │                           │ Weight: 30%             │                           │
  ├──────┼─────────┼─────────────┼───────────────────────────┼─────────────────────────┼───────────────────────────┤
  │ pre  │ latest  │ --          │ 2024-05-09T14:21:29+02:00 │ --                      │ combinType: and           │
  │      │         │             │                           │                         │ Rules:                    │
  │      │         │             │                           │                         │ Header:ddd = test         │
  │      │         │             │                           │                         │ Header:ttt in test,hello  │
  └──────┴─────────┴─────────────┴───────────────────────────┴─────────────────────────┴───────────────────────────┘
```

## alias publish 命令

`alias publish` 命令，是对别名进行发布和更新的命令。

当执行命令`alias publish -h`/`alias publish --help`时，可以获取帮助文档。

### 参数解析

| 参数全称        | 参数缩写 | Yaml 模式下必填 | Cli 模式下必填 | 参数含义     |
| -------------- | -------- | --------------- | -------------- | ------------------ |
| region         | -        | 选填            | 必填           | 地区     |
| function-name  | -        | 选填            | 必填           | 函数数名 |
| alias-name     | -        | 必填            | 必填           | 别名   |
| version-name   | -        | 选填            | 必填           | 别名对应的主版本名称，默认为 latest   |
| description    | -        | 选填            | 选填           | 别名描述    |
| gversion       | -        | 选填            | 选填           | 灰度版本 Id。灰度版本权重填写时必填      |
| weight         | -        | 选填            | 选填           | 灰度版本权重。灰度版本 Id 填写时必填    |
| resolve-policy | -        | 选填            | 选填           | 灰度方式，当`weight`和`rules-policy`同时设置时，以该字段配置为主。取值如下：Percentage：百分比灰度，为默认值。Rule：规则灰度。 |
| rule-policy   | -        | 选填            | 选填           | 灰度规则策略。满足灰度规则条件的流量，会被路由至灰度实例。[查看更多](https://support.huaweicloud.com/api-functiongraph/functiongraph_06_0114.html#functiongraph_06_0114__request_VersionStrategy)    |

> 当前命令还支持部分全局参数（例如`-a/--access`, `--debug`等），详情可参考 [Serverless Devs 全局参数文档](https://serverless-devs.com/serverless-devs/command/readme#全局参数)

### 操作案例

- **有资源描述文件（Yaml）时**，可以直接执行`s alias publish`进行别名的发布或者更新；
- **纯命令行形式（在没有资源描述 Yaml 文件时）**，需要指定服务所在地区以及服务名称，例如` s cli fgs alias publish --region cn-north-4 --function-name fg-test --alias-name pre --version-name 1`；

> ⚠️ 注意：    
> - 执行`cli` 模式时，如果密钥信息不是`default`，需要添加 `access`参数，例如`s cli fgs alias publish --region cn-north-4 --function-name fg-test --alias-name pre --version-name 1 --access xxxx`

上述命令的执行结果示例：

```text
fg-test:
  aliasName:               pre
  versionId:               1
  description:
  createdTime:             2021-11-08T06:51:36Z
  lastModifiedTime:        2021-11-08T06:51:36Z
```

如果需要对别名进行升级，只需要指定别名之后，进行相对应的参数更新，例如针对上述的`pre`别名，指定`--description`参数后再次执行上述命令，执行示例：

```text
fc-deploy-test:
  aliasName:               pre
  versionId:               1
  description:             test publish version
  createdTime:             2021-11-08T06:51:36Z
  lastModifiedTime:        2021-11-08T06:54:02Z
```

如果指定规则灰度，执行命令` s alias publish --alias-name pre --version-name 1 --gversion 2 --rule-policy '{\"rules\":[{\"rule_type\":\"Header\",\"param\":\"ddd\",\"value\":\"test\",\"op\":\"=\"},{\"rule_type\":\"Header\",\"param\":\"ttt\",\"value\":\"test,hello\",\"op\":\"in\"}],\"combine_type\":\"and\"}'`