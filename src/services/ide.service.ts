import * as fs from 'fs-extra';
import * as path from 'path';
import * as _ from 'lodash';
import { PortService } from './port.service';
import { getRuntimeType } from '../utils/util';
import { RuntimeType } from '../interface/interface';

export class IdeService {
    constructor(protected readonly logger: any) {

    }
    /**
     * 将vscode调试配置信息写入launch.json文件
     * @param baseDir 代码基本路径
     * @param functionName 函数名称
     * @param runtime 运行时
     * @param codeSource 代码路径
     * @returns 
     */
    async writeConfigForVscode(baseDir: string, functionName: string, runtime: string, codeSource: string) {
        const configJsonFolder: string = path.join(baseDir, '.vscode');
        const configJsonFilePath: string = path.join(configJsonFolder, 'launch.json');

        try {
            fs.ensureDirSync(path.dirname(configJsonFilePath));
        } catch (err) {
            this.logger.warn(`Ensure directory: ${configJsonFolder} failed.`);
            await this.showDebugIdeTipsForVscode(functionName, runtime, codeSource);
            this.logger.debug(`Ensure directory: ${configJsonFolder} failed, error: ${err}`);
            return;
        }
        const vscodeDebugConfig = await this.getVscodeConfig(functionName, runtime, codeSource);
        if (fs.pathExistsSync(configJsonFilePath) && fs.lstatSync(configJsonFilePath).isFile()) {
            // 文件已存在则对比文件内容与待写入内容，若不一致提示用户需要手动写入 launch.json
            const curConfig = await fs.readFile(configJsonFilePath, { encoding: 'utf8' });
            const configInJsonFile = JSON.parse(curConfig.replace(/\/\/.*$/mg, ''));
            if (_.isEqual(configInJsonFile, vscodeDebugConfig)) { 
                return
            }
            this.logger.warn(`File: ${configJsonFilePath} already exists, please overwrite it with the following config.`);
            await this.showDebugIdeTipsForVscode(functionName, runtime, codeSource);
            return;
        }
        
        try {
            // 配置写入
            await fs.writeFile(configJsonFilePath, JSON.stringify(vscodeDebugConfig, null, 4), { encoding: 'utf8', flag: 'w' });
        } catch (err) {
            this.logger.warn(`Write ${configJsonFolder} failed.`);
            await this.showDebugIdeTipsForVscode(functionName, runtime, codeSource);
            this.logger.debug(`Write ${configJsonFolder} failed, error: ${err}`);
        }
    }

    /**
     * 展示配置信息
     * @param functionName 函数名称
     * @param runtime 运行时
     * @param codeSource 代码路径
     */
    async showDebugIdeTipsForVscode(functionName: string, runtime: string, codeSource: string): Promise<void> {
        const vscodeDebugConfig = await this.getVscodeConfig(functionName, runtime, codeSource);
        // todo: auto detect .vscode/launch.json in codeuri path.
        console.log('You can paste these config to .vscode/launch.json, and then attach to your running function', 'yellow');
        console.log('///////////////// config begin /////////////////');
        console.log(JSON.stringify(vscodeDebugConfig, null, 4));
        console.log('///////////////// config end /////////////////');
      }

      /**
       * 获取vscode调试配置
       * @param functionName 
       * @param runtime 
       * @param codePath 
       * @param dcachePath 
       * @returns 
       */
    async getVscodeConfig(functionName: string, runtime: string, codePath: string, dcachePath?: string) {
        let debugConfig;
        const curRruntime: RuntimeType = getRuntimeType(runtime);
        const debugPort = await PortService.getInstance().getDebugPort(functionName);
        switch (curRruntime) {
            case RuntimeType.NODE:
                debugConfig = {
                    name: `fgs/${functionName}`,
                    type: 'node',
                    request: 'attach',
                    address: 'localhost',
                    port: debugPort,
                    localRoot: codePath,
                    remoteRoot: dcachePath ?? codePath,
                    protocol: 'legacy',
                    stopOnEntry: false,
                    skipFiles: ["<node_internals>/**"]
                };
                break;
            case RuntimeType.PYTHON:
                debugConfig = {
                    name: `fgs/${functionName}`,
                    type: 'python',
                    request: 'attach',
                    host: 'localhost',
                    port: debugPort,
                    pathMappings: [
                        {
                            localRoot: codePath,
                            remoteRoot: dcachePath ?? codePath
                        }
                    ]
                };
                break;
            case RuntimeType.JAVA: {
                debugConfig = {
                    name: `fgs/${functionName}`,
                    type: 'java',
                    request: 'attach',
                    hostName: 'localhost',
                    port: debugPort
                };
                break;
            }
            case RuntimeType.PHP: {
                debugConfig = {
                    name: `fgs/${functionName}`,
                    type: 'php',
                    request: 'launch',
                    port: debugPort,
                    stopOnEntry: false,
                    pathMappings: {
                        localRoot: codePath,
                        remoteRoot: dcachePath ?? codePath
                    }
                };
                break;
            }
            default:
                debugConfig = {
                    name: `fgs/${functionName}`,
                    type: 'node',
                    request: 'attach',
                    address: 'localhost',
                    port: debugPort,
                    localRoot: codePath,
                    remoteRoot: dcachePath ?? codePath,
                    protocol: 'legacy',
                    stopOnEntry: false,
                    skipFiles: ["<node_internals>/**"]
                };
                break;
        }
        return {
            'version': '0.2.0',
            'configurations': [
                debugConfig
            ]
        }
    }

    /**
     * 获取调试配置
     * @param functionName 函数名称
     * @param runtime 运行时
     * @returns 
     */
    async getDebugEnv(functionName: string, runtime: string) {
        const debugPort = await PortService.getInstance().getDebugPort(functionName);
        const curRruntime: RuntimeType = getRuntimeType(runtime);
        switch (curRruntime) {
            case RuntimeType.NODE:
                return `--inspect-brk=127.0.0.1:${debugPort}`;
            case RuntimeType.PYTHON:
                return `-m ptvsd --host 0.0.0.0 --port ${debugPort} --wait`;
            case RuntimeType.JAVA:
                return `-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,quiet=y,address=*:${debugPort}`;
            case RuntimeType.PHP:
                return `remote_enable=1 remote_autostart=1 remote_port=${debugPort}`;
            default:
                return `--inspect-brk=127.0.0.1:${debugPort}`;
        }
    }
}