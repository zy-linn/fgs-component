# invoke 命令

`invoke` 命令是对线上函数进行调用/触发的命令。

- [命令解析](#命令解析)
  - [参数解析](#参数解析)
  - [操作案例](#操作案例)
  - [注意事项](#注意事项)

## 命令解析

当执行命令`invoke -h`/`invoke --help`命令时，可以获取帮助文档。

### 参数解析

| 参数全称                     | 参数缩写 | Yaml 模式下必填 | Cli 模式下必填 | 参数含义                                                                                                                                                                                                                                                                                                   |
| ---------------------------- | -------- | --------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| region                       | -        | 选填            | 必填           | 地区 |
| function-name                | -        | 选填            | 必填           | 函数名        |
| qualifier                    | -        | 选填            | 选填           | 指定调用的版本或者别名，别名前面要加“!”        |
| event                        | e        | 选填            | 选填           | 事件  |
| event-file                   | f        | 选填            | 选填           | 事件文件   |
| event-stdin                  | s        | 选填            | 选填           | 事件输入    |

> 当前命令还支持部分全局参数（例如`-a/--access`, `--debug`等），详情可参考 [Serverless Devs 全局参数文档](https://serverless-devs.com/serverless-devs/command/readme#全局参数)

### 操作案例

- **有资源描述文件（Yaml）时**，可以直接执行`s invoke`进行线上函数的调用；
- **纯命令行形式（在没有资源描述 Yaml 文件时）**，需要指定服务所在地区以及服务名称，函数名等，例如`s invoke --region cn-north-4  --function-name fg-test`

上述命令的执行结果示例：

```text
Request url: https://start-fp-nodejs-hello-wice-test-cturhuznax.cn-shenzhen.fcapp.run/
========= FC invoke Logs begin =========
FC Invoke Start RequestId: 68f15da2-a453-4f7e-90d3-91198b76afbf
FC Invoke End RequestId: 68f15da2-a453-4f7e-90d3-91198b76afbf

Duration: 2.96 ms, Billed Duration: 3 ms, Memory Size: 128 MB, Max Memory Used: 10.83 MB
========= FC invoke Logs end =========

FC Invoke Result[code: ${resp.code}]:
Hello world!
```
