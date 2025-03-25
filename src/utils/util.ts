import * as fs from "fs";
import * as compressing from 'compressing';
import Table from 'tty-table';
import inquirer from 'inquirer';
import { merge, omit } from 'lodash';
import { ICredentials, RuntimeType, ServiceType } from "../interface/interface";
import { FunctionClient } from "../clients/function.client";
import { IamClient } from "../clients/iam.client";
import { IFunctionProps } from "../interface/function.interface";

/**
 * 代码转化成base64
 * @param codePath 代码路径
 * @param name 临时的zip文件名称
 * @returns 
 */
export async function startZip(codePath: string, name = 'index.zip'): Promise<string> {
    const zipPath = `${codePath}/${name}`;
    deleteFile(zipPath);
    return new Promise((resolve, reject) => {
        const files: Array<any> = fs.readdirSync(codePath);
        const zipStream = new compressing.zip.Stream();
        files.forEach(file => {
            zipStream.addEntry(`${codePath}/${file}`);
        });

        const destStream = fs.createWriteStream(zipPath);
        zipStream.pipe(destStream).on('finish', () => {
            let data = fs.readFileSync(zipPath);
            let dataString = Buffer.from(data).toString('base64');
            setTimeout(() => {
                deleteFile(zipPath);
            }, 0);
            resolve(dataString);
        });
    });
}

/**
* 删除文件
* @param path 
*/
export function deleteFile(path: string): void {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}

/**
 * 获取地址
 * @param region 
 * @param service 
 * @returns 
 */
export function getEndpoint(region = 'cn-north-4', service = ServiceType.FUNCTIONGRAPH) {
    if (service === ServiceType.IAM) {
        return 'https://iam.myhuaweicloud.com';
    }
    return `https://${service.toString()}.${region}.myhuaweicloud.com`;
}

/**
 * 随机生成字符串
 * @param len 长度
 * @returns 
 */
export function randomLenChar(len = 6) {
    const chars = 'abcdefhijkmnprstwxyz2345678'; // 去掉容易混淆的字符，oOL1,9gq,Uu,I1
    const maxPos = chars.length;
    let name = '';
    for (let i = 0; i < len; i += 1) {
        name += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return name;
}

/**
 * 判断是否为字符串
 * @param obj 
 * @returns 
 */
export function isString(obj) {
    return typeof obj === 'string';
}

/**
 * 判断是否为NUll 或 undefined
 * @param obj 
 * @returns 
 */
export function isNullOrUndefined(obj) {
    return obj === null || obj === undefined;
}

/**
 * 生成函数
 * @param region 区域
 * @param projectId 项目ID
 * @param funPackage 依赖
 * @param name 函数名
 * @param tag 版本
 * @returns 
 */
export function handlerUrn(region, projectId, funPackage, name, tag = '') {
    const urn = `urn:fss:${region}:${projectId}:function:${funPackage}:${name}`;
    return tag ? `${urn}:${tag}` : urn;
}

/**
 * 获取Client实例
 * @param credentials 证书信息
 * @param region 区域
 * @returns Client实例 项目ID
 */
export async function getFunctionClient(credentials: ICredentials, region = ''): Promise<{ client: FunctionClient, projectId: string }> {
    const projectId = await new IamClient().build(credentials).getProject(region);

    if (!projectId) {
        throw new Error(`ProjectId not found. region = ${region}.`);
    }

    const client = new FunctionClient().build(credentials, region, projectId);

    return {
        client,
        projectId
    };
};

/**
 * 处理响应
 * @param param
 */
export function handlerResponse({ httpStatusCode, errorMsg, errorCode }) {
    if ((httpStatusCode >= 300 || httpStatusCode < 200) && errorCode !== 'FSS.0409')  {
        throw new Error(errorMsg);
    }
}

/**
 * 表格展示
 * @param data 数据
 * @param showKey 展示是字段
 */
export const tableShow = (data, showKey) => {
    const options = {
        borderStyle: 'solid',
        borderColor: 'white',
        headerAlign: 'center',
        align: 'left',
        color: 'white',
        width: '100%',
    };
    const headerOption = {
        headerColor: 'white',
        color: 'white',
        align: 'left',
        width: 'auto',
        formatter: value => value,
    };
    const header = showKey.map(value => {
        const valueObj = isString(value) ? { value } : value;
        return {
            ...headerOption,
            ...valueObj
        };
    });

    console.log(Table(header, data, options).render());
};


export async function promptForConfirmOrDetails(message: string): Promise<boolean> {
    const answers: any = await inquirer.prompt([
        {
            type: 'list',
            name: 'prompt',
            message,
            choices: ['yes', 'no'],
        },
    ]);

    return answers.prompt === 'yes';
}

/**
 * 判断是否为YML配置
 * @param configPath 路径
 * @returns 
 */
export function isYml(configPath = '') {
    return configPath.endsWith('s.yml') || configPath.endsWith('s.yaml');
}

/**
 * 获取函数类型
 * @param runtime 函数运行时
 * @returns 
 */
export function getRuntimeType(runtime: string = ''): RuntimeType {
    const types = runtime?.toLocaleLowerCase().trim().match('^(node|python|go|php|java|http|c#)') || [''];
    return types[0] as RuntimeType;
}

/**
 * 扩展函数对象
 * @param functions 
 * @returns 
 */
export function extendFunctionInfos(functions: IFunctionProps) {
    if (!functions || !functions.extend) {
        return functions;
    }
    const func = merge({}, functions.extend, functions);
    return omit(func, ['extend']);
}