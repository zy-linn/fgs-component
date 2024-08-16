import * as fs from 'fs-extra';
import * as _ from 'lodash';
import * as path from 'path';
import { exec } from 'child_process';
import { commandParse, help } from "@serverless-devs/core";
import { ICredentials, IInputs, IProperties, InputProps } from "../interface/interface";
import logger from "../common/logger";
import { LOCAL, LOCAL_INVOKE } from "../help/local";
import { extendFunctionInfos, handlerPath, handlerUrn, mkdirSync, rmdirSync, writeFileSync } from "../utils/util";
import { IFunctionProps } from '../interface/function.interface';
import { EventService } from './event.service';
import { IdeService } from './ide.service';
import { ApiService } from './api.service';
import { PortService } from './port.service';

const LOCAL_COMMAND: string[] = ['invoke'];
const LOCAL_COMMAND_HELP_KEY = {
    invoke: LOCAL_INVOKE,
};

export class LocalService {
    private apiService: ApiService;
    private eventService: EventService;
    private ideService: IdeService;
    constructor() {
        this.eventService = new EventService();
        this.apiService = new ApiService();
        this.ideService = new IdeService(logger);
    }
    public async handleInputs(inputs: InputProps): Promise<IInputs> {
        logger.debug(`inputs.props: ${JSON.stringify(inputs.props)}`);

        const parsedArgs: { [key: string]: any } = commandParse(inputs, {
            boolean: ["help", "debug"],
            alias: {
                help: "h",
                config: 'c',
                mode: 'm',
                'event-name': 'n',
                'event-stdin': 's',
                'event-file': 'f',
                'server-port': 'p',
                'debug-port': 'd',
            },
        });

        const parsedData = parsedArgs?.data || {};
        const rawData = parsedData._ || [];

        const subCommand = rawData[0] || 'invoke';
        logger.debug(`local subCommand: ${subCommand}`);
        if (!LOCAL_COMMAND.includes(subCommand)) {
            help(LOCAL);
            throw new Error(`Does not support ${subCommand} command.`);
        }

        if (parsedData.help) {
            help(LOCAL_COMMAND_HELP_KEY[subCommand])
            return { isHelp: true, subCommand };
        }

        const props: IProperties = inputs.props;
        props.function = extendFunctionInfos(props.function);
        logger.debug(`props: ${JSON.stringify(props)}`);

        const credentials: ICredentials = inputs.credentials;

        const projectId = 'projectId';
        const tempPath = path.join(__dirname, props.function.functionName);
        const urn = handlerUrn(props.region, projectId, 'default', props.function.functionName, 'latest');
        rmdirSync(props.tempPath);
        const options = this.getOptions(parsedData);
        return {
            credentials,
            subCommand,
            baseDir: path.normalize(options.rootPath as string),
            props: { ...props, urn, projectId, tempPath, ...options },
            args: props.args,
        };
    }

    public async invoke(props: IProperties, baseDir: string) {
        if (_.isEmpty(props.function)) {
            logger.error('Please add function config in your s.yml/yaml and retry start.');
            return {
                status: 'failed',
            };
        }
        if (!props.function?.code?.codeUri || !fs.pathExistsSync(props.function.code.codeUri)) {
            logger.error(`Please make sure your codeUri: ${props.function.code.codeUri} exists and retry start.`);
            return {
                status: 'failed',
            };
        }
        logger.debug(`invoke props: ${JSON.stringify(props, null, 4)}`);
        await this.setDebugPort(props.function.functionName, props.debugPort);
        await this.setPort(props.function.functionName, props.serverPort);
        const port = await PortService.getInstance().getPort(props.function.functionName);
        try {
            let result = null;
            mkdirSync(props.tempPath);
            if (props.mode === 'api') {
                await this.handlerAPi(props.function, props.projectId, props.tempPath, port);
            } else {
                logger.debug(`local invoke baseDir: ${baseDir}`);
                result = await this.handlerNormal(props, baseDir, port);
            }
            return {
                status: 'succeed',
                mode: props.mode,
                result
            };

        } catch (error) {
            logger.error(`local invoke failed. error=${(error as Error).message}`);
            await this.apiService.stopProcess(port);
            return {
                status: 'failed',
            };
        } finally {
            rmdirSync(props.tempPath);
        }
    }

