# invoke Command

The `invoke` command is used to invoke or trigger an inline function.

- [Command Parsing](#Command-Parsing)
  - [Parameter Description](#Parameter-Description)
  - [Examples](#Examples)
  - [Precautions](#Precautions)

## Command Parsing

You can run `invoke -h` or `invoke --help` to view the documentation.

### Parameter Description

| Parameter Name                    | Abbreviation| Required in YAML| Required in CLI| Description                                                                                                                                                                                                                                                                                                  |
| ---------------------------- | -------- | --------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| region                       | -        | No           | Yes          | Region|
| function-name                | -        | No           | Yes          | Function name       |
| qualifier                    | -        | No           | No          | Version or alias to invoke. If you specify an alias, add an exclamation mark (!) before it.       |
| event                        | e        | No           | No          | Event |
| event-file                   | f        | No           | No          | Event file  |
| event-stdin                  | s        | No           | No          | Event input   |

> This command supports some global parameters, for example, `-a/--access` and `--debug`. For details, see [Serverless Devs Global Parameters](https://serverless-devs.com/serverless-devs/command/readme#Global-Parameters).

### Examples

- **If you have a resource description file (YAML)**, run `s invoke` to invoke an inline function.
- **If you use CLI (without a YAML resource description file)**, specify a region, service name, and function name. For example, `s invoke --region cn-north-4  --function-name fg-test`.

Execution result of the preceding command:

```text
Request url: https://start-fp-nodejs-hello-wice-test-cturhuznax.cn-shenzhen.fcapp.run/
========= FC invoke Logs begin =========
FC Invoke Start RequestId: 68f15da2-a453-4f7e-90d3-91198b76afbf
FC Invoke End RequestId: 68f15da2-a453-4f7e-90d3-91198b76afbf

Duration: 2.96 ms, Billed Duration: 3 ms, Memory Size: 128 MB, Max Memory Used: 10.83 MB
========= FC invoke Logs end =========

FC Invoke Result[code: ${resp.code}]:
Hello world!
```
