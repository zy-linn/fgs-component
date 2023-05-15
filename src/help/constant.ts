export const GLOBAL_OPTIONS = {
    header: "Global Options",
    optionList: [
        {
            name: "help",
            description: "Help for command",
            alias: "h",
            type: Boolean,
        },
        {
            name: "debug",
            description: "Output debug informations",
            type: Boolean,
        },
        {
            name: 'access',
            description: '[Optional] Specify key alias',
            alias: 'a',
            type: String,
        },
    ]
};

export const GLOBAL_DESCRIBE = {
    header: 'Options Help',
    content: [
        { desc: 'Required: Required parameters in YAML mode and CLI mode' },
        { desc: 'C-Required: Required parameters in CLI mode' },
        { desc: 'Y-Required: Required parameters in Yaml mode' },
        { desc: 'Optional: Non mandatory parameter' },
        { desc: '✋ The difference between Yaml mode and CLI mode: http://ej6.net/yc' },
    ],
};

export const ASSUME_YES_DESCRIBE = {
    name: 'assume-yes',
    description: '[Optional] Assume that the answer to any question which would be asked is yes',
    alias: 'y',
    defaultOption: false,
    type: Boolean,
};

export const REGION_DESCRIBE = {
    name: 'region',
    description: '[C-Required] Specify the fgs region',
    defaultOption: false,
    type: Boolean,
};

export const FUNCTION_NAME_DESCRIBE = {
    name: 'function-name',
    description: '[C-Required] Specify the fgs function name',
    type: String,
};

export const SHOW_TABLE_DESCRIBE = {
    name: 'table',
    description: '[Optional] Table format output',
    type: Boolean,
};