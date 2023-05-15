export const COMPONENT_HELP_INFO = [
    {
        header: "fgs component",
        content:
            "You can use the component to manager and develop your baiducloud function computer resources.",
    },
    {
        header: "Usage",
        content: "$ s <command> <options>",
    },
    {
        header: "Command List",
        content: [
            { name: "help", summary: "Display help information." },
            { name: "deploy", summary: "Deploy serverless application." },
        ],
    },
    {
        header: "Global Options",
        optionList: [
            {
                name: "assumeYes",
                description:
                    "Assume that the answer to any question which would be asked is yes.",
                alias: "y",
                type: Boolean,
            },
        ],
    },
    {
        header: "Examples with Yaml",
        content: [
            "$ fgs {bold deploy} --help",
            "$ fgs {bold remove} --help",
            "$ fgs {bold help}",
        ],
    },
];
