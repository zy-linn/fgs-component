import { InputProps } from "../../src/interface/interface";

export const INPUTS: InputProps = {
    "props": {
		"region": "cn-east-3",
		"function": {
			"functionName": "start-fg-event-nodejs14",
			"handler": "index.handler",
			"memorySize": 128,
			"timeout": 30,
			"runtime": "Node.js14.18",
			"codeType": "zip",
			"code": {
				"codeUri": "./code"
			}
		}
	},
	"credentials": {
		"AccessKeyID": "XXXXX",
		"SecretAccessKey": "XXXXXXX"
	},
	"appName": "fgEventNodejs14",
	"project": {
		"component": "fgs",
		"access": "huawei",
		"projectName": "component-test"
	},
	"command": "remove",
	"args": "trigger --region cn-east-3 --function-name start-fg-event-nodejs14 -a huawei --trigger-type APIG --trigger-name API_start_fg_event_nodejs14",
	"argsObj": ["trigger","--region","cn-east-3","--function-name","start-fg-event-nodejs14","-a","huawei","--trigger-type","APIG","--trigger-name","API_start_fg_event_nodejs14"],
	"path": {
		"configPath": "start-fg-event-nodejs14\\s.yaml"
	}
}
