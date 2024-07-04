import { help } from "@serverless-devs/core";
import { VersionService } from "./services/version.service";
import { AliasService } from "./services/alias.service";
import { RemoveService } from "./services/remove.service";
import { InputProps } from "./interface/interface";
import { DeployService } from "./services/deploy.service";
import { Fun2sService } from "./services/fun2s.service";
import { LocalService } from "./services/local.service";
import { InvokeService } from "./services/invoke.service";
import { InfoService } from "./services/info.service";
import { ReservedService } from "./services/reserved.service";

export default class ComponentDemo {
  /**
   * 部署命令
   * @param inputs
   * @returns
   */
  public async deploy(inputs: InputProps) {
    try {
      const service = new DeployService();
      const { props, client, subCommand, isHelp } = await service.handleInputs(
        inputs
      );
      if (isHelp) {
        return;
      }
      const deployInfo = await service.deploy(
        subCommand,
        props,
        client
      );
      help(deployInfo);
    } catch (err) {
      throw err;
    }
  }

  /**
   * 删除命令
   * @param inputs
   * @returns
   */
  public async remove(inputs: InputProps) {
    try {
      const service = new RemoveService();
      const { props, client, subCommand, isHelp } = await service.handleInputs(
        inputs
      );
      if (isHelp) {
        return;
      }
      const deployInfo = await service[subCommand](props, client);
      help(deployInfo);
    } catch (err) {
      throw err;
    }
  }

  /**
   * 版本命令
   * @param inputs
   * @returns
   */
  public async version(inputs: InputProps) {
    try {
      const service = new VersionService();
      const { props, client, subCommand, isHelp } = await service.handleInputs(
        inputs
      );
      if (isHelp) {
        return;
      }
      const deployInfo = await service[subCommand](props, client);
      return deployInfo;
    } catch (err) {
      return;
    }
  }

  /**
   * 别名命令
   * @param inputs
   * @returns
   */
  public async alias(inputs: InputProps) {
    try {
      const service = new AliasService();
      const { props, client, subCommand, isHelp } = await service.handleInputs(
        inputs
      );
      if (isHelp) {
        return;
      }
      const infos = await service[subCommand](props, client);
      return { [props.functionName]: infos };
    } catch (error) {
      return;
    }
  }

  /**
   * 项目迁移
   * @param inputs 
   * @returns 
   */
  public async fun2s(inputs: InputProps): Promise<any> {
    try {
      const service = new Fun2sService();
      const { props, client, isHelp } = await service.handleInputs(inputs);
      if (isHelp) {
        return;
      }
      return await service.transform(props, client);
    } catch (error) {
      return;
    }
  }

  /**
   * 本地调试
   * @param inputs 
   * @returns 
   */
  public async local(inputs: InputProps): Promise<any> {
    try {
      const service = new LocalService();
      const { props, subCommand, isHelp, baseDir } = await service.handleInputs(inputs);
      if (isHelp) {
        return;
      }
      return await service[subCommand](props, baseDir);
    } catch (error) {
      return;
    }
  }

  /**
   * 函数触发
   * @param inputs 
   * @returns 
   */
  public async invoke(inputs: InputProps): Promise<any> {
    try {
      const service = new InvokeService();
      const { props, client, isHelp } = await service.handleInputs(inputs);
      if (isHelp) {
        return;
      }
      return await service.invoke(props, client);
    } catch (error) {
      return;
    }
  }

  /**
   * 函数查看
   * @param inputs 
   * @returns 
   */
  public async info(inputs: InputProps): Promise<any> {
    try {
      const service = new InfoService();
      const { props, client, isHelp } = await service.handleInputs(inputs);
      if (isHelp) {
        return;
      }
      return await service.info(props, client);
    } catch (error) {
      return;
    }
  }

  /**
   * 函数查看
   * @param inputs 
   * @returns 
   */
  public async reserved(inputs: InputProps): Promise<any> {
    try {
      const service = new ReservedService();
      const { props, client, isHelp, subCommand } = await service.handleInputs(inputs);
      if (isHelp) {
        return;
      }
      return await service[subCommand](props, client);
    } catch (error) {
      return;
    }
  }
}
