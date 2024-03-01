import { GLOBAL_DESCRIBE, GLOBAL_OPTIONS } from "./constant";

export const LOCAL = [
    {
        header: 'Local',
        content: 'Run your serverless application locally for quick development & testing',
    },
    {
        header: 'Usage',
        content: '$ s local <sub-command> <options>',
    },
    {
        header: 'SubCommand List',
        content: [
            {
                name: 'invoke',
                summary: 'Local start function; help command [s local invoke -h]',
            },
        ],
    },
];

export const LOCAL_INVOKE = [
    {
        header: 'Local Invoke',
        content: 'Local invoke fc event function',
    },
    {
        header: 'Usage',
        content: '$ s local invoke <options>',
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'event-name',
                description: '[Optional] Event data passed to the function during invocation (default: ""), value: APIG, CTS, DDS, DIS, LTS, OBS, SMN, TIMER',
                alias: 'n',
                type: String,
            },
            {
                name: 'event-file',
                description: '[Optional] A file containing event data passed to the function during invoke',
                alias: 'f',
                type: String,
            },
            {
                name: 'event-stdin',
                description: '[Optional] Read from standard input, to support script pipeline',
                alias: 's',
                type: Boolean,
            },
            {
                name: 'mode',
                typeLabel: '{underline [api/server/normal]}',
                description: `[Optional] Invoke mode, including api, server and normal:
            - api: start api server for invokeFunction api invoking
            - normal: default mode, invoke event function and then close the container`,
                alias: 'm',
                type: String,
            },
            {
                name: 'config',
                typeLabel: '{underline [vscode]}',
                description:
                    '[Optional] Select which IDE to use when debugging and output related debug config tips for the IDE. value: vscode',
                alias: 'c',
                type: String,
            },
            {
                name: 'debug-port',
                description:
                    '[Optional] Specify the local function container starting in debug mode, and exposing this port on localhost',
                alias: 'd',
                type: Number,
            },
            {
                name: 'server-port',
                description:
                    '[Optional] The exposed port of http server',
                type: Number,
            },
        ],
    },
    { ...GLOBAL_OPTIONS },
    { ...GLOBAL_DESCRIBE },
    {
        header: 'Examples with Yaml',
        content: ['$ s local invoke --event-name "APIG"'],
    },
];