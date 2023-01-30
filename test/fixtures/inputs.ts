import { InputProps } from "../../src/common/entity";

export const INPUTS: InputProps = {
    props: {
        projectId: "09f7170b2c800f5a2fe2c00706fd11dc",
        region: "cn-east-3",
        function: {
            functionName: "zyltest-devs",
            handler: "index.handler",
            memorySize: 128,
            timeout: 30,
            runtime: "Node.js8.10",
            package: "default",
            codeType: "zip",
            code: {
                codeUri: "D:/TEST/serverless/new/zyl-fgs-http-nodejs/code",
            },
        },
        trigger: {
            triggerTypeCode: "APIG",
            eventTypeCode: "APICreated",
            status: "ACTIVE",
            eventData: {
                group_id: "51ed66ba137d43afc8281114ff4a",
                env_name: "RELEASE",
                env_id: "DEFAULT_ENVIRONMENT_RELEASE_ID",
                auth: "NONE",
                protocol: "HTTPS",
                name: "test",
                path: "/zyltest-devs",
                match_mode: "SWA",
                req_method: "GET",
                backend_type: "FUNCTION",
                type: 1,
                sl_domain: "51ed66ba137d43afc8281114ff4a.apig.cn-north-4.huaweicloudapis.com",
            },
        },
    },
    credentials: {
        AccessKeyID: "",
        SecretAccessKey: "",
    },
    appName: "startFgHttpNodejs8",
    project: {
        component: "fg",
        access: "hw",
        projectName: "component-test"
    },
    command: "remove",
    args: "-y --use-local",
    argsObj: [
        "-y",
        "--use-local",
    ],
    path: {
        configPath: "start-fg-http-nodejs/s.yaml",
    }
}