    private getOptions(argsData: any): { [props: string]: string | number } {
        return {
            debugPort: argsData['debug-port'],
            debugIde: argsData.config,
            eventName: argsData['event-name'],
            eventStdin: argsData['event-stdin'],
            eventFile: argsData['event-file'],
            serverPort: argsData['server-port'],
            rootPath: handlerPath(argsData['root-path']) ?? process.cwd(),
            mode: argsData.mode
        }
    }

    private handlerEnvs(functions: IFunctionProps, projectId: string = '', tempPath = '') {
        const handlers = functions.handler?.split('.') ?? [];
        const handler = handlers.pop();
        const entry = path.resolve(functions.code?.codeUri, [...handlers, 'js'].join('.'));
        const envs = {
            funcEnv: {
                RUNTIME_FUNC_NAME: functions.functionName,
                RUNTIME_PACKAGE: "default",
                RUNTIME_PROJECT_ID: projectId,
                RUNTIME_FUNC_VERSION: "lastest",
                RUNTIME_MEMORY: functions.memorySize ?? 256,
                RUNTIME_USERDATA: JSON.stringify(functions.userData ?? functions.environmentVariables ?? {}),
                RUNTIME_TIMEOUT: functions.timeout ?? 30
            },
            entry,
            handler,
        };
        logger.debug(`handlerEnvs: ${JSON.stringify(envs)}`);
        writeFileSync(path.join(tempPath, 'init.json'), JSON.stringify(envs));
    }

    /**
     * 设置端口号
     * @param functionName 
     * @param serverPort 
     */
    private async setPort(functionName: string, serverPort: number) {
        const port = serverPort || await PortService.getInstance().getPort(functionName, true);
        PortService.getInstance().setPort(functionName, port);
    }

    /**
     * 设置debug端口号
     * @param functionName 
     * @param debugPort 
     */
    private async setDebugPort(functionName: string, debugPort?: number) {
        const port = debugPort || await PortService.getInstance().getDebugPort(functionName, true);
        PortService.getInstance().setDebugPort(functionName, port);
    }

    private async startExpress(functions: IFunctionProps, projectId: string, tempPath: string, isDebug = false): Promise<boolean> {
        const port = await PortService.getInstance().getPort(functions.functionName);
        logger.debug('startExpress port: ' + port);
        const options = isDebug ? await this.ideService.getDebugEnv(functions.functionName, functions.runtime) : '';
        logger.debug('startExpress options: ' + options);
        this.handlerEnvs(functions, projectId, tempPath);
        const command = `node ${options} ${path.join(__dirname, 'app.js')} ${port} ${tempPath}`;
        exec(command.split('\\').join('/'), {maxBuffer: 1024 * 1024 * 1024 * 1024});
        const result = await this.apiService.checkContainer(port, isDebug);
        logger.debug('start command: ' + command.split('\\').join('/'));
        if (result) {
            logger.debug('check container success');
            return true;
        }
        throw new Error('start error');
    }

    private async handlerAPi(functions: IFunctionProps, projectId, tempPath, port) {
        await this.startExpress(functions, projectId, tempPath);
        logger.log(`API ${functions.functionName} was registered`, 'green');
        logger.log('\turl: ' + `http://localhost:${port}/invoke`, 'yellow');
    }

    private async handlerNormal(props: IProperties, baseDir, port) {
        const event = await this.eventService.getEvent(props);
        const isDebug = props.debugIde === 'vscode';
        isDebug && await this.ideService.writeConfigForVscode(baseDir, props.function.functionName, props.function.runtime, baseDir); // 设置vscode debug配置
        await this.startExpress(props.function, props.projectId, props.tempPath, isDebug);
        logger.debug(`start express success` );
        const invoke = await this.apiService.invokeFunction(event, port);
        logger.debug(`result: ${JSON.stringify(invoke, null, 4)}` );
        await this.apiService.sleep(); // 停止 500ms
        await this.apiService.stopProcess(port);
        return invoke;
    }
}