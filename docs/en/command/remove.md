# remove Commands

`remove` commands are used to remove a deployed resource.

- [Command Parsing](#Command-Parsing)
  - [Parameter Description](#Parameter-Description)
  - [Examples](#Examples)
- [remove function](#remove-function)
  - [Parameter Description](#Parameter-Description-1)
  - [Examples](#Examples-1)
- [remove trigger](#remove-trigger)
  - [Parameter Description](#Parameter-Description-2)
  - [Examples](#Examples-2)
- [remove version](#remove-version)
  - [Parameter Description](#Parameter-Description-3)
  - [Examples](#Examples-3)
- [remove alias](#remove-alias)
  - [Parameter Description](#Parameter-Description-4)
  - [Examples](#Examples-4)

>  ⚠ CAUTION: **Resources cannot be recovered once removed.**


## Command Parsing

You can run `remove -h` or `remove --help` to view the documentation.

This command includes four subcommands:
- [function: Delete a function.](#remove-function)
- [trigger: Delete a trigger.](#remove-trigger)
- [version: Delete a version.](#remove-version)
- [alias: Delete an alias.](#remove-alias)


### Examples

**If you have a resource description file (YAML)**, run `s remove ` to delete a resource. The command output is as follows:

```text
Function [myFunction] deleted successfully.
```

## remove function

`remove function` is used to delete a specified function. This will also delete all versions, aliases, and triggers of the function.

You can run `remove function -h` or `remove function --help` to view the documentation.

### Parameter Description

| Parameter Name     | Abbreviation| Required in YAML| Required in CLI| Description                                                    |
| ------------ | -------- | -------------- | ------------- | ------------------------------------------------------------ |
| region       | -        | No          | Yes         | Region|
| function-name | -        | No          | Yes         | Function name                                                      |

> This command supports some global parameters, for example, `-a/--access` and `--debug`. For details, see [Serverless Devs Global Parameters](https://serverless-devs.com/serverless-devs/command/readme#Global-Parameters).

### Examples

- **If you have a resource description file (YAML)**, run `s remove function` to delete a specified function.
- **If you use CLI (without a YAML resource description file)**, specify a region and service name. For example, `s cli fgs remove function --region cn-north-4  --function-name fgs-test`.

> ⚠️️ CAUTION   
> - When using `cli`, if the key is not `default`, add the `access` parameter. For example, `s cli fgs remove function --region cn-north-4  --function-name fgs-test --access xxxx`.

Execution result of the preceding command:

```text
Function [fg-test] deleted.
```

## remove trigger

`remove trigger` is used to delete a specified trigger.

You can run `remove trigger -h` or `remove trigger --help` to view the documentation.

### Parameter Description

| Parameter Name    | Abbreviation| Required in YAML| Required in CLI| Description                                                    |
| ------------ | -------- | -------------- | ------------- | ------------------------------------------------------------ |
| region       | -        | No          | Yes         | Region|
| function-name | -        | No          | Yes         | Function name                                                      |
| version-name | -        | No          | No         | Version. Default: **latest**     |
| trigger-type | -        | No          | Yes         | Trigger type     |
| trigger-name | -        | No          | Yes         | Trigger name. `APIG`: API name; `OBS`: bucket name; `TIMER`: trigger name  |

> This command supports some global parameters, for example, `-a/--access` and `--debug`. For details, see [Serverless Devs Global Parameters](https://serverless-devs.com/serverless-devs/command/readme#Global-Parameters).

### Examples

- **If you have a resource description file (YAML)**, run `s remove trigger` to delete a trigger declared in the file.
- **If you use CLI (without a YAML resource description file)**, specify a region and service name. For example, `s cli fgs remove trigger --region cn-north-4  --function-name fgs-test --trigger-type APIG --trigger-name fgs-test-trigger`.

Execution result of the preceding command:

```text
Trigger [fgs-test-trigger] deleted.
```

## remove version

`remove version` is used to delete a specified version.

You can run `remove version -h` or `remove version --help` to view the documentation.

### Parameter Description

| Parameter Name    | Abbreviation| Required in YAML| Required in CLI| Description                                                    |
| ------------ | -------- | -------------- | ------------- | ------------------------------------------------------------ |
| region       | -        | No          | Yes         | Region|
| function-name | -        | No          | Yes         | Service name                                                      |
| version-name   | -        | Yes          | Yes         | Version name. It cannot be `latest`.       |

> This command supports some global parameters, for example, `-a/--access` and `--debug`. For details, see [Serverless Devs Global Parameters](https://serverless-devs.com/serverless-devs/command/readme#Global-Parameters).

### Examples

- **If you have a resource description file (YAML)**, run `s remove version --version-name versionName` to delete a specified `versionName`.
- **If you use CLI (without a YAML resource description file)**, specify a region and service name. For example, `s cli fgs remove version --region cn-north-4 --function-name fgs-test --version-name v1`.

Execution result of the preceding command:

```text
Version [v1] deleted.
```

## remove alias

`remove alias` is used to delete a specified alias.

You can run `remove alias -h` or `remove alias --help` to view the documentation.

### Parameter Description

| Parameter Name    | Abbreviation| Required in YAML| Required in CLI| Description                                                    |
| ------------ | -------- | -------------- | ------------- | ------------------------------------------------------------ |
| region       | -        | No          | Yes         | Region|
| function-name | -        | No          | Yes         | Service name                                                      |
| alias-name   | -        | Yes          | Yes         | Alias                                                        |

> This command supports some global parameters, for example, `-a/--access` and `--debug`. For details, see [Serverless Devs Global Parameters](https://serverless-devs.com/serverless-devs/command/readme#Global-Parameters).

### Examples

- **If you have a resource description file (YAML)**, run `s remove alias --alias-name aliasName` to delete a specified alias.
- **If you use CLI (without a YAML resource description file)**, specify a region and service name. For example, `s cli fgs remove alias --region cn-north-4 --function-name fgs-test --alias-name pre`.

Execution result of the preceding command:

```text
Alias [pre] deleted.
```
