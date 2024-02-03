# deploy Commands

The `deploy` commands are used to deploy the function resources declared in a [`YAML` file](../yaml/readme.md).

  - [Command Parsing](#Command-Parsing)
    - [Parameter Description](#Parameter-Description)
    - [Examples](#Examples)
    - [Precautions](#Precautions)
  - [deploy function](#deploy-function)
    - [Parameter Description](#Parameter-Description-2)
    - [Examples](#Examples-2)
  - [deploy trigger](#deploy-trigger)
    - [Parameter Description](#Parameter-Description-3)
    - [Examples](#Examples-3)

## Command Parsing

You can run `deploy -h` or `deploy --help` to view the documentation.


This command includes two subcommands:

- [function: Deploy the function part only.](#deploy-function)
- [trigger: Deploy the trigger part only.](#deploy-trigger)


### Parameter Description

| Parameter Name  | Abbreviation| Required in YAML| Description                                                    |
| ---------- | -------- | -------------- | ------------------------------------------------------------ |
| type       | -        | No          | Deployment type. Options: `code, config`.                          |


### Examples

**If you have a resource description file (YAML)**, run `s deploy ` to deploy resources. The command output is as follows:

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

### Precautions

You may have some special requirements during resource deployment. See the following description:

- **To deploy or update only the code**, add the `--type code` parameter. **To deploy or update only the configuration**, add `--type config` instead.

## deploy function

`deploy function` is used to deploy a function.

You can run `deploy function -h` or `deploy function --help` to view the documentation.

### Parameter Description

| Parameter Name   | Abbreviation| Required in YAML| Description                                                    |
| ----------- | -------- | -------------- | ------------------------------------------------------------ |
| type        | -        | No          | Deployment type. Options: `code, config`.                          |


### Examples

**If you have a resource description file (YAML)**, run `s deploy function` to deploy the function. The command output is as follows:

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


## deploy trigger

`deploy trigger` is used to deploy a trigger of a function.

You can run `deploy trigger -h` or `deploy trigger --help` to view the documentation.

### Parameter Description

### Examples

**If you have a resource description file (YAML)**, run `s deploy trigger` to deploy a trigger. The command output is as follows:

```text
fgs-deploy-test: 
    region:   cn-north-4
    trigger:
        triggerTypeCode: APIG
        status: ACTIVE
        eventData:
            name: APIG_test
            groupName: APIGroup_xxx
            auth: NONE # IAM
            protocol: HTTPS
            timeout: 5000
```

> When deploying service resources, you may need to perform some interactive operations. For details, see `Interaction During Deployment` in [deploy Command Precautions](#Precautions).
