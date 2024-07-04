import { FUNCTION_NAME_DESCRIBE, GLOBAL_DESCRIBE, GLOBAL_OPTIONS, REGION_DESCRIBE } from "./constant";

export const QUALIFIER_TYPE = {
    name: 'qualifier-type',
    description: '[Optional] Specify the qualifier type, inclues version and alias, default version',
    type: String,
};

export const QUALIFIER_NAME = {
    name: 'qualifier-name',
    description: '[Optional] Specify the qualifier name, default latest',
    type: String,
};

export const RESERVED = [
    {
        header: 'Reserved',
        content: 'resource reservation operation',
    },
    {
        header: 'Usage',
        content: '$ s reserved <sub-command>',
    },
    {
        header: 'SubCommand List',
        content: [
            { desc: 'get', example: 'Get resource reservation; help command [s reserved get -h]' },
            { desc: 'put', example: 'Put resource reservation; help command [s reserved put -h]' },
        ],
    },
];

export const RESERVED_GET = [
    {
        header: 'Reserved get',
        content: 'Get resource reservation',
    },
    {
        header: 'Usage',
        content: '$ s reserved get <options>',
    },
    {
        header: 'Options',
        optionList: [REGION_DESCRIBE, FUNCTION_NAME_DESCRIBE, QUALIFIER_TYPE, QUALIFIER_NAME],
    },
    { ...GLOBAL_OPTIONS },
    { ...GLOBAL_DESCRIBE },
    {
        header: 'Examples with Yaml',
        content: ['$ s reserved get --region cn-north-4 --function-name fgs-test --qualifier-name v1'],
    },
    {
        header: 'Examples with CLI',
        content: [
            '$ s cli fgs reserved get --region cn-north-4 --function-name fgs-test --qualifier-name v1',
        ],
    },
];

export const RESERVED_PUT = [
    {
        header: 'Reserved put',
        content: 'Set reserved configuration',
    },
    {
        header: 'Usage',
        content: '$ s reserved put <options>',
    },
    {
        header: 'Options',
        optionList: [
            REGION_DESCRIBE,
            FUNCTION_NAME_DESCRIBE,
            QUALIFIER_TYPE,
            QUALIFIER_NAME,
            {
                name: 'idle-mode',
                description: '[Optional] Enable idle mode',
                type: Boolean,
            },
            {
                name: 'config',
                description:
                  '[Optional] Specify the configuration path parameter,Config format refers to [https://support.huaweicloud.com/api-functiongraph/functiongraph_06_0112_1.html#functiongraph_06_0112_1__request_TacticsConfig',
                type: String,
            },
        ],
    },
    { ...GLOBAL_OPTIONS },
    { ...GLOBAL_DESCRIBE },
    {
        header: 'Examples with Yaml',
        content: [
            '$ s reserved put --qualifier-name v1 --count 3',
        ],
    },
    {
        header: 'Examples with CLI',
        content: [
            '$ s cli fgs reserved put --region cn-north-4 --function-name fgs-test --qualifier-name v1 --count 3',
        ],
    },
];