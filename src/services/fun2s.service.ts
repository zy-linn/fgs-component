import { commandParse, help, spinner } from "@serverless-devs/core";
import { ICredentials, IInputs, IProperties, InputProps } from "../interface/interface";
import logger from "../common/logger";
import { FUN_TO_S } from "../help/fun2s";
import { extendFunctionInfos, getFunctionClient, handlerResponse, handlerUrn } from "../utils/util";
import { FunctionClient } from "../clients/function.client";
import { ShowFunctionConfigRequest } from "@huaweicloud/huaweicloud-sdk-functiongraph";
import { IFunctionResult } from "../interface/function.interface";
import * as path from 'path';
import * as fs from 'fs';
import * as compressing from 'compressing';
const yaml = require('js-yaml');

interface IFun2s {
    region?: string;
    functionName?: string;
    target?: string;
    urn?: string;
    access?: string;
    path?: string;
}

export class Fun2sService {
    private spin = spinner();
    public async handleInputs(inputs: InputProps): Promise<IInputs> {
        logger.debug(`inputs.props: ${JSON.stringify(inputs.props)}`);
        if (!inputs?.credentials?.AccessKeyID || !inputs?.credentials?.SecretAccessKey) {
            throw new Error("Havn't set huaweicloud credentials. Run $s config add .");
        }

        const parsedArgs: { [key: string]: any } = commandParse(inputs, {
            boolean: ["help"],
            string: ['region', 'function-name', 'target'],
            alias: { help: "h" },
        });

        const parsedData = parsedArgs?.data || {};

        if (parsedData.help) {
            help(FUN_TO_S)
            return { isHelp: true };
        }

        const props: IProperties = inputs.props;
        props.function = extendFunctionInfos(props.function);
        logger.debug(`props: ${JSON.stringify(props)}`);
    
        const endProps: IFun2s = {
            region: parsedData.region || props?.region,
            functionName: parsedData['function-name'] || props?.function?.functionName,
            urn: '',
            access: inputs.project.access ?? 'default',
            ...this.handlerTarget(parsedData.target, inputs.path.configPath)
        };

        if (!endProps.region) {
            throw new Error("Region not found. Please specify with --region");
        }

        if (!endProps.functionName) {
            throw new Error("Function Name not found. Please specify with --function-name.");
        }

        const credentials: ICredentials = inputs.credentials;

        const { client, projectId } = await getFunctionClient(credentials, endProps.region);

        endProps.urn = handlerUrn(endProps.region, projectId, 'default', endProps.functionName, 'latest');

        logger.debug(`endProps: ${JSON.stringify(endProps)}`);
        return {
            props: endProps,
            client,
        };
    }

    async transform(props: IFun2s, client: FunctionClient) {
        try {
            this.spin.info(`Converting function [${props.functionName}].`);
            logger.debug(`Converting function [${props.functionName}]`);
            const request = new ShowFunctionConfigRequest().withFunctionUrn(props.urn);
            const result: any = await client.getFunctionClient().showFunctionConfig(request);
            handlerResponse(result);
            this.genSYml(props, result);
            await this.getCodeFromObs(client, result, props.path);
            console.log(`

Tips for next step

======================
* Deploy Function: s deploy

            `);
        } catch (error) {
            this.spin.fail(`Convert function [${props.functionName}] failed.`);
            logger.error(`Convert function [${props.functionName}] failed. err=${(error as Error).message}`);
            throw error;
        }
    }

    private genSYml(props: IFun2s, funcInfo: IFunctionResult) {
        const yamlInfo = {
            edition: '1.0.0',
            name: "transfrom_funs",
            access: props.access,
            vars: {
                region: props.region,
                functionName: funcInfo.func_name,
            },
            services: {
                'component-test': {
                    component: 'fgs',
                    props: {
                        region: "${vars.region}",
                        function: {
                            functionName: "${vars.functionName}",
                            handler: funcInfo.handler,
                            memorySize: funcInfo.memory_size,
                            timeout: funcInfo.timeout,
                            runtime: funcInfo.runtime,
                            package: funcInfo.package,
                            concurrency: funcInfo.strategy_config?.concurrency ?? '1',
                            concurrentNum: funcInfo.strategy_config?.concurrent_num ?? '400',
                            codeType: funcInfo.code_type,
                            code: {
                                codeUri: "./code"
                            }
                        }
                    }
                }
            }
        };
        if (funcInfo.xrole) {
            yamlInfo.services["component-test"].props.function['agencyName'] = funcInfo.xrole;
        }
        if (funcInfo.user_data) {
            yamlInfo.services["component-test"].props.function['environmentVariables'] = JSON.parse(funcInfo.user_data);
        }
        if (funcInfo.func_vpc) {
            yamlInfo.services["component-test"].props.function['vpcId'] = funcInfo.func_vpc.vpc_id;
            yamlInfo.services["component-test"].props.function['subnetId'] = funcInfo.func_vpc.subnet_id;
        }
        if (funcInfo.depend_version_list) {
            yamlInfo.services["component-test"].props.function['dependVersionList'] = funcInfo.depend_version_list;
        }
        const yamlStr = yaml.dump(yamlInfo);
        fs.writeFileSync(path.resolve(props.path, props.target), yamlStr, 'utf8');
    }

    private getCodeFromObs(client: FunctionClient, funcInfo: IFunctionResult, configPath = '') {
        const zipFile = path.join(configPath, funcInfo.code_filename);
        return new Promise((res, rej) => {
            client.getObsIns().getObject({
                Bucket: `functionstorage-${funcInfo.project_name}`,
                Key: ['functions', funcInfo.namespace, funcInfo.package, funcInfo.func_name, funcInfo.version, funcInfo.code_filename].join('/'),
                SaveAsFile: zipFile
            }, async (err, result) => {
                if (err) {
                    rej(err);
                } else if (result?.CommonMsg?.Status === 200) {
                    await compressing.zip.uncompress(zipFile, path.join(configPath, 'code'));
                    fs.unlinkSync(zipFile);
                    res(true);
                } else {
                    rej(result);
                }
            });
        })
    }

    private handlerTarget(target = '', configPath = '') {
        const list = target.split('/') || target.split('\\');
        const name = list.pop();
        const targetPath = configPath || process.cwd();
        const isAbsolute = path.isAbsolute(target);
        if (['s.yml', 's.yaml'].includes(name)) {
            return {
                target: 's.yml',
                path: isAbsolute ? path.join(...list) : path.resolve(targetPath, ...list)
            };
        }
        return {
            target: name,
            path: isAbsolute ? path.join(...list) : path.resolve(targetPath, ...list)
        };
    }
}