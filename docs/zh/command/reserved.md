# reserved 命令

`reserved` 命令是进行函数预留实例操作的命令，主要包含预留实例的查看与更新

- [命令解析](#命令解析)
- [reserved get 命令](#reserved-get-命令)
  - [参数解析](#参数解析)
  - [操作案例](#操作案例)
- [reserved put 命令](#reserved-put-命令)
  - [参数解析](#参数解析-1)
  - [操作案例](#操作案例-1)

## 命令解析

当执行命令`reserved -h`/`reserved --help`时，可以获取帮助文档。

在该命令中，包括了两个个子命令：
- [get：获取函数预留实例](#reserved-get-命令)
- [put：配置预留实例（配置规则，数量为0，表示删除）](#reserved-put-命令)

## reserved get 命令

`reserved get` 命令，是获取函数预留实例的命令。

当执行命令`reserved get -h`/`reserved get --help`时，可以获取帮助文档。

### 参数解析

| 参数全称      | 参数缩写 | Yaml模式下必填 | Cli模式下必填 | 参数含义                                                     |
| ------------ | -------- | -------------- | ------------- | ------------------------------------------------------------ |
| region       | -        | 选填           | 必填          | 地区 |
| function-name | -        | 选填           | 必填          | 函数名   |
| qualifier-type   | -        | 选填           | 选填           | 版本或别名类型，取值`version, alias`，不填默认为 `version`     |
| qualifier-name   | -        | 选填           | 选填           | 版本或别名名称，不填默认使用 `latest`   |

>  ⚠️ 注意： 如果配置了`qualifier-type`，没有配置 `qualifier-name`，配置的`qualifier-type`不生效，获取 `latest` 下的预留实例

> 当前命令还支持部分全局参数（例如`-a/--access`, `--debug`等），详情可参考 [Serverless Devs 全局参数文档](https://serverless-devs.com/serverless-devs/command/readme#全局参数)

### 操作案例

- **有资源描述文件（Yaml）时**，可以直接执行`s reserved get`获取函数的预留实例；
- **纯命令行形式（在没有资源描述 Yaml 文件时）**，需要指定服务所在地区以及服务名称，例如`s cli fgs reserved get --region cn-north-4 --function-name fgs-test --qualifier-name v1`；

> ⚠️ 注意：    
> - 执行`cli` 模式时，如果密钥信息不是`default`，需要添加 `access`参数，例如`s cli fgs reserved get --region cn-north-4 --function-name fgs-test --qualifier-name v1 --access xxxx`

上述命令的执行结果示例：

```text
- functionName:          fgs-test
  count:                 2
  idleMode:              true
  qualifierType:         version
  qualifierName:         latest
  scheduleConfig:
    - name:              schema-test
      count:             1
      cron:              0 */10 * * * ?
      expiredTime:         2024-01-31T00:00:00Z
      endTime:           2024-12-31T00:00:00Z
```

## reserved put 命令

`reserved put` 命令，配置函数预留实例。

当执行命令`reserved put -h`/`reserved put --help`时，可以获取帮助文档。

### 参数解析

| 参数全称     | 参数缩写 | Yaml模式下必填 | Cli模式下必填 | 参数含义                                                     |
| ------------ | -------- | -------------- | ------------- | ------------------------------------------------------------ |
| region       | -        | 选填           | 必填          | 地区 |
| function-name | -        | 选填           | 必填          | 函数名                                                       |
| qualifier-type   | -        | 选填           | 选填           | 版本或别名类型，取值`version, alias`，不填默认使用版本      |
| qualifier-name   | -        | 选填           | 选填           | 版本或别名名称，不填默认使用 `latest`   |
| idle-mode   | -        | 选填           | 选填           | 开启闲置计费模式。默认不开启   |
| count   | -        | 选填           | 选填           | 预留实例数量。大于0，配置预留实例；等于 0，删除预留实例   |
| config   | -        | 选填           | 选填           | 预留实例策略配置的json文件地址。当前只支持定时策略   |

> 当前命令还支持部分全局参数（例如`-a/--access`, `--debug`等），详情可参考 [Serverless Devs 全局参数文档](https://serverless-devs.com/serverless-devs/command/readme#全局参数)

### 操作案例

- **有资源描述文件（Yaml）时**，可以直接执行`s reserved put --qualifier-name v1 --count 3`；
- **纯命令行形式（在没有资源描述 Yaml 文件时）**，需要指定服务所在地区以及服务名称，例如`s cli fgs reserved put --region cn-north-4 --function-name fgs-test --qualifier-name v1 --count 3`；

上述命令的执行结果示例：

```text
Reserved instances [fgs-test] updated.
```

> 💡 删除预留：删除预留的方法，可以通过`s reserved put`命令，进行删除，只需要将`count`调整为 0 即可。例如`s reserved put --qualifier-name fgs-test --count 0`

> 单纯通过`count`参数进行控制的只是非常简单的配置，除此之外还支持定时策略配置方法，此时就需要对`--config`参数进行配置，`--config`参数识别的是一个 JSON 文件，基础格式如下：

```json
{
  "scheduleConfig": [
    {
      "name": "scheduleName",
      "startTime": "2024-01-31T00:00:00Z",
      "expiredTime": "2024-12-31T00:00:00Z",
      "count": 10,
      "cron": "0 */10 * * * ?"
    },
    {
      "name": "scheduleName1",
      "startTime": "2024-06-31T00:00:00Z",
      "expiredTime": "2024-12-31T00:00:00Z",
      "count": 5,
      "cron": "0 */20 * * * ?"
    }
  ]
}
```
其中， 定时策略 `scheduleConfig` 参数配置：
| 参数名    | 类型 | 是否必填 | 示例 | 参数含义                                                     |
| ------------ | -------- | -------------- | ------------- | ------------------------------------------------------------ |
| name       | string       | 必填          | scheduleName          | 定时策略名 |
| startTime | string        | 必填             | 2024-01-31T00:00:00Z          | 定时策略开始生效时间    |
| expiredTime   | string       | 必填           | 2024-12-31T00:00:00Z           | 定时策略失效时间      |
| count   | number     | 选填         |  10          | 预留实例数量。大于等于外层的count值， 默认取外层的count值  |
| cron   | string       | 必填           | 0 */10 * * * ?     | [cron表达式](https://support.huaweicloud.com/usermanual-functiongraph/functiongraph_01_0908.html)  注：触发间隔需要大于或等于10分钟 |

如果指定定时配置，执行命令 `s reserved put --qualifier-name v1 --count 3 --config ./config.json`
