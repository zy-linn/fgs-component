# fun2s Command

The `fun2s` command is used to convert the configuration of a function into the `s.yaml` format so that it can be identified by Serverless Devs.

- [Command Parsing](#Command-Parsing)
  - [Parameter Description](#Parameter-Description)
  - [Examples](#Examples)


## Command Parsing

You can run `fun2s -h` or `fun2s --help` to view the documentation.

### Parameter Description

| Parameter Name| Abbreviation| Required in CLI| Description                                                    |
| -------- | -------- | ------------- | ------------------------------------------------------------ |
| region   | -        | Yes         | Region|
| function-name   | -        | Yes         | Function name|
| target   | -        | No         | Generated Serverless Devs configuration file (default: `s.yaml`)     |

> This command supports some global parameters, for example, `-a/--access` and `--debug`. For details, see [Serverless Devs Global Parameters](https://serverless-devs.com/serverless-devs/command/readme#Global-Parameters).

### Examples

In the funcraft project, run `fun2s` to convert a function into the YAML format. For example:

```shell script
s cli fgs fun2s --region cn-north-4 --function-name fgs-deploy-test --target ./s.yml

Tips for next step
======================
* Deploy Function: s deploy -t ./s.yml
```

In this way, you can convert the original function configuration into `s.yaml` so that it complies with Serverless Devs specifications.

After conversion (`s.yaml`):

```yaml
edition: 1.0.0
name: transform_fun
access: default
vars:
  region: cn-north-4
  functionName: fgs-deploy-test
services:
  component-test: # Service name
    component: fgs # Component name
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
