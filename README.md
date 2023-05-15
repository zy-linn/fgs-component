# 华为云函数计算（FG）组件
## 组件说明
是一个用于支持华为云函数应用生性周期的工具，基于[Serverless Devs](https://www.serverless-devs.com/)进行开发，通过配置资源配置文件`s.yaml`，您可以简单快速地部署应用到[华为云函数计算平台](https://www.huaweicloud.com/product/functiongraph.html)。

## 前提
先本地安装nodejs，具体按照流程可参考[安装Nodejs](https://zhuanlan.zhihu.com/p/442215189)

## 快速开始
❶ [安装 Serverless Devs 开发者工具](https://github.com/Serverless-Devs/Serverless-Devs/blob/master/docs/zh/install.md) ：`npm install -g @serverless-devs/s`； 
> 安装完成还需要配置密钥，可以参考[密钥配置文档](./docs/zh/config.md)   

❷ 初始化一个函数计算的 `Hello World` 项目：`s init start-fg-http-nodejs14`；

❸ 初始化完成之后，进入项目，执行 `s deploy` 部署函数；

## 指令使用方法

华为云函数计算（FG）组件全部支持的能力列表如下：

| 构建&部署 | 发布&配置  |  其他功能 |
| --- | --- | --- |--- | --- |
| [**部署 deploy**](docs/zh/command/deploy.md)   |  [**版本 version**](docs/zh/command/version.md)      | [项目迁移 fun2s](docs/zh/command/fun2s.md) | 
| [**删除 remove**](docs/zh/command/remove.md)   |  [**别名 alias**](docs/zh/command/alias.md)     |  | 

在使用华为云函数计算（FG）组件时，还会涉及到资源描述文件的编写，关于华为云函数计算（FG）组件的 Yaml 规范可以参考[**华为云函数计算（FG） Yaml 规范文档**](docs/zh/yaml/readme.md)
