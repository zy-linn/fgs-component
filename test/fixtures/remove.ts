import ComponentDemo from '../../src/index';
// import { INPUTS } from './inputs';

const INPUTS = {"props":{"region":"cn-east-3","function":{"functionName":"start-fg-event-nodejs14","handler":"index.handler","memorySize":256,"timeout":300,"runtime":"Node.js14.18","package":"default","agencyName":"fgs-vpc-test","environmentVariables":{"test":"test","hello":"world"},"vpcId":"26dfa122-86df-4a10-beae-8b0cd69abe76","subnetId":"5d981adf-4381-48b7-b4f0-aa293b93f19c","concurrency":10,"concurrentNum":10,"codeType":"zip","code":{"codeUri":"./code"}},"trigger":{"triggerTypeCode":"APIG","status":"ACTIVE","eventData":{"name":"APIG_test","groupName":"APIGroup_xxx","auth":"IAM","prtocol":"HTTPS","timeout":5000}}},"credentials":{"Alias":"huawei","AccessKeyID":"UJIDQHOIUYMLG4L62G1A","SecretAccessKey":"OrjFSm80786V5soxDcXr5tyzDexxt41EmTS7IfjD"},"appName":"fgEventNodejs14","project":{"component":"fgs","access":"huawei","projectName":"component-test"},"command":"remove","args":"trigger","argsObj":["trigger"],"path":{"configPath":"D:\\Test\\start-fg-event-nodejs14\\s.yaml"}};

(async () => {
    try {
        const data = await new ComponentDemo().remove(INPUTS);
        console.log(data);
    } catch (error) {
        console.error(error);
    }
})();
