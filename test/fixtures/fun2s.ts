import ComponentDemo from '../../src/index';
// import { INPUTS } from './inputs';

const INPUTS = {"props":{},"credentials":{"Alias":"huawei","AccessKeyID":"UJIDQHOIUYMLG4L62G1A","SecretAccessKey":"OrjFSm80786V5soxDcXr5tyzDexxt41EmTS7IfjD"},"appName":"default","project":{"component":"fgs","access":"huawei","projectName":"default"},"command":"fun2s","args":"--region cn-east-3 --function-name start-fg-event-nodejs14 -a huawei --target ../../s.yml","argsObj":["--region","cn-east-3","--function-name","start-fg-event-nodejs14","-a","huawei","--target","D:/Test/s.yml"],"path":{"configPath":"D:\\Test\\start-fg-event-nodejs14\\code"}};

(async () => {
    try {
        const data = await new ComponentDemo().fun2s(INPUTS);
        console.log(data);
    } catch (error) {
        console.error(error);
    }
})();