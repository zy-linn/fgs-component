export const DEPLOY = [
    {
        header: "Deploy",
        content:
            "The ability to deploy resources\nIf executing s deploy is equivalent to s deploy all",
    },
    {
        header: "Usage",
        content: ['$ s deploy <options>', '$ s deploy <sub-command> <options>'],
    },
    {
        header: "SubCommand List",
        content: [
            {
                desc: "function",
                example:
                    "Only deploy function resources, you can get help through [s deploy function -h]",
            },
            {
                desc: "trigger",
                example:
                    "Only deploy trigger resources, you can get help through [s deploy trigger -h]",
            },
        ],
    },
];

const GLOBAL_OPTIONS = [
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
];

export const DEPLOY_ALL = DEPLOY;


export const DEPLOY_FUNCTION = [
    {
        header: "Deploy function",
        content: "Only deploy function resources",
    },
    {
        header: "Usage",
        content: "$ s deploy function <options>",
    },
    {
        header: "Options",
        optionList: [
            {
                name: "type",
                description: "Only deploy configuration or code Value: code, config",
                type: Boolean,
            },
        ],
    },
    {
        header: "Global Options",
        optionList: GLOBAL_OPTIONS,
    },
    {
        header: "Examples with Yaml",
        content: ["$ s deploy function"],
    },
];

export const DEPLOY_TRIGGER = [
    {
        header: "Deploy trigger",
        content: "Only deploy trigger resources",
    },
    {
        header: "Usage",
        content: "$ s deploy trigger",
    },
    {
        header: "Global Options",
        optionList: GLOBAL_OPTIONS,
    },
    {
        header: "Examples with Yaml",
        content: ["$ s deploy trigger"],
    },
];
