# 华为云函数计算（FG）组件
## 组件说明
是一个用于支持百度云函数应用生性周期的工具，基于[Serverless Devs](https://www.serverless-devs.com/)进行开发，通过配置资源配置文件`s.yaml`，您可以简单快速地部署应用到[华为云函数计算平台](https://www.huaweicloud.com/product/functiongraph.html)。

## 快速开始
❶ [安装 Serverless Devs 开发者工具](https://github.com/Serverless-Devs/Serverless-Devs/blob/master/docs/zh/install.md) ：`npm install -g @serverless-devs/s`； 

❷ 初始化一个函数计算的 `Hello World` 项目：`s init start-fg-http-nodejs14`；

❸ 初始化完成之后，进入项目，执行 `s deploy` 部署函数；

## 指令使用方法
### 1. 部署操作：Deploy
通过编写s.yaml描述文档和s deploy命令，可以快速部署相关资源

#### 1. s deploy
用于部署所有资源，包括函数和触发器

#### 2. s deploy -h/s deploy help
使用该命令可以唤起帮助信息

#### 3. s deploy <sub-command>子命令
- s deploy all：部署所有资源，效果等同于s deploy
- s deploy function：仅部署函数
- s deploy trigger：仅部署触发器

### 2. 移除操作：Remove
#### 1. s remove
移除所有资源，包括函数和触发器 (对应资源已经在线上部署)

#### 2. s remove -h/s remove help
使用该命令可以唤起帮助信息

#### 3. s deploy <sub-command>子命令
- s deploy all：移除所有资源，效果等同于s remove
- s deploy function：移除所有资源，效果等同于s remove
- s deploy trigger：仅移除触发器
