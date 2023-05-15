import { FUNCTION_NAME_DESCRIBE, GLOBAL_DESCRIBE, GLOBAL_OPTIONS, REGION_DESCRIBE } from "./constant";

export const REMOVE = [
    {
        header: "Remove",
        content:
            "The ability to remove resources\nIf executing s remove is equivalent to s remove all",
    },
    {
        header: "Usage",
        content: ['$ s remove <options>', '$ s remove <sub-command> <options>'],
    },
    {
        header: "SubCommand List",
        content: [
            {
                desc: 'function',
                example: 'Remove function resources, inclues trigger、version and alias; help command [s remove function -h]',
            },
            {
                desc: 'trigger',
                example: 'Only remove trigger resources; help command [s remove trigger -h]',
            },
            {
                desc: 'version',
                example: 'Only remove version resources; help command [s remove version -h]',
            },
            {
                desc: 'alias',
                example: 'Only remove alias resources; help command [s remove alias -h]',
            },
        ],
    },
    { ...GLOBAL_OPTIONS },
    { ...GLOBAL_DESCRIBE },
    {
        header: 'Examples with Yaml',
        content: ['$ s remove'],
    },
];


export const REMOVE_FUNCTION = [
    {
        header: "Remove function",
        content: "Remove function resources, inclues trigger、version and alias.",
    },
    {
        header: "Usage",
        content: "$ s remove function <options>",
    },
    {
        header: "Options",
        optionList: [REGION_DESCRIBE, FUNCTION_NAME_DESCRIBE],
    },
    {
        header: "Global Options",
        optionList: GLOBAL_OPTIONS,
    },
    { ...GLOBAL_OPTIONS },
    { ...GLOBAL_DESCRIBE },
    {
        header: "Examples with Yaml",
        content: "$ s remove function",
    },
    {
        header: 'Examples with CLI',
        content: '$ s cli fgs remove function --region cn-north-4 --function-name functionName',
    },
];

export const REMOVE_TRIGGER = [
    {
        header: "Remove trigger",
        content: "Only remove trigger resources",
    },
    {
        header: "Usage",
        content: "$ s remove trigger <options>",
    },
    {
        header: "Options",
        optionList: [
            REGION_DESCRIBE,
            FUNCTION_NAME_DESCRIBE,
            {
                name: 'version-name',
                description: '[Optional] Specify the version name.',
                type: String,
            },
            {
                name: 'trigger-type',
                description: '[C-Required] Specify the trigger type.',
                type: String,
            },
            {
                name: 'trigger-name',
                description: '[C-Required] Specify the trigger name.',
                type: String,
            },
        ],
    },
    { ...GLOBAL_OPTIONS },
    { ...GLOBAL_DESCRIBE },
    {
        header: "Examples with Yaml",
        content: "$ s remove trigger",
    },
    {
        header: 'Examples with CLI',
        content: '$ s cli fgs remove trigger --region cn-north-4 --function-name functionName',
    },
];

export const REMOVE_VERSION = [
    {
        header: "Remove version",
        content: "Only remove version resources",
    },
    {
        header: "Usage",
        content: "$ s remove version <options>",
    },
    {
        header: "Options",
        optionList: [
            REGION_DESCRIBE,
            FUNCTION_NAME_DESCRIBE,
            {
                name: 'version-name',
                description: '[Required] Specify the version name, Cannot be latest',
                type: String,
            },
        ],
    },
    { ...GLOBAL_OPTIONS },
    { ...GLOBAL_DESCRIBE },
    {
        header: "Examples with Yaml",
        content: "$ s remove version --version-name xxx",
    },
    {
        header: 'Examples with CLI',
        content: '$ s cli fgs remove version --region cn-north-4 --function-name functionName --version-name aliasName',
    },
];

export const REMOVE_ALIAS = [
    {
        header: "Remove alias",
        content: "Only remove alias resources",
    },
    {
        header: "Usage",
        content: "$ s remove alias <options>",
    },
    {
        header: "Options",
        optionList: [
            REGION_DESCRIBE,
            FUNCTION_NAME_DESCRIBE,
            {
                name: 'alias-name',
                description: '[Required] Specify the alias name',
                type: String,
            },
        ],
    },
    { ...GLOBAL_OPTIONS },
    { ...GLOBAL_DESCRIBE },
    {
        header: "Examples with Yaml",
        content: "$ s remove alias --alias-name xxx",
    },
    {
        header: 'Examples with CLI',
        content: '$ s cli fgs remove alias --region cn-north-4 --function-name functionName --alias-name aliasName',
    },
];
