import { InputProps } from './common/entity';
import { CammandBase } from './common/base';
import { CommandService } from './services/command.service';
import { help } from "@serverless-devs/core";
import { MethodType } from './interface/interface';

export default class ComponentDemo extends CammandBase {

    /**
     * demo 实例
     * @param inputs
     * @returns
     */
    public async deploy(inputs: InputProps) {
        try {
            const { props, client, subCommand, isHelp } = await this.handleInputs(inputs);
            if (isHelp) {
                return;
            }
            const deployInfo = await new CommandService(client, props).deploy(subCommand);
            help(deployInfo);
        } catch (err) {
            throw err;
        }
    }
    /**
     * demo 实例
     * @param inputs
     * @returns
     */
    public async remove(inputs: InputProps) {
        try {
            const { props, client, subCommand, isHelp } = await this.handleInputs(inputs, MethodType.REMOVE);
            if (isHelp) {
                return;
            }
            const deployInfo = await await new CommandService(client, props).remove(subCommand);
            help(deployInfo);
        } catch (err) {
            throw err;
        }
    }
}
