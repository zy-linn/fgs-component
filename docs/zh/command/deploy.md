# deploy 命令

`deploy` 命令是对函数资源进行部署的命令，即将本地在  [`Yaml` 文件](../yaml/readme.md) 中声明的资源部署到线上。

  - [命令解析](#命令解析)
    - [参数解析](#参数解析)
    - [操作案例](#操作案例)
    - [注意事项](#注意事项)
  - [deploy function 命令](#deploy-function-命令)
    - [参数解析](#参数解析-2)
    - [操作案例](#操作案例-2)
  - [deploy trigger 命令](#deploy-trigger-命令)
    - [参数解析](#参数解析-3)
    - [操作案例](#操作案例-3)

## 命令解析

当执行命令`deploy -h`/`deploy --help`时，可以获取帮助文档。


在该命令中，包括了两个子命令：

- [function：只部署函数部分](#deploy-function-命令)
- [trigger：只部署触发器部分](#deploy-trigger-命令)


### 参数解析

| 参数全称   | 参数缩写 | Yaml模式下必填 | 参数含义                                                     |
| ---------- | -------- | -------------- | ------------------------------------------------------------ |
| type       | -        | 选填           | 部署类型，可以选择`code, config`                           |


### 操作案例

**有资源描述文件（Yaml）时**，可以直接执行`s deploy `进行资源部署，部署完成的输出示例：

```text
fgs-deploy-test: 
    region:   cn-north-4
    function: 
        functionName: fgs-deploy-test
        handler: index.handler
        memorySize: 128
        timeout: 30
        runtime: Node.js14.18
        package: default
        codeType: zip
        code:
        codeUri: ./code
    trigger:
        triggerTypeCode: APIG
        status: ACTIVE
        eventData:
            name: APIG_test
            groupName: APIGroup_xxx
            auth: NONE
            protocol: HTTPS
            timeout: 5000
```

### 注意事项

在进行资源部署时，会涉及到一定的特殊情况，可以参考以下描述：

- **只需要部署/更新代码**，可以增加`--type code`参数；只需要部署/更新配置，可以增加`--type config`参数；

## deploy function 命令

`deploy function` 命令，是部署函数的命令。

当执行命令`deploy function -h`/`deploy function --help`时，可以获取帮助文档。

### 参数解析

| 参数全称    | 参数缩写 | Yaml模式下必填 | 参数含义                                                     |
| ----------- | -------- | -------------- | ------------------------------------------------------------ |
| type        | -        | 选填           | 部署类型，可以选择`code, config`                           |


### 操作案例

**有资源描述文件（Yaml）时**，可以直接执行`s deploy function `进行函数的部署，部署完成的输出示例：

```text
fgs-deploy-test: 
    region:   cn-north-4
    function: 
        functionName: fgs-deploy-test
        handler: index.handler
        memorySize: 128
        timeout: 30
        runtime: Node.js14.18
        package: default
        codeType: zip
        code:
        codeUri: ./code
```


## deploy trigger 命令

`deploy trigger` 命令，是部署函数触发器的命令。

当执行命令`deploy trigger -h`/`deploy trigger --help`时，可以获取帮助文档。

### 参数解析

### 操作案例

**有资源描述文件（Yaml）时**，可以直接执行`s deploy trigger `进行触发器的部署，部署完成的输出示例：

```text
fgs-deploy-test: 
    region:   cn-north-4
    trigger:
        triggerTypeCode: APIG
        status: ACTIVE
        eventData:
            name: APIG_test
            groupName: APIGroup_xxx
            auth: NONE
            protocol: HTTPS
            timeout: 5000
```

> 在进行服务资源部署时，可能会涉及到交互式操作，相关的描述参考[ deploy 命令 注意事项](#注意事项) 中的`在部署时可能会涉及到交互式操作`。
