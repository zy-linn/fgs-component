# version Commands

`version` commands are used to view, publish, and delete a function version.

- [Command Parsing](#Command-Parsing)
- [version list](#version-list)
  - [Parameter Description](#Parameter-Description)
  - [Examples](#Examples)
- [version publish](#version-publish)
  - [Parameter Description](#Parameter-Description-1)
  - [Examples](#Examples-1)
- [remove version](remove.md#remove-version)

## Command Parsing

You can run `version -h` or `version --help` to view the documentation.

This command includes two subcommands:

- [list: List all versions.](#version-list)
- [publish: Publish a version.](#version-publish)

## version list

`version list` is used to list all published versions of a service.

You can run `version list -h` or `version list --help` to view the documentation.

> This command supports some global parameters, for example, `-a/--access` and `--debug`. For details, see [Serverless Devs Global Parameters](https://serverless-devs.com/serverless-devs/command/readme#Global-Parameters).

### Parameter Description

| Parameter Name    | Abbreviation| Required in YAML| Required in CLI| Description                                                                                                                                                                                                                                                                                                  |
| ------------ | -------- | --------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| region       | -        | No           | Yes          | Region|
| function-name       | -        | No           | Yes          | Function name|
| table        | -        | No           | No          | Whether to output in table|                                             
### Examples

- **If you have a resource description file (YAML)**, run `s version list` to list all published versions of a function.
- **If you use CLI (without a YAML resource description file)**, specify a region and service name. For example, `s cli fgs version list --region cn-north-4 --function-name fg-test`.


> ⚠️️ CAUTION   
> - When using `cli`, if the key is not `default`, add the `access` parameter. For example, `s cli fgs version list --region cn-north-4 --function-name fg-test --access xxxx`.

Execution result of the preceding command:

```text
fg-test:
  -
    version:        1
    description:      test publish version
    lastModifiedTime: 2021-11-08T06:07:00Z
```

If the `--table` parameter is used, the following output is displayed.

```text
  ┌───────────┬──────────────────────┬──────────────────────┐
  │ version   │     description      │   lastModifiedTime   │
  ├───────────┼──────────────────────┼──────────────────────┤
  │ 1         │ test publish version │ 2021-11-08T06:07:00Z │
  └───────────┴──────────────────────┴──────────────────────┘
```

## version publish

`version publish` is used to publish a version.

You can run `version publish -h` or `version publish --help` to view the documentation.

> This command supports some global parameters, for example, `-a/--access` and `--debug`. For details, see [Serverless Devs Global Parameters](https://serverless-devs.com/serverless-devs/command/readme#Global-Parameters).

### Parameter Description

| Parameter Name             | Abbreviation| Required in YAML| Required in CLI| Description                                                                                                                                                                                                                                                                                                  |
| --------------------- | -------- | --------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| region                | -        | No           | Yes          | Region     |
| function-name         | -        | No           | Yes          | Function name |
| version-name               | -        | No           | No          | Version name   |
| description           | -        | No           | No          | Version description |

### Examples

- **If you have a resource description file (YAML)**, run `s version publish` to publish a version.
- **If you use CLI (without a YAML resource description file)**, specify a region and service name. For example, `s cli fgs version publish --region cn-north-4 --function-name fg-test --version-name 1 --description "test publish version"`.

> ⚠️️ CAUTION   
> - When using `cli`, if the key is not `default`, add the `access` parameter. For example, `s cli fgs version publish --region cn-north-4 --function-name fg-test --version-name 1 --description "test publish version" --access xxxx`.


Execution result of the preceding command:

```text
fg-test:
  version:        1
  description:      test publish version
  lastModifiedTime: 2021-11-08T06:07:00Z
```
