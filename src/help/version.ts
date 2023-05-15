import { FUNCTION_NAME_DESCRIBE, GLOBAL_DESCRIBE, GLOBAL_OPTIONS, REGION_DESCRIBE, SHOW_TABLE_DESCRIBE } from "./constant";

export const VERSION = [
    {
        header: 'Version',
        content: 'Function version operation',
    },
    {
        header: 'Usage',
        content: '$ s version <sub-command>',
    },
    {
        header: 'SubCommand List',
        content: [
            {
                desc: 'list',
                example: 'View the list of function versions; help command [s version list -h]',
            },
            {
                desc: 'publish',
                example: 'Publish function version; help command [s version publish -h]'
            },
        ],
    },
];


export const VERSION_LIST = [
    {
        header: 'Version list',
        content: 'View the list of function versions',
    },
    {
        header: 'Usage',
        content: '$ s version list <options>',
    },
    {
        header: 'Options',
        optionList: [REGION_DESCRIBE, FUNCTION_NAME_DESCRIBE, SHOW_TABLE_DESCRIBE],
    },
    {
        header: "Global Options",
        optionList: GLOBAL_OPTIONS,
    },
    { ...GLOBAL_OPTIONS },
    { ...GLOBAL_DESCRIBE },
    {
        header: 'Examples with Yaml',
        content: ['$ s version list'],
    },
    {
        header: 'Examples with CLI',
        content: ['$ s cli fgs version list --region cn-north-4 --function-name functionName'],
    },
];

export const VERSION_PUBLISH = [
    {
        header: 'Version publish',
        content: 'Publish function version',
    },
    {
        header: 'Usage',
        content: '$ s version publish <options>',
    },
    {
        header: 'Options',
        optionList: [
            REGION_DESCRIBE,
            FUNCTION_NAME_DESCRIBE,
            {
                name: 'version',
                description: '[Optional] Specify the version name description',
                type: String,
            },
            {
                name: 'description',
                description: '[Optional] Specify the version description',
                type: String,
            },
        ],
    },
    { ...GLOBAL_OPTIONS },
    { ...GLOBAL_DESCRIBE },
    {
        header: 'Examples with Yaml',
        content: ['$ s version publish --description xxx'],
    },
    {
        header: 'Examples with CLI',
        content: [
            '$ s cli fgs version publish --region cn-north-4 --function-name functionName --version 1 --description xxx',
        ],
    },
];