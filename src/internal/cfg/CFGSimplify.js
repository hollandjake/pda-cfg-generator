import ObjectHelper from "../helper/ObjectHelper.js";
import Variable from "./Variable.js";
import ArrayHelper from "../helper/ArrayHelper.js";
import MagicMap from "../helper/MagicMap.js";
import CFG from "./CFG.js";

export default class CFGSimplify {
    /**
     * Removes any rules which are not reachable from the start node
     *
     * @param {CFG} cfg
     * @returns {CFG}
     */
    static simplify(cfg) {
        let newRules = [...cfg.rules];
        newRules = this.reachability(newRules, cfg);
        newRules = this.terminality(newRules, cfg);

        return CFG.fromRules(newRules, cfg.startVariable);
    }

    /**
     * Reachable from start
     *
     * @param {Rule[]} rules
     * @param {CFG} cfg
     */
    static reachability(rules, cfg) {
        let validRules = [];
        let variableStack = [cfg.startVariable];
        let exploredVariables = [];

        while (variableStack.length > 0) {
            variableStack = ArrayHelper.distinct(
                variableStack.map(variable => {
                    exploredVariables.push(variable);
                    return rules
                        .filter(r => ObjectHelper.equals(r.inputVariable, variable)) // Rules generated from variable
                        .map(r => {
                            validRules.push(r);
                            return r.outputList;
                        })
                        .flat()
                        .filter(o => o instanceof Variable)
                        .filter(o => !ArrayHelper.contains(exploredVariables, o) // Stop Cyclic looping
                        )
                }).flat()
            )
        }

        return validRules;
    }

    /**
     *
     * @param {Rule[]} rules
     * @param {CFG} cfg
     * @return {Rule[]}
     */
    static terminality(rules, cfg) {
        let terminatingVariables = [];
        let tempTerminatingVariables;
        let changed;

        let ruleMapping = new MagicMap();
        cfg.variables.forEach(v => {
            ruleMapping.set(v, rules.filter(r => ObjectHelper.equals(r.inputVariable, v)));
        })

        do {
            tempTerminatingVariables = cfg.variables.filter(v => {
                let matchingRules = ruleMapping.get(v);
                return matchingRules.some(r => r.outputList.some(o => !(o instanceof Variable && !ArrayHelper.contains(terminatingVariables, o))));
            });
            changed = !ObjectHelper.equals(terminatingVariables, tempTerminatingVariables);
            terminatingVariables = tempTerminatingVariables;
        } while (changed);

        return rules.filter(r => {
            return !r.outputList.some(o => {
                if (o instanceof Variable && !ArrayHelper.contains(terminatingVariables, o)) {
                    return true;
                }
            })
        });
    }
}