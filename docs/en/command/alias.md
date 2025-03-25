# alias Commands

`alias` commands are used to view, publish, modify, and delete a function alias.

- [alias Commands](#alias-Commands)
  - [Command Parsing](#Command-Parsing)
  - [alias get](#alias-get)
    - [Parameter Description](#Parameter-Description)
    - [Examples](#Examples)
  - [alias list](#alias-list)
    - [Parameter Description](#Parameter-Description-1)
    - [Examples](#Examples-1)
  - [alias publish](#alias-publish)
    - [Parameter Description](#Parameter-Description-2)
    - [Examples](#Examples-2)
  - [remove alias](remove.md#remove-alias)

## Command Parsing

You can run `alias -h`/`alias --help` to view the documentation.

This command includes three subcommands:

- [get: View details about an alias.](#alias-get)
- [list: List all aliases.](#alias-list)
- [publish: Publish or update an alias.](#alias-publish)

## alias get

`alias get` is used to obtain details about a specified alias of a service.

You can run `alias get -h`/`alias get --help` to view the documentation.

### Parameter Description

| Parameter Name     | Abbreviation | Required in YAML| Required in CLI| Description    |
| ------------ | -------- | --------------- | ------------- | ----------- |
| region        | -        | No           | Yes          | Region     |
| function-name | -        | No           | Yes          | Function name  |
| alias-name    | -        | Yes           | Yes          | Alias     |

> This command supports some global parameters, for example, `-a/--access` and `--debug`. For details, see [Serverless Devs Global Parameters](https://serverless-devs.com/serverless-devs/command/readme#Global-Parameters).

### Examples

- **If you have a resource description file (YAML)**, run `s alias get --alias-name aliasName` to obtain the details about a specified alias.
- **If you use CLI (without a YAML resource description file)**, specify a region and service name. For example, `s cli fgs alias get --region cn-north-4 --function-name fg-test --alias-name pre`.

> ⚠️️ CAUTION   
> - When using `cli`, if the key is not `default`, add the `access` parameter. For example, `s cli fgs alias get --region cn-north-4 --function-name fg-test --alias-name pre --access xxxx`.

Execution result of the preceding command:

```text
fg-test:
  aliasName:               pre
  versionId:               1
  description:             test publish version
  additionalVersionWeight:
  createdTime:             2021-11-08T06:51:36Z
  lastModifiedTime:        2021-11-08T06:54:02Z
```

## alias list

`alias list` is used to list the aliases.

You can run `alias list -h`/`alias list --help` to view the documentation.

### Parameter Description

| Parameter Name    | Abbreviation| Required in YAML| Required in CLI| Description |
| ------------ | -------- | --------------- | -------------- | -------------- |
| region       | -        | No           | Yes          | Region |
| function-name | -        | No           | Yes          | Function name                         |
| table        | -        | No           | No          | Whether to output in table  |

> This command supports some global parameters, for example, `-a/--access` and `--debug`. For details, see [Serverless Devs Global Parameters](https://serverless-devs.com/serverless-devs/command/readme#Global-Parameters).

### Examples

- **If you have a resource description file (YAML)**, run `s alias list` to list the aliases.
- **If you use CLI (without a YAML resource description file)**, specify a region and service name. For example, `s cli fgs alias list --region cn-north-4 --function-name fg-test`.

> ⚠️️ CAUTION   
> - When using `cli`, if the key is not `default`, add the `access` parameter. For example, `s cli fgs alias list --region cn-north-4 --function-name fg-test --access xxxx`.

Execution result of the preceding command:

```text
fg-test:
  -
    aliasName:               pre
    versionId:               1
    description:             test publish version
    lastModifiedTime:        2021-11-08T06:54:02Z
    additionalVersionWeight:
```

If the `--table` parameter is used, the following output is displayed.

```text
  ┌───────────┬───────────┬──────────────────────┬──────────────────────┬─────────────────────────┐
  │ name      │ version   │     description      │   lastModifiedTime   │ additionalVersionWeight │
  ├───────────┼───────────┼──────────────────────┼──────────────────────┼─────────────────────────┤
  │ pre       │ 1         │ test publish version │ 2021-11-08T06:54:02Z │                         │
  └───────────┴───────────┴──────────────────────┴──────────────────────┴─────────────────────────┘
```

## alias publish

`alias publish` is used to publish and update an alias.

You can run `alias publish -h`/`alias publish --help` to view the documentation.

### Parameter Description

| Parameter Name       | Abbreviation| Required in YAML| Required in CLI| Description    |
| -------------- | -------- | --------------- | -------------- | ------------------ |
| region         | -        | No           | Yes          | Region    |
| function-name  | -        | No           | Yes          | Function name|
| alias-name     | -        | Yes           | Yes          | Alias  |
| version-name   | -        | No           | Yes          | Version name corresponding to the alias  |
| description    | -        | No           | No          | Description of the alias   |
| gversion       | -        | No           | No          | ID of an additional version for dark launch. This is required only when a weight is specified.     |
| weight         | -        | No           | No          | Weight of the additional version. This is required only when an additional version ID is specified.   |

> This command supports some global parameters, for example, `-a/--access` and `--debug`. For details, see [Serverless Devs Global Parameters](https://serverless-devs.com/serverless-devs/command/readme#Global-Parameters).

### Examples

- **If you have a resource description file (YAML)**, run `s alias publish` to publish or update an alias.
- **If you use CLI (without a YAML resource description file)**, specify a region and service name. For example, `s cli fgs alias publish --region cn-north-4 --function-name fg-test --alias-name pre --version-name 1`.

> ⚠️️ CAUTION   
> - When using `cli`, if the key is not `default`, add the `access` parameter. For example, `s cli fgs alias publish --region cn-north-4 --function-name fg-test --alias-name pre --version-name 1 --access xxxx`.

Execution result of the preceding command:

```text
fg-test:
  aliasName:               pre
  versionId:               1
  description:
  additionalVersionWeight:
  createdTime:             2021-11-08T06:51:36Z
  lastModifiedTime:        2021-11-08T06:51:36Z
```

To upgrade an alias, specify the alias and update the desired parameters. For example, to add a description for the preceding `pre` alias, specify the `--description` parameter and run the previous command again. The output is as follows:

```text
fc-deploy-test:
  aliasName:               pre
  versionId:               1
  description:             test publish version
  additionalVersionWeight:
  createdTime:             2021-11-08T06:51:36Z
  lastModifiedTime:        2021-11-08T06:54:02Z
```
