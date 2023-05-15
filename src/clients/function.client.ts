import { BasicCredentials } from "@huaweicloud/huaweicloud-sdk-core";
import { FunctionGraphClient } from "@huaweicloud/huaweicloud-sdk-functiongraph";
import { ICredentials, ServiceType } from "../interface/interface";
import { getEndpoint } from "../utils/util";
import { ApigClient } from "./apig.client";

const ObsClient = require('esdk-obs-nodejs');

export class FunctionClient {

    private apigClient: ApigClient;

    private functionClient: FunctionGraphClient;

    private obsIns: any;

    build(credentials: ICredentials, region = 'cn-north-4', projectId = '') {
        const basicCredentials = new BasicCredentials()
            .withAk(credentials.AccessKeyID)
            .withSk(credentials.SecretAccessKey)
            .withProjectId(projectId);
        this.functionClient = FunctionGraphClient.newBuilder()
            .withCredential(basicCredentials)
            .withEndpoint(getEndpoint(region, ServiceType.FUNCTIONGRAPH))
            .build();
        this.apigClient = ApigClient.newBuilder()
            .withCredential(basicCredentials)
            .withEndpoint(getEndpoint(region, ServiceType.APIG))
            .build();
        this.obsIns = new ObsClient({
            access_key_id: credentials.AccessKeyID, // 配置AK
            secret_access_key: credentials.SecretAccessKey, // 配置SK
            server : `obs.${region}.myhuaweicloud.com`, // 配置服务地址
     });
        return this;
    }

    getApigClient(): ApigClient {
        return this.apigClient;
    }

    getFunctionClient(): FunctionGraphClient {
        return this.functionClient;
    }

    getObsIns() {
        return this.obsIns;
    }
}
