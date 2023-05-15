import { FUNCTION_NAME_DESCRIBE, GLOBAL_DESCRIBE, GLOBAL_OPTIONS, REGION_DESCRIBE } from "./constant";

export const FUN_TO_S = [
  {
    header: 'Fun2s',
    content:
      'Convert the Configuration of Function to the Yaml specification of Serverless Devs',
  },
  {
    header: 'Usage',
    content: '$ s cli fc fun2s <options>',
  },
  {
    header: 'Options',
    optionList: [
      REGION_DESCRIBE,
      FUNCTION_NAME_DESCRIBE,
      {
        name: 'target',
        description: '[Optional] Specify Serverless Devs configuration path, default: s.yaml',
        type: String,
      },
    ],
  },
  GLOBAL_OPTIONS,
  GLOBAL_DESCRIBE,
  {
    header: 'Examples with CLI',
    content: ['$ s cli fgs fun2s --region cn-north-4 --function-name fgs-deploy-test --target ./s.yml '],
  },
];
