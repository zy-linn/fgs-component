import { FUNCTION_NAME_DESCRIBE, GLOBAL_DESCRIBE, GLOBAL_OPTIONS, REGION_DESCRIBE } from "./constant";

export const INVOKE = [
    {
      header: 'Invoke',
      content: 'Invoke/trigger online functions',
    },
    {
      header: 'Usage',
      content: '$ s invoke <options>',
    },
    {
      header: 'Options',
      optionList: [
        REGION_DESCRIBE, 
        FUNCTION_NAME_DESCRIBE, 
        {
          name: 'event-name',
          description: '[Optional] Event data passed to the function during invocation (default: ""), value: APIG, CTS, DDS, DIS, LTS, OBS, SMN, TIMER',
          alias: 'n',
          type: String,
        },
        {
          name: 'event-file',
          description:
            '[Optional] Event funtion: A file containing event data passed to the function during invoke',
          alias: 'f',
          type: String,
        },
        {
          name: 'event-stdin',
          description: '[Optional] Read from standard input, to support script pipeline',
          alias: 's',
          type: Boolean,
        },
      ],
    },
    { ...GLOBAL_OPTIONS },
    { ...GLOBAL_DESCRIBE },
    {
      header: 'Examples with Yaml',
      content: [
        '$ s invoke',
        '$ s cli fgs invoke --function-name functionName',
      ],
    },
    {
      header: 'Examples with CLI',
      content: [
        '$ s cli fgs invoke --region cn-hangzhou --function-name functionName',
      ],
    },
  ];