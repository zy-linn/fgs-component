## trigger Field

| Parameter Name   | Required | Type  | Description                                                                                                                                                                                                                  |
| --------- | ----- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| triggerTypeCode    | True  | String | Trigger type|
| status      | False  | Enum   | Trigger status. Options: `ACTIVE` (default) and `DISABLED`|   
| eventData    | True  | Struct | Trigger configuration, including [APIG trigger](#apig-trigger), [OBS trigger](#obs-trigger), and [timer trigger](#timer-trigger)|

triggerTypeCode supports `APIG`, `OBS`, and `TIMER`.


### APIG Trigger

| Parameter Name           | Required| Type             | Description                   |
| ----------------- | ---- | ----------------- | --------------------------------------------- |
| name              | False | String            | API name. The function name is used by default.            |
| groupName         | False | String           | Group. The first one is selected by default.                  |
| auth              | False | [Enum](#auth)           | Authentication mode. Default: `IAM`.                   |
| protocol           | False | [Enum](#protocol)           | Request protocol. Default: `HTTPS`.                   |
| timeout           | False | Number           | Backend timeout in milliseconds. Range: 1–60,000. Default: `5000`.     |

#### auth
API authentication mode. Options:

- **App**: AppKey and AppSecret high security authentication. This authentication mode is recommended. For details, see [App Authentication](https://support.huaweicloud.com/intl/en-us/devg-apig/apig-dev-180907066.html).
- **IAM**: IAM authentication. This mode grants access permissions to IAM users only and is of medium security. For details, see [IAM Authentication](https://support.huaweicloud.com/intl/en-us/devg-apig/apig-dev-180307020.html).
- **NONE**: No authentication. This mode grants access permissions to all users.

#### protocol
There are two types of protocols:

- HTTP
- HTTPS

Example:

```yaml
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

### OBS Trigger

| Parameter Name           | Required| Type             | Description                   |
| ----------------- | ---- | ----------------- | --------------------------------------------- |
| bucket            | True | String            | Bucket name                                                    |
| events            | True | List\<String\>    | Event list. For details, see https://support.huaweicloud.com/intl/en-us/devg-functiongraph/functiongraph_02_0102.html.   |
| name              | False | String           | Event notification name                   |
| prefix            | False | String           | Prefix for limiting notifications to objects whose names start with the matching characters                   |
| suffix            | False | String           | Suffix for limiting notifications to objects whose names end with the matching characters                  |

Example:

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

### Timer Trigger

| Parameter Name        | Required | Type   | Description                                           |
| -------------- | ----- | ------- | --------------------------------------------------- |
| name      | False  | String  | Timer name|
| scheduleType         | True  | Enum | Triggering rule. Options: `Rate` and [`Cron`](https://support.huaweicloud.com/intl/en-us/usermanual-functiongraph/functiongraph_01_0908.html)                               |
| schedule        | True | String  | Rule content                       |
| userEvent        | False | String  | Additional information, which will be put into the **user_event** field of the timer event source  |

Example:

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
