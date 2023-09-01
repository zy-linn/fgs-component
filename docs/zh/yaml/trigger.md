## trigger 字段

| 参数名    | 必填  | 类型   | 参数描述                                                                                                                                                                                                                   |
| --------- | ----- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| triggerTypeCode    | True  | String | 触发器类型 |
| status      | False  | Enum   | 触发器状态，取值为 `ACTIVE`、`DISABLED`，默认为 `ACTIVE` |   
| eventData    | True  | Struct | 触发器配置，包括[APIG 触发器](#apig-触发器), [OBS 触发器](#obs-触发器), [TIMER 触发器](#timer-触发器)|

triggerTypeCode 目前支持：`APIG`、`OBS`、`TIMER`


### APIG 触发器

| 参数名            | 必填 | 类型              | 参数描述                    |
| ----------------- | ---- | ----------------- | --------------------------------------------- |
| name              | False | String            | API名称，默认使用函数名             |
| groupName         | False | String           | 分组，默认选择当前第一个                   |
| auth              | False | [Enum](#auth)           | 安全认证，默认为 `IAM`                    |
| protocol           | False | [Enum](#protocol)           | 请求协议，默认为 `HTTPS`                    |
| timeout           | False | Number           | 后端超时时间，单位为毫秒，取值范围为 1 ~ 60000。默认为 `5000`      |

#### auth
API认证方式：

- App： 采用Appkey&Appsecret认证，安全级别高，推荐使用，详情请[参见APP认证](https://support.huaweicloud.com/devg-apig/apig-dev-180907066.html)。
- IAM： IAM认证，只允许IAM用户能访问，安全级别中等，详情请[参见IAM认证](https://support.huaweicloud.com/devg-apig/apig-dev-180307020.html)。
- None： 无认证模式，所有用户均可访问。

#### protocol
分为两种类型：

- HTTP
- HTTPS

参考案例：

```yaml
trigger:
    triggerTypeCode: APIG
    status: ACTIVE
    eventData:
        name: APIG_test
        groupName: APIGroup_xxx
        auth: IAM
        prtocol: HTTPS
        timeout: 5000
```

### OBS 触发器

| 参数名            | 必填 | 类型              | 参数描述                    |
| ----------------- | ---- | ----------------- | --------------------------------------------- |
| bucket            | True | String            | 桶名称                                                     |
| events            | True | List\<String\>    | 事件列表， 相关文档：https://support.huaweicloud.com/obs_faq/obs_faq_0051.html    |
| name              | False | String           | 事件通知名称                    |
| prefix            | False | String           | 前缀，用来限制以此关键字开头的对象的事件通知                    |
| suffix            | False | String           | 后缀，用来限制以此关键字结尾的对象的事件通知                   |

参考案例：

```yaml
trigger:
    triggerTypeCode: OBS
    status: ACTIVE
    eventData:
        bucket: obs-cff
        events:
            - s3:ObjectCreated:*
        name: obs-event-xxx
        prefix: xxxx
        suffix: xxxx
```

### TIMER 触发器

| 参数名         | 必填  | 类型    | 参数描述                                            |
| -------------- | ----- | ------- | --------------------------------------------------- |
| name      | False  | String  | 定时器名称 |
| scheduleType         | True  | Enum | 触发规则，取值为 `Rate`、[`Cron`](https://support.huaweicloud.com/usermanual-functiongraph/functiongraph_01_0908.html)                                |
| schedule        | True | String  | 定时器规则内容                        |
| userEvent        | False | String  | 附加信息，如果用户配置了触发事件，会将该事件填写到TIMER事件源的“user_event”字段   |

参考案例：

```yaml
trigger:
    triggerTypeCode: TIMER
    status: ACTIVE
    eventData:
        name: Timer-xxx
        scheduleType: Rate
        schedule: 3m
        userEvent: xxxx

trigger:
    triggerTypeCode: TIMER
    status: ACTIVE
    eventData:
        name: Timer-xxx
        scheduleType: Cron
        schedule: 0 15 2 * * ?
        userEvent: xxxx
```
