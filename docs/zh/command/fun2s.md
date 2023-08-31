# Fun2s 命令

`fun2s` 命令是将函数的配置信息转换成 Serverless Devs 所识别的 `s.yaml`的命令。

- [命令解析](#命令解析)
  - [参数解析](#参数解析)
  - [操作案例](#操作案例)


## 命令解析

当执行命令`fun2s -h`/`fun2s --help`时，可以获取帮助文档。

### 参数解析

| 参数全称 | 参数缩写 | Cli模式下必填 | 参数含义                                                     |
| -------- | -------- | ------------- | ------------------------------------------------------------ |
| region   | -        | 必填          | 地区 |
| function-name   | -        | 必填          | 函数名称 |
| target   | -        | 选填          | 生成的 Serverless Devs 的配置文档路径（默认是`s.yaml`）      |

> 当前命令还支持部分全局参数（例如`-a/--access`, `--debug`等），详情可参考 [Serverless Devs 全局参数文档](https://serverless-devs.com/serverless-devs/command/readme#全局参数)

### 操作案例

可以在 Funcraft 项目目录下，通过`fun2s`命令，实现 Yaml 规范转换，例如：

```shell script
s cli fgs fun2s --region cn-north-4 --function-name fgs-deploy-test --target ./s.yml

Tips for next step
======================
* Deploy Function: s deploy -t ./s.yml
```

此时，就可以将原有的函数配置转换成支持 Serverless Devs 规范的 `s.yaml`。

转换后（`s.yaml`）：

```yaml
edition: 1.0.0
name: transform_fun
access: default
vars:
  region: cn-north-4
  functionName: fgs-deploy-test
services:
  component-test: #  服务名称
    component: fgs # 组件名称
    props:
      region: ${vars.region}
      function:
        functionName: ${vars.functionName}
        handler: index.handler
        memorySize: 256
        timeout: 300
        runtime: Node.js14.18
        codeType: zip
        code:
          codeUri: ./code
```
