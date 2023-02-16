import { spinner } from "@serverless-devs/core";
import { FunctionClient } from '../clients/function.client';
import { CommandType } from "../interface/interface";
import { FunctionService } from './function.service';
import { TriggerService } from './trigger.service';
export class CommandService {
    private functionService: FunctionService;
    private triggerService: TriggerService;
    private spin: any;
    constructor(public readonly client: FunctionClient, public readonly props: { [prop: string]: any } = {}) {
        this.spin = spinner();
        if (this.props.function) {
            this.functionService = new FunctionService(this.client.getFunctionClient(), this.props, this.spin);
        }
        if (this.props.trigger) {
            const urn = this.functionService.getUrn();
            this.triggerService = new TriggerService(this.client, this.props, urn, this.spin);
        }
    }

    /**
     * 部署
     * @param subCommand 子命令
     * @returns 
     */
    async deploy(subCommand = CommandType.ALL) {
        try {
            this.checkProps();
            const functionInfo = [CommandType.ALL, CommandType.FUNCTION].includes(subCommand) ? await this.functionService.deploy() : { res: [] };
            const triggerInfo = [CommandType.ALL, CommandType.TRIGGER].includes(subCommand) ? await this.triggerService.deploy() : [];
            return functionInfo.res.concat(triggerInfo);
        } catch (err) {
            throw err;
        } finally {
            this.spin.stop();
        }
    }

    /**
     * 删除
     * @param subCommand 子命令
     * @returns 
     */
    async remove(subCommand = CommandType.ALL) {
        try {
            this.checkProps();
            if ([CommandType.ALL, CommandType.FUNCTION].includes(subCommand)) {
                return await this.functionService.remove();
            }
            if (subCommand === CommandType.TRIGGER) {
                return await this.triggerService.remove();
            }
        } catch (err) {
            throw err;
        } finally {
            this.spin.stop();
        }
    }

    /**
     * 校验Props参数
     * @param subCommand 
     */
    private checkProps(subCommand = CommandType.ALL) {
        switch (subCommand) {
            case CommandType.ALL: {
                if (!this.props.function) {
                    throw new Error('Missing function configuration.');
                }
                if (!this.props.trigger) {
                    throw new Error('Missing trigger configuration.');
                }
            }; break;
            case CommandType.FUNCTION: {
                if (!this.props.function) {
                    throw new Error('Missing function configuration.');
                }
            }; break;
            case CommandType.TRIGGER: {
                if (!this.props.trigger) {
                    throw new Error('Missing trigger configuration.');
                }
            }; break;
            default:
                break;
        }
    }
}
