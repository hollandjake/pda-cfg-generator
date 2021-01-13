import Rule from "./Rule.js";
import Variable from "./Variable.js";
import ObjectHelper from "../helper/ObjectHelper.js";
import Terminal from "./Terminal.js";
import ArrayHelper from "../helper/ArrayHelper.js";

export default class CFGChomsky {
    static chomsky(cfg) {
        let rules = [...cfg.rules];
        let [newRules, newStartVariable] = this.rule1(rules, cfg);
        newRules = this.rule2(newRules, cfg);

        // New start variable
        // Remove epsilon rules A->e
        // Remove unit products A->B
        // Remove useless variables
        // Create all terminal rules
        // Convert remaining rules into proper form
        // Create all
    }

    static rule1(rules, cfg) {
        let startVariable = cfg.startVariable;
        let newStartVariable = Variable.S0;
        rules.push(new Rule(newStartVariable, [cfg.startVariable]))
        return [rules, newStartVariable];
    }

    static rule2(rules, cfg) {
        let newRules = []
        let matchingVariables = [];

        rules.forEach(r => {
            if (ObjectHelper.equals(r.outputList, [Terminal.EPSILON])) {
                matchingVariables.push(r.inputVariable);
            } else {
                newRules.push(r);
            }
        })

        let generatedRules = []


        newRules.forEach(r => {
            // For each rule, calculate the indices of matching variables in its output list
            let outputList = r.outputList;

            for (let i = 0; i < (1 << outputList.length); i++) {
                let newOutputs = outputList.map((o, index) => {
                    if (o instanceof Variable && ArrayHelper.contains(matchingVariables, o)) {
                        if ((i & (1 << index)) !== 0) {
                            return o;
                        }
                        return null;
                    } else {
                        return o;
                    }
                }).filter(x => x !== null);

                if (newOutputs.length === 0) {
                    generatedRules.push(new Rule(r.inputVariable));
                } else {
                    generatedRules.push(
                        new Rule(
                            r.inputVariable,
                            newOutputs
                        )
                    )
                }
            }
        })

        newRules.forEach(r => {
            ArrayHelper.push_distinct(newRules, new Rule(r.inputVariable, r.outputList.filter(o => {
                return !(o instanceof Variable) || !ArrayHelper.contains(matchingVariables, o)
            })))
        })

        return newRules;
    }
}