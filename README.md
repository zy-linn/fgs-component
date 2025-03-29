# 华为云函数计算（FunctionGraph）组件
## 组件说明
是一个用于支持华为云函数应用生命周期的工具，基于[Serverless Devs](https://www.serverless-devs.com/)进行开发，通过配置资源配置文件`s.yaml`，您可以简单快速地部署应用到[华为云函数计算平台](https://www.huaweicloud.com/product/functiongraph.html)。

## 前提
先本地安装nodejs

## 快速开始
❶ [安装 Serverless Devs 开发者工具](https://docs.serverless-devs.com/serverless-devs/install) ：`npm install -g @serverless-devs/s`； 
> 安装完成还需要配置密钥，可以参考[密钥配置文档](./docs/zh/config.md)   

❷ 初始化一个函数计算的 `Hello World` 项目：`s init start-fg-http-nodejs14`；

❸ 初始化完成之后，进入项目，执行 `s deploy` 部署函数；

## 指令使用方法

华为云函数计算（FG）组件全部支持的能力列表如下：

| 构建&部署 | 调用&调试| 发布&配置  |  其他功能 |
| --- | --- | --- |--- |
| [**部署 deploy**](docs/zh/command/deploy.md)   | [**本地调试 local**](docs/zh/command/local.md)   | [**版本 version**](docs/zh/command/version.md)      | [**项目迁移 fun2s**](docs/zh/command/fun2s.md) | 
| [**删除 remove**](docs/zh/command/remove.md)   | [函数执行 invoke](docs/zh/command/invoke.md)   | [**别名 alias**](docs/zh/command/alias.md)     | [查看函数 info](docs/zh/command/info.md) | 
|   |   | [预留实例 reserved](docs/zh/command/reserved.md)  |  | 

在使用华为云函数计算（FunctionGraph）组件时，还会涉及到资源描述文件的编写，关于华为云函数计算（FunctionGraph）组件的 Yaml 规范可以参考[**华为云函数计算（FunctionGraph） Yaml 规范文档**](docs/zh/yaml/readme.md)
