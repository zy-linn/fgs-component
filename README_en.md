# Huawei Cloud FunctionGraph Component
## Component Description
This is a function application lifecycle management tool developed based on [Serverless Devs](https://www.serverless-devs.com/index_en.html). You can use the `s.yaml` configuration file to quickly deploy an application on [Huawei Cloud FunctionGraph](https://www.huaweicloud.com/intl/en-us/product/functiongraph.html).

## Prerequisites
Install Node.js on your local PC.

## Getting Started
1. [Install the Serverless Devs developer tool](https://docs.serverless-devs.com/en/serverless-devs/install) by running `npm install -g @serverless-devs/s`.
> After the installation is complete, configure a key by referring to the [instructions](./docs/en/config.md).  

2. Initialize a `Hello World` project by running `s init start-fg-http-nodejs14`.

3. After the initialization is complete, enter the project and run `s deploy` to deploy a function.

## Using Commands

Huawei Cloud FunctionGraph component has the following capabilities.

| Build & Deploy| Publish & Config |  Other|
| --- | --- | --- |
| [**deploy**](docs/en/command/deploy.md)  |  [**version**](docs/en/command/version.md)     | [**fun2s**](docs/en/command/fun2s.md)| 
| [**remove**](docs/en/command/remove.md)  |  [**alias**](docs/en/command/alias.md)    |  | 

When using the FunctionGraph component, you will need to compile a YAML resource description file. For details, see [**Huawei Cloud FunctionGraph YAML Specifications**](docs/en/yaml/readme.md).
