import { FUNCTION_NAME_DESCRIBE, REGION_DESCRIBE } from "./constant";

export const INFO = [
    {
      header: 'Info',
      content: 'Query online resource details',
    },
    {
      header: 'Usage',
      content: '$ s info <options> ',
    },
    {
      header: 'Options',
      optionList: [
        REGION_DESCRIBE, 
        FUNCTION_NAME_DESCRIBE,
      ],
    },
    {
      header: 'Examples with Yaml',
      content: ['$ s info'],
    },
    {
      header: 'Examples with CLI',
      content: [
        '$ s cli fgs info --region region --function-name functionName',
      ],
    },
  ];