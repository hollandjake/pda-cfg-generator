import Variable from "./Variable.js";
import CFG from "./CFG.js";
import Rule from "./Rule.js";
import MagicMap from "../helper/MagicMap.js";

export default class CFGRemapper {
    static remap(cfg) {
        let variableMapping = new MagicMap();
        let startVariable = Variable.V(0);
        variableMapping.set(cfg.startVariable, startVariable);

        cfg.variables.filter(v => !v.equals(cfg.startVariable)).forEach(variable => {
            variableMapping.set(variable, Variable.V(variableMapping.size));
        })

        let newRules = cfg.rules.map(rule => {
            return new Rule(variableMapping.get(rule.inputVariable), rule.outputList.map(o => {
                    if (o instanceof Variable) {
                        return variableMapping.get(o);
                    }
                    return o;
                })
            )
        })

        return CFG.fromRules(newRules, startVariable);
    }
}