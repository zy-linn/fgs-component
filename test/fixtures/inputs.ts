import { InputProps } from "../../src/interface/interface";

export const INPUTS: InputProps = {
    "props": {
        "region": "af-south-1",
        "function": {
            "functionName": "start-fg-http-nodejs14",
            "handler": "index.handler",
            "memorySize": 128,
            "timeout": 30,
            "runtime": "Node.js14.18",
            "package": "default",
            "codeType": "zip",
            "codeUrl": "./code",
            "code": {
                "codeUri": "./code"
            }
        },
        "trigger": {
            "triggerTypeCode": "APIG",
            "eventTypeCode": "APICreated",
            "status": "ACTIVE",
            "eventData": {
                "name": "start-fg-http-nodejs14",
                "groupName": "APIGroup_test",
                "auth": "IAM",
                "prtocol": "HTTPS",
                "timeout": 5000
            }
        }
    },
    "credentials": {
        "Alias": "hw",
        "AccessKeyID": "FZV******************",
        "SecretAccessKey": "LTg******************************wJqrCOw"
    },
    "appName": "fgHttpNodejs14",
    "project": {
        "component": "fgs",
        "access": "hw",
        "projectName": "component-test"
    },
    "command": "local",
    "args": "",
    "argsObj": [],
    "path": {
        "configPath": "D:\\Test\\ServerlessDevs\\localtest\\start-fg-http-nodejs14\\s.yaml"
    }
}
