import { FUNCTION_NAME_DESCRIBE, GLOBAL_DESCRIBE, GLOBAL_OPTIONS, REGION_DESCRIBE, SHOW_TABLE_DESCRIBE } from "./constant";


const ALIAS_NAME_DESCRIBE = {
    name: 'alias-name',
    description: '[Required] Specify the fgs alias name',
    type: String,
};

export const ALIAS = [
    {
        header: 'Alias',
        content: 'Function alias operation',
    },
    {
        header: 'Usage',
        content: '$ s alias <sub-command>',
    },
    {
        header: 'SubCommand List',
        content: [
            { desc: 'get', example: 'Get alias details; help command [s alias get -h]' },
            { desc: 'list', example: 'View the list of alias; help command [s alias list -h]' },
            { desc: 'publish', example: 'Publish alias; help command [s alias publish -h]' },
        ],
    },
];

export const ALIAS_GET = [
    {
        header: 'Alias get',
        content: 'Get alias details',
    },
    {
        header: 'Document',
        content: 'https://serverless.help/t/alias-get',
    },
    {
        header: 'Usage',
        content: '$ s alias get <options>',
    },
    {
        header: 'Options',
        optionList: [REGION_DESCRIBE, FUNCTION_NAME_DESCRIBE, ALIAS_NAME_DESCRIBE],
    },
    { ...GLOBAL_OPTIONS },
    { ...GLOBAL_DESCRIBE },
    {
        header: 'Examples with Yaml',
        content: ['$ s alias get --alias-name aliasName'],
    },
    {
        header: 'Examples with CLI',
        content: [
            '$ s cli fgs alias get --region region --function-name functionName --alias-name aliasName',
        ],
    },
];

export const ALIAS_LIST = [
    {
        header: 'Alias list',
        content: 'View the list of service alias',
    },
    {
        header: 'Usage',
        content: '$ s alias list <options>',
    },
    {
        header: 'Options',
        optionList: [REGION_DESCRIBE, FUNCTION_NAME_DESCRIBE, SHOW_TABLE_DESCRIBE],
    },
    { ...GLOBAL_OPTIONS },
    { ...GLOBAL_DESCRIBE },
    {
        header: 'Examples with Yaml',
        content: ['$ s alias list'],
    },
    {
        header: 'Examples with CLI',
        content: ['$ s cli fgs alias list --region region --function-name functionName --alias-name aliasName'],
    },
];

export const ALIAS_PUBLISH = [
    {
        header: 'Alias publish',
        content: 'Publish service alias',
    },
    {
        header: 'Usage',
        content: '$ s alias publish <options>',
    },
    {
        header: 'Options',
        optionList: [
            REGION_DESCRIBE,
            FUNCTION_NAME_DESCRIBE,
            ALIAS_NAME_DESCRIBE,
            {
                name: 'version',
                description: '[Required] The version corresponding to alias',
                type: String,
            },
            {
                name: 'description',
                description: '[Optional] Specify the alias description',
                type: String,
            },
            {
                name: 'gversion',
                description: '[Optional] The grayscale version',
                type: String,
            },
            {
                name: 'weight',
                description: '[Optional] The weight for grayscale version',
                type: String,
            },
            {
                name: 'resolve-policy',
                description: '[Optional] Gray scale, value: Percentage/Rule. Percentage is a percentage grayscale, the default value; Rule is regular grayscale',
                type: String,
              },
              {
                name: 'rule-policy',
                description: '[Optional] Rule grayscale rules',
                type: String,
              },
        ],
    },
    { ...GLOBAL_OPTIONS },
    { ...GLOBAL_DESCRIBE },
    {
        header: 'Examples with Yaml',
        content: [
            '$ s alias publish --alias-name aliasName --version a2',
            '$ s alias publish --description description --alias-name aliasName --version a2 --gversion a3 --weight 20',
        ],
    },
    {
        header: 'Examples with CLI',
        content: [
            '$ s cli fgs alias publish --region region --function-name functionName --alias-name aliasName --version a2',
        ],
    },
];