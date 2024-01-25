import {
  FuncCode,
  CreateFunctionRequest,
  CreateFunctionRequestBody,
  CreateFunctionRequestBodyCodeTypeEnum,
  CreateFunctionRequestBodyRuntimeEnum,
  CreateFunctionRequestBodyTypeEnum,
  DeleteFunctionRequest,
  FunctionGraphClient,
  ShowFunctionConfigRequest,
  UpdateFunctionCodeRequest,
  UpdateFunctionCodeRequestBody,
  UpdateFunctionCodeRequestBodyCodeTypeEnum,
  FuncVpc,
  UpdateFunctionConfigRequest,
  UpdateFunctionConfigRequestBody,
  StrategyConfig,
  UpdateFunctionConfigRequestBodyRuntimeEnum,
  KvItem,
  DeleteTagsRequest,
  UpdateFunctionTagsRequestBody,
  ListFunctionTagsRequest,
  CreateTagsRequest,
  FuncLogConfig,
  NetworkControlConfig,
} from "@huaweicloud/huaweicloud-sdk-functiongraph";
import { spinner } from "@serverless-devs/core";
import logger from "../common/logger";
import { IProperties, IRemoveProps } from "../interface/interface";
import { handlerResponse, startZip } from "../utils/util";
import {
  AdvancedConfig,
  BasicConfig,
  ConcurrencyConfig,
  IFunctionProps,
  IFunctionResult,
  LogConfig,
  NetConfig,
  PermissionConfig,
} from "../interface/function.interface";

type RequestBody = UpdateFunctionConfigRequestBody | CreateFunctionRequestBody;

export class FunctionService {
  private metaData: any;
  private spin = spinner();

  constructor() {}

  /**
   * 部署函数
   * 1. 判断当前函数是否存在
   * 2. 函数存在，执行更新
   * 3. 不存在，执行创建
   */
  async deploy(props: IProperties, client: FunctionGraphClient) {
    try {
      if (!props.function) {
        throw new Error("First configure the function in s.yml.");
      }
      if (
        (!props.function.agencyName || !props.function.xrole) &&
        (props.function.vpcId || props.function.subnetId)
      ) {
        throw new Error("First configure the function agency in s.yml.");
      }
      if (props.function.codeType === "obs" && !props.function.codeUrl) {
        throw new Error(
          "First configure the OBS link URL for the function code package in s.yml."
        );
      }
      const isExist = await this.config(client, props.urn);
      const response = isExist
        ? await this.update(props, client, this.metaData)
        : await this.create(props, client);
      return this.handleResponse(response.func_urn ? response : this.metaData);
    } catch (err) {
      throw err;
    }
  }

  /**
   * 删除函数
   * @returns
   */
  async remove(
    { functionName, urn }: IRemoveProps,
    client: FunctionGraphClient
  ) {
    this.spin.info(`Deleting function [${functionName}].`);
    logger.debug(`Deleting function [${functionName}].`);
    try {
      const request = new DeleteFunctionRequest().withFunctionUrn(urn);
      const result: any = await client.deleteFunction(request);
      handlerResponse(result);
      this.spin.succeed(`Function [${functionName}] deleted.`);
      logger.debug(`Function [${functionName}] deleted.`);
    } catch (error) {
      this.spin.fail(`Delete function [${functionName}] failed.`);
      logger.error(
        `Delete function [${functionName}] failed. err=${
          (error as Error).message
        }`
      );
      throw error;
    }
  }

  /**
   * 创建函数
   * @returns
   */
  private async create(props: IProperties, client: FunctionGraphClient) {
    const functionInfo = props.function;
    const body = new CreateFunctionRequestBody()
      .withFuncName(functionInfo.functionName)
      .withPackage(functionInfo.package || "default")
      .withRuntime(
        (functionInfo.runtime as CreateFunctionRequestBodyRuntimeEnum) ||
          "Node.js14.18"
      )
      .withCodeType(
        (functionInfo.codeType ||
          "zip") as CreateFunctionRequestBodyCodeTypeEnum
      )
      .withType(CreateFunctionRequestBodyTypeEnum.V2);

    this.setBasicConfig(body, functionInfo);
    this.setPermissionConfig(body, functionInfo);
    this.setNetConfig(body, functionInfo);
    this.setEnvConfig(body, functionInfo);
    this.setLogConfig(body, functionInfo);
    this.setAdvancedConfig(body, functionInfo);
    functionInfo.dependVersionList &&
      body.withDependVersionList(functionInfo.dependVersionList);

    if (functionInfo.codeType === "obs") {
      body.withCodeUrl(functionInfo.codeUrl);
    } else {
      const zipFile = await startZip(functionInfo.code.codeUri);
      this.spin.succeed("File compression completed");
      body.withFuncCode(new FuncCode().withFile(zipFile));
    }
    this.spin.info(`Creating function [${functionInfo.functionName}].`);
    logger.debug(`Creating function [${functionInfo.functionName}].`);
    logger.debug("------------create body-------------");
    logger.debug(body);
    try {
      const result: any = await client.createFunction(
        new CreateFunctionRequest().withBody(body)
      );
      handlerResponse(result);
      // 存在仅支持更新的属性时
      if (
        functionInfo.domainNames ||
        functionInfo.encryptedUserData ||
        functionInfo.enableDynamicMemory
      ) {
        this.updateConfig(props, client, result);
      } else {
        // updateConfig也包含标签操作，放入else分支避免重复操作
        this.createTags(props, client);
      }
      this.spin.succeed(`Function [${functionInfo.functionName}] created.`);
      logger.debug(`Function [${functionInfo.functionName}] created.`);
      return result;
    } catch (error) {
      this.spin.fail(`Create function [${functionInfo.functionName}] failed.`);
      logger.error(
        `Create function [${functionInfo.functionName}] failed. err=${
          (error as Error).message
        }`
      );
      throw error;
    }
  }

  /**
   * 更新函数
   * @returns
   */
  private async update(
    props: IProperties,
    client: FunctionGraphClient,
    config: IFunctionResult
  ) {
    if (!props.type || props.type === "code") {
      await this.updateCode(props, client, config);
    }
    if (!props.type || props.type === "config") {
      await this.updateConfig(props, client, config);
    }
    return config;
  }

  /**
   * 更新函数代码
   * @returns
   */
  private async updateCode(
    props: IProperties,
    client: FunctionGraphClient,
    config: IFunctionResult
  ) {
    this.spin.info(
      `Updating the code of function [${props.function.functionName}].`
    );
    logger.debug(
      `Updating the code of function [${props.function.functionName}].`
    );
    try {
      const body = new UpdateFunctionCodeRequestBody()
        .withCodeType(
          (props.function
            .codeType as UpdateFunctionCodeRequestBodyCodeTypeEnum) ??
            config.code_type
        )
        .withDependVersionList(
          props.function.dependVersionList ?? config.depend_version_list
        );
      if (props.function.codeType === "obs") {
        body.withCodeUrl(props.function.codeUrl);
      } else {
        const zipFile = await startZip(props.function.code.codeUri);
        this.spin.succeed("File compression completed");
        body.withFuncCode(new FuncCode().withFile(zipFile));
      }

      const result: any = await client.updateFunctionCode(
        new UpdateFunctionCodeRequest()
          .withBody(body)
          .withFunctionUrn(config.func_urn)
      );
      handlerResponse(result);
      this.spin.succeed(
        `Code of function [${props.function.functionName}] updated.`
      );
      logger.debug(
        `Code of function [${props.function.functionName}] updated.`
      );
    } catch (error) {
      this.spin.fail(
        `Update code of function [${props.function.functionName}] failed.`
      );
      logger.error(
        `Update code of function [${props.function.functionName}] failed. err=${
          (error as Error).message
        }`
      );
      throw error;
    }
  }

  /**
   * 更新函数配置
   * @param props
   * @param client
   * @param config
   */
  private async updateConfig(
    props: IProperties,
    client: FunctionGraphClient,
    config: IFunctionResult
  ) {
    this.spin.info(
      `Updating configurations of function [${props.function.functionName}].`
    );
    logger.debug(
      `Updating configurations of function [${props.function.functionName}].`
    );
    this.createTags(props, client);
    try {
      const body = this.getConfigRequestBody(props.function, config);
      logger.debug("------------update body-----------");
      logger.debug(body);
      const request = new UpdateFunctionConfigRequest()
        .withFunctionUrn(props.urn)
        .withBody(body);
      const result: any = client.updateFunctionConfig(request);
      handlerResponse(result);
      this.spin.succeed(
        `Configurations of function [${props.function.functionName}] updated.`
      );
      logger.debug(
        `Configurations of function [${props.function.functionName}] updated.`
      );
    } catch (error) {
      this.spin.fail(
        `Update configurations of function [${props.function.functionName}] failed.`
      );
      logger.error(
        `Update configurations of function [${
          props.function.functionName
        }] failed. err=${(error as Error).message}`
      );
      throw error;
    }
  }

  /**
   * 校验函数是否存在
   * @param props
   * @returns
   */
  private async config(
    client: FunctionGraphClient,
    urn = ""
  ): Promise<boolean> {
    try {
      const request = new ShowFunctionConfigRequest().withFunctionUrn(urn);
      this.metaData = await client.showFunctionConfig(request);
      return (
        this.metaData.httpStatusCode >= 200 &&
        this.metaData.httpStatusCode < 300
      );
    } catch (err) {
      return false;
    }
  }

  /**
   *  处理函数信息输出
   * @param response
   * @returns
   */
  private handleResponse(response: any) {
    const content = [
      { desc: "Function Name", example: `${response.func_name}` },
      { desc: "Function URN", example: `${response.func_urn}` },
      { desc: "Project name", example: `${response.project_name}` },
      { desc: "Runtime", example: `${response.runtime}` },
      { desc: "Handler", example: `${response.handler}` },
      { desc: "Code size", example: `${response.code_size}` },
      { desc: "Timeout", example: `${response.timeout}` },
      {
        desc: "Description",
        example: `${response.description || "No description"}`,
      },
      {
        desc: "More",
        example:
          "https://console.huaweicloud.com/functiongraph/#/serverless/dashboard",
      },
    ];

    logger.debug(`Function handle response${JSON.stringify(content)}`);
    return {
      res: [
        {
          header: "Function",
          content,
        },
      ],
      functionUrn: response.func_urn,
    };
  }

  /**
   * 获取配置更新参数
   * @param functionInfo
   * @param config
   * @returns
   */
  private getConfigRequestBody(
    functionInfo: IFunctionProps,
    config: IFunctionResult
  ) {
    const body = new UpdateFunctionConfigRequestBody();
    body
      .withFuncName(config.func_name)
      .withRuntime(
        config.runtime as UpdateFunctionConfigRequestBodyRuntimeEnum
      );
    this.setBasicConfig(body, functionInfo, config);
    this.setPermissionConfig(body, functionInfo, config);
    this.setNetConfig(body, functionInfo, config);
    this.setEnvConfig(body, functionInfo, config);
    this.setConcurrenyConfig(body, functionInfo, config);
    this.setLogConfig(body, functionInfo, config);
    this.setAdvancedConfig(body, functionInfo, config);
    return body;
  }

  /**
   * 基本配置
   * @param body
   * @param newData
   * @param oldData
   */
  private setBasicConfig(
    body: RequestBody,
    newData: BasicConfig,
    oldData?: IFunctionResult
  ) {
    // 企业项目用户必传
    body.withEnterpriseProjectId(
      newData?.enterpriseProjectId ?? oldData?.enterprise_project_id ?? "0"
    );
    body.withMemorySize(newData?.memorySize ?? oldData.memory_size ?? 128);
    body.withTimeout(newData?.timeout ?? oldData.timeout ?? 30);
    body.withHandler(newData?.handler ?? oldData?.handler ?? "index.handler");
    body.withDescription(newData?.description ?? oldData?.description);
  }

  /**
   * 权限（委托）配置
   * @param body
   * @param newData
   * @param oldData
   */
  private setPermissionConfig(
    body: RequestBody,
    newData: PermissionConfig,
    oldData?: IFunctionResult
  ) {
    body.withXrole(newData?.xrole ?? newData?.agencyName ?? oldData?.xrole);
    body.withAppXrole(newData?.appXrole ?? oldData?.app_xrole);
  }

  /**
   * 网络配置
   * @param body
   * @param newData
   * @param oldData
   */
  private setNetConfig(
    body: RequestBody,
    newData: NetConfig,
    oldData?: IFunctionResult
  ) {
    const vpcId =
      newData?.funcVpc?.vpcId ?? newData?.vpcId ?? oldData?.func_vpc?.vpc_id;
    const subnetId =
      newData?.funcVpc?.subnetId ??
      newData?.subnetId ??
      oldData?.func_vpc?.subnet_id;
    if (vpcId && subnetId) {
      const funcVpc = new FuncVpc();
      funcVpc.withVpcId(vpcId);
      funcVpc.withSubnetId(subnetId);
      funcVpc.withCidr(newData?.funcVpc?.cidr ?? oldData?.func_vpc?.cidr);
      funcVpc.withGateway(
        newData?.funcVpc?.gateway ?? oldData?.func_vpc.gateway
      );
      body.withFuncVpc(funcVpc);
    }
    const networkController = new NetworkControlConfig();
    networkController.withDisablePublicNetwork(
      Boolean(
        newData?.networkController?.disablePublicNetwork ??
          oldData?.network_controller?.disable_public_network
      )
    );
    const vpcs = newData?.networkController?.triggerAccessVpcs?.map((v) => ({
      vpc_id: v.vpcId ?? v.vpc_id,
      vpc_name: v.vpcName ?? v.vpc_name,
    }));
    networkController.withTriggerAccessVpcs(
      vpcs ?? oldData?.network_controller.trigger_access_vpcs
    );
    body.withNetworkController(networkController);
    if (this.isUpdate(body, oldData)) {
      const domainNames = newData?.domainNames?.map((v) => ({
        id: v.id,
        domain_name: v.name ?? v.domainName ?? v.domain_name,
      }));
      body.withDomainNames(
        domainNames ? JSON.stringify(domainNames) : oldData?.domain_names
      );
    }
  }

  /**
   * 环境变量，仅更新时支持传加密环境变量
   * @param body
   * @param newData
   * @param oldData
   * @returns
   */
  private setEnvConfig(body: RequestBody, newData: any, oldData?: any) {
    try {
      body.withUserData(
        JSON.stringify(newData?.userData ?? newData?.environmentVariables) ??
          oldData.user_data ??
          "{}"
      );
      if (!this.isUpdate(body, oldData)) {
        return;
      }
      if (newData?.encryptedUserData) {
        body.withEncryptedUserData(JSON.stringify(newData.encryptedUserData));
      }
    } catch (error) {
      logger.debug(error);
    }
  }

  /**
   * 并发配置，仅支持更新
   * @param body
   * @param newData
   * @param oldData
   */
  private setConcurrenyConfig(
    body: UpdateFunctionConfigRequestBody,
    newData: ConcurrencyConfig,
    oldData?: IFunctionResult
  ) {
    const strategyConf = new StrategyConfig();
    strategyConf.withConcurrency(
      newData.concurreny ?? oldData.strategy_config.concurrency
    );
    strategyConf.withConcurrentNum(
      newData.concurrenyNum ?? oldData.strategy_config.concurrent_num
    );
    body.withStrategyConfig(strategyConf);
  }

  /**
   * 日志配置，当前必传日志组id 日志流id 日志流名称
   * @param body
   * @param newData
   * @param oldData
   * @returns
   */
  private setLogConfig(
    body: RequestBody,
    newData: LogConfig,
    oldData?: IFunctionResult
  ) {
    if (
      !(newData?.ltsGroupId ?? oldData?.log_group_id) ||
      !(newData?.ltsStreamId ?? oldData?.log_stream_id) ||
      !newData?.ltsStreamName
    ) {
      return;
    }
    const conf = new FuncLogConfig();
    conf.withGroupId(newData?.ltsGroupId ?? oldData?.log_group_id);
    conf.withGroupName(newData?.ltsGroupName);
    conf.withStreamId(newData?.ltsStreamId ?? oldData?.log_stream_id);
    conf.withStreamName(newData?.ltsStreamName);
    body.withLogConfig(conf);
  }

  /**
   * 高级配置
   * @param body
   * @param newData
   * @param oldData
   */
  private setAdvancedConfig(
    body: RequestBody,
    newData: AdvancedConfig,
    oldData?: IFunctionResult
  ) {
    body.withInitializerHandler(
      newData?.initializerHandler ?? oldData?.initializer_handler
    );
    body.withInitializerTimeout(
      newData?.initializerTimeout ?? oldData?.initializer_timeout
    );
    if (this.isUpdate(body, oldData)) {
      body.withEnableDynamicMemory(
        newData?.enableDynamicMemory === undefined
          ? oldData?.enable_dynamic_memory
          : Boolean(newData?.enableDynamicMemory)
      );
    }
  }

  private async createTags(props: IProperties, client: FunctionGraphClient) {
    const tag = props.service.name
    if(!tag) {
        return
    }
    const { tags } = await this.getTags(props.urn, client);
    if (tags.some((v) => v.key === tag)) {
      return;
    }
    try {
      await this.deleteTags(props.urn, tags, client);
      const req = new CreateTagsRequest();
      req.withResourceType("functions");
      req.withResourceId(props.urn);
      const body = new UpdateFunctionTagsRequestBody();
      body.withAction("create");
      const kvItem = new KvItem().withKey(tag).withValue(tag);
      body.withTags([kvItem]);
      req.withBody(body);
      client.createTags(req);
    } catch (error) {
      logger.debug(error);
    }
  }

  private async getTags(urn: string, client: FunctionGraphClient) {
    const req = new ListFunctionTagsRequest();
    req.withResourceType("functions");
    req.withResourceId(urn);
    return client.listFunctionTags(req);
  }

  private async deleteTags(
    urn: string,
    tags: KvItem[],
    client: FunctionGraphClient
  ) {
    const req = new DeleteTagsRequest();
    req.withResourceType("functions");
    req.withResourceId(urn);
    const body = new UpdateFunctionTagsRequestBody();
    body.withAction("delete");
    body.withTags(tags);
    req.withBody(body);
    client.deleteTags(req);
  }

  private isUpdate(
    body: RequestBody,
    config: unknown | undefined
  ): body is UpdateFunctionConfigRequestBody {
    return config !== undefined;
  }
}
