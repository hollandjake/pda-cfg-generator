import Variable from "./Variable.js";
import ObjectHelper from "../helper/ObjectHelper.js";
import CFG from "./CFG.js";
import ArrayHelper from "../helper/ArrayHelper.js";
import Rule from "./Rule.js";
import Terminal from "./Terminal.js";

export default class CFGSimplify {
    /**
     * Removes any rules which are not reachable from the start node
     *
     * @param {CFG} cfg
     * @returns {CFG}
     */
    static simplify(cfg) {
        let startVariable;
        let rules = [...cfg.rules];
        [startVariable, rules] = this.step1(rules, cfg);
        rules = this.step2(rules);
        rules = this.step3(rules);

        return CFG.fromRules(rules, startVariable);
    }

    /**
     * First, we add a new start variable S0 and the rule S0 → S, where
     * S was the original start variable. This change guarantees that the start variable
     * doesn't occur on the right-hand side of a rule.
     *
     * @param {Rule[]} rules
     * @param {CFG} cfg
     * @returns {(Variable|Rule|Rule[])[]}
     */
    static step1(rules, cfg) {
        let newStartVariable = Variable.S;
        if (ObjectHelper.equals(cfg.startVariable, newStartVariable)) {
            newStartVariable = Variable.S0;
        }
        let startRule = new Rule(newStartVariable, [cfg.startVariable]);
        rules.push(startRule);

        return [newStartVariable, rules];
    }

    /**
     * Second, we take care of all ε-rules. We remove an ε-rule A → ε, where A
     * is not the start variable. Then for each occurrence of an A on the right-hand
     * side of a rule, we add a new rule with that occurrence deleted. In other words,
     * if R → uAv is a rule in which u and v are strings of variables and terminals, we
     * add rule R → uv. We do so for each occurrence of an A, so the rule R → uAvAw
     * causes us to add R → uvAw, R → uAvw, and R → uvw. If we have the rule
     * R → A, we add R → ε unless we had previously removed the rule R → ε. We
     * repeat these steps until we eliminate all ε-rules not involving the start variable.
     *
     * @param {Rule[]} rules
     * @returns {Rule[]}
     */
    static step2(rules) {
        let epsilonRules;

        do {
            epsilonRules = [];
            rules = rules.map(rule => {
                if (ArrayHelper.contains(rule.outputList, Terminal.EPSILON)) {
                    epsilonRules.push(rule);
                    return null;
                }
                return rule;
            }).filter(x => x !== null)
            let tempNewRules = [...rules];
            rules.forEach(rule => {
                epsilonRules.forEach(epsilonRule => {
                    let generateRulesForStep = this.generateRulesForStep2(rule, epsilonRule.inputVariable);
                    generateRulesForStep.filter(r => !ArrayHelper.contains(epsilonRules, r)).forEach(x => {
                        ArrayHelper.push_distinct(tempNewRules, x);
                    })
                })
            })
            rules = tempNewRules;
        } while (epsilonRules.length > 0);

        return rules;
    }

    static generateRulesForStep2(rule, variable) {
        let newRules = [];

        rule.outputList.forEach((a, i) => {
            if (ObjectHelper.equals(a, variable)) {
                let splicedOutputList = [...rule.outputList];
                splicedOutputList.splice(i, 1);
                let items;
                if (splicedOutputList.length === 0) {
                    items = [new Rule(rule.inputVariable)];
                } else {
                    items = this.generateRulesForStep2(new Rule(rule.inputVariable, splicedOutputList), variable);
                    items.push(new Rule(rule.inputVariable, splicedOutputList));
                }
                items.forEach(item => {
                    ArrayHelper.push_distinct(newRules, item);
                })
            }
        })

        return newRules;
    }

    /**
     * Third, we handle all unit rules. We remove a unit rule A → B. Then,
     * whenever a rule B → u appears, we add the rule A → u unless this was a unit
     * rule previously removed. As before, u is a string of variables and terminals. We
     * repeat these steps until we eliminate all unit rules.
     *
     * @param {Rule[]} rules
     * @return {Rule[]}
     */
    static step3(rules) {
        let unitRules;

        let newRules = [...rules]

        do {
            unitRules = [];
            newRules = newRules.map(rule => {
                if (rule.outputList.length === 1 && rule.outputList[0] instanceof Variable) {
                    unitRules.push(rule);
                    return null;
                }
                return rule;
            }).filter(x => x !== null)
            let tempNewRules = [...newRules];

            //Where B -> u add rule A->u unless in unit rule
            unitRules.forEach(unitRule => {
                let A = unitRule.inputVariable;
                let B = unitRule.outputList[0];
                rules.forEach(rule => {
                    if (ObjectHelper.equals(rule.inputVariable, B)) {
                        let generatedRule = new Rule(A, rule.outputList);
                        if (!ArrayHelper.contains(unitRules, generatedRule)) {
                            ArrayHelper.push_distinct(tempNewRules, generatedRule);
                        }
                    }
                })
            })
            newRules = tempNewRules;
        } while (unitRules.length > 0)

        return newRules;
    }
}