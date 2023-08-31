
# 字段解析

| 参数名                              | 必填  | 类型                         | 参数描述   |
| ----------------------------------- | ----- | ---------------------------- | ---------- |
| region                              | True  | Enum                         | 地域       |
| [function](./function.md)           | True | [Struct](./function.md)      | 函数       |
| [triggers](./triggers.md)           | False | [Struct](./triggers.md)      | 触发器     |

# Yaml 完整配置

华为云函数计算（FG）组件的 Yaml 字段如下：

```yaml
edition: 1.0.0 #  命令行YAML规范版本，遵循语义化版本（Semantic Versioning）规范
name: fg-test #  项目名称
access: "default" #  秘钥别名

vars: # 全局变量
    region: "cn-east-3"
    functionName: "start-fg-event-nodejs14"

services:
    component-test: #  服务名称
        component: fgs # 组件名称
        props:
            region: ${vars.region}
            function:
                functionName: ${vars.functionName} # 函数名
                handler: index.handler # 函数执行入口
                memorySize: 256 # 函数消耗的内存
                timeout: 30 # 函数执行超时时间
                runtime: Node.js14.18 # 运行时
                agencyName: fgs-vpc-test # 委托名称
                environmentVariables: # 环境变量
                    test: test
                    hello: world
                vpcId: xxx-xxx # 虚拟私有云唯一标识
                subnetId: xxx-xxx # 子网编号
                concurrency: 10 # 单函数最大实例数
                concurrentNum: 10 # 单实例最大并发数
                codeType: zip # 函数代码类型
                dependVersionList: # 依赖包，取依赖包的ID
                    - xxx-xxx
                code: # 本地代码地址
                    codeUri: ./code
            trigger:
                triggerTypeCode: TIMER # 触发器类型
                status: DISABLED # 触发器状态
                eventData: # 触发器配置 
                    name: APIG_test  # API名称
                    groupName: APIGroup_xxx # 分组名称
                    auth: IAM # 安全认证
                    prtocol: HTTPS # 请求协议
                    timeout: 5000 # 后端超时时间
