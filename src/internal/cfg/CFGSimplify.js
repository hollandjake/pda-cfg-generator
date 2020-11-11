import Variable from "./Variable.js";
import ObjectHelper from "../helper/ObjectHelper.js";
import CFG from "./CFG.js";
import ArrayHelper from "../helper/ArrayHelper.js";
import Rule from "./Rule.js";

export default class CFGSimplify {
    /**
     * Removes any rules which are not reachable from the start node
     *
     * @param {CFG} cfg
     * @returns {CFG}
     */
    static simplify(cfg) {
        let rules = [...cfg.rules];
        rules = this.reachability(rules, cfg);
        rules = this.terminality(rules, cfg);

        return CFG.fromRules(rules, cfg.startVariable);
    }


    /**
     * If a rule cant be reaches from the start then its useless
     *
     * @param {Rule[]} rules
     * @param {CFG} cfg
     * @returns {Rule[]}
     */
    static reachability(rules, cfg) {
        let newRules = [];
        let visitedVariables = [];
        let variableStack = [cfg.startVariable];

        while (variableStack.length > 0) {
            let v = variableStack.pop();
            rules.filter(r => ObjectHelper.equals(r.inputVariable, v)).forEach(r => {
                newRules.push(r);
                r.outputList.filter(o => o instanceof Variable).forEach(o => {
                    if (!ArrayHelper.contains(visitedVariables, o)) {
                        variableStack.push(o);
                        visitedVariables.push(o);
                    }
                })
            })
        }

        return ArrayHelper.distinct(newRules);
    }

    static terminality(rules) {
        let W = [];
        let newRules = [];

        rules.filter(r => {
            return !r.outputList.some(o => o instanceof Variable);
        }).forEach(r => {
            newRules.push(r);
            W.push(r.inputVariable);
        })

        let changed = false;
        do {
            changed = false;
            rules.filter(r => {
                return !r.outputList.some(o => o instanceof Variable && !ArrayHelper.contains(W, o))
            }).forEach(r => {
                if (!ArrayHelper.contains(newRules, r)) {
                    newRules.push(r);
                    W.push(r.inputVariable);
                    changed = true;
                }
            })
        } while (changed);

        return newRules;
    }
}