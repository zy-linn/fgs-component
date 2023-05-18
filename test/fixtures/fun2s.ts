import ComponentDemo from '../../src/index';
import { INPUTS } from './inputs';

(async () => {
    try {
        const data = await new ComponentDemo().fun2s(INPUTS);
        console.log(data);
    } catch (error) {
        console.error(error);
    }
})();