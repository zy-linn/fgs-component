import ComponentDemo from '../../src/index';

const inputs ={"props":{"region":"cn-east-3","function":{"functionName":"start-fg-event-nodejs14","handler":"index.handler","memorySize":256,"timeout":300,"runtime":"Node.js14.18","package":"default","agencyName":"fgs-vpc-test","environmentVariables":{"test":"test","hello":"world"},"vpcId":"26dfa122-86df-4a10-beae-8b0cd69abe76","subnetId":"5d981adf-4381-48b7-b4f0-aa293b93f19c","concurrency":10,"concurrentNum":10,"codeType":"zip","code":{"codeUri":"./code"}},"trigger":{"triggerTypeCode":"TIMER","status":"DISABLED","eventData":{"name":"Timer-xxx","scheduleType":"Rate","schedule":"3m","userEvent":"xxxx"}}},"credentials":{"Alias":"huawei","AccessKeyID":"UJIDQHOIUYMLG4L62G1A","SecretAccessKey":"OrjFSm80786V5soxDcXr5tyzDexxt41EmTS7IfjD"},"appName":"fgEventNodejs14","project":{"component":"fgs","access":"huawei","projectName":"component-test"},"command":"deploy","args":"trigger","argsObj":["trigger"],"path":{"configPath":"D:\\Test\\start-fg-event-nodejs14\\s.yaml"}};

(async () => {
    try {
        const data = await new ComponentDemo().deploy(inputs);
        console.log(data);
    } catch (error) {
        console.error(error);
    }
})();
