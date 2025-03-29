# Local 命令

`local` 命令是在本地对函数调试的命令。

- [Local 命令](#local-命令)
  - [命令解析](#命令解析)
  - [local invoke 命令](#local-invoke-命令)
    - [参数解析](#参数解析)
    - [操作案例](#操作案例)
  - [断点调试](#断点调试)
    - [VSCode](#vscode)
      - [调试 Event 函数](#调试-event-函数)
        - [step1：打开终端，进入目标项目下，输入启动指令](#step1打开终端进入目标项目下输入启动指令)
        - [step2：启动断点调试器](#step2启动断点调试器)
        - [断点调试实操视频](#断点调试实操视频)
  - [附录](#附录)
    - [默认断点调试参数](#默认断点调试参数)

## 命令解析

当执行命令`local -h`/`local --help`时，可以获取帮助文档。

在该命令中，包括了两个个子命令：

- [invoke：本地调试事件函数](#local-invoke-命令)

> 未支持**非webserver模式**

## local invoke 命令

`local invoke` 命令，是进行本地事件函数调试的命令。

> 💡 [事件函数](https://support.huaweicloud.com/productdesc-functiongraph/functiongraph_02_1001.html)指的是通过触发器来出发函数。

当执行命令`local invoke -h`/`local invoke --help`时，可以获取帮助文档。

### 参数解析

| 参数全称      | 参数缩写 | Yaml 模式下必填 | 参数含义|
| ------------- | -------- | --------------- | --------- |
| event-name    | n        | 选填            | 传入 函数的 事件数据，包含 `APIG, CTS, DDS, DIS, LTS, OBS, SMN, TIMER`                   |
| event-file    | f        | 选填            | 以文件形式传入 `event` 事件数据  |
| event-stdin   | s        | 选填            | 以标准输入形式传入 `event` 事件数据 |
| mode          | m        | 选填            | 调试模式选择，包括：<br> - `normal`: 默认模式，本地函数运行容器在函数执行完成后立刻退出 <br> - `api`: 启动服务供本地 InvokeFunction API 或者 SDK 进行调用 |
| config        | c        | 选填            | 指定断点调试时使用的 IDE，当前只支持 `vscode`, 取值范围：`vscode`  |
| debug-port    | d        | 选填            | 指定断点调试端口|
| server-port   | -        | 选填            | 自定义本地监听 `server` 的端口     |
| root-path   | -        | 选填            | 工程根路径，不填默认为执行命令的路径     |

> 当前命令还支持部分全局参数（例如`-a/--access`, `--debug`, `--help`等），详情可参考 [Serverless Devs 全局参数文档](https://github.com/Serverless-Devs/Serverless-Devs/blob/master/docs/zh/command/readme.md#%E5%85%A8%E5%B1%80%E5%8F%82%E6%95%B0)

## 断点调试

### VSCode

使用 VSCode 进行断点调试时，流程十分简单。

#### 调试 Event 函数

##### step1：打开终端，进入目标项目下，输入启动指令

```
$ s local invoke --config vscode --debug-port 3000
```

启动指令执行后，本地的函数计算执行容器会有一定阻塞，我们需要等待调用；与此同时当前项目会自动生成 .vscode/launch.json 文件，该文件是基于 VSCode 进行调试的配置文件，若该文件已经存在，那么启动指令会打印相应配置文本，如下图所示，需要利用这部分内容覆盖已有 .vscode/launch.json 中的内容。
![](https://img.alicdn.com/imgextra/i3/O1CN01DcU4ca1VBiSYwrFh4_!!6000000002615-2-tps-1142-387.png)

##### step2：启动断点调试器

打开 VSCode 界面，然后打开 s.yml 中 codeUri 所存放的源代码，为其打上断点，接着点击开始调试按钮，具体执行如下图所示。
![](https://img.alicdn.com/imgextra/i3/O1CN01yycXnv1vzLO4cB9pv_!!6000000006243-2-tps-750-410.png)

启动调试器后，程序便已经启动，此时就可以开始进行我们的断点调试工作了。

## 附录

### 默认断点调试参数

| **Runtime**       | **Default Debug Args**                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------- |
| nodejs 8/10/12/14 | `--inspect-brk=0.0.0.0:${debugPort}`                                                      |
| python 2.7/3/3.9  | `-m ptvsd --host 0.0.0.0 --port ${debugPort} --wait`                                      |
| java 8            | `-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,quiet=y,address=${debugPort}`      |
| java 11           | `-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,quiet=y,address=*:${debugPort}`    |
| php7.2            | `remote_enable=1 remote_autostart=1 remote_port=${debugPort} remote_host=${ip.address()}` |