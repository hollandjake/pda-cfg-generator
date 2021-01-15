import Variable from "./Variable.js";
import CFG from "./CFG.js";
import Rule from "./Rule.js";

export default class CFGRemapper {
    static remap(cfg) {
        let variableMapping = new Map();

        cfg.variables.forEach(variable => {
            if (!variableMapping.has(variable.id)) {
                variableMapping.set(variable.id, Variable.of('V', variableMapping.size));
            }
        })

        let newRules = cfg.rules.map(rule => {
            return new Rule(variableMapping.get(rule.inputVariable.id), rule.outputList.map(o => {
                    if (o instanceof Variable) {
                        return variableMapping.get(o.id);
                    }
                    return o;
                })
            )
        })

        return CFG.fromRules(newRules, variableMapping.get(cfg.startVariable.id))
    }
}