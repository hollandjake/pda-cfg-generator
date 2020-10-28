import ObjectHelper from "../helper/ObjectHelper.js";
import Rule from "./Rule.js";
import CFG from "./CFG.js";
import ArrayHelper from "../helper/ArrayHelper.js";
import Terminal from "./Terminal.js";
import CFGSimplify from "./CFGSimplify.js";

export default class CFGNormalise {
    /**
     * Normalises the CFG into Chomsky normal form
     *
     * @param {CFG} cfg
     * @returns {CFG}
     */
    static normalise(cfg) {
        let newCFG = CFGSimplify.simplify(cfg);
        let newRules = this.step4([...cfg.rules], newCFG);
        return CFG.fromRules(newRules, newCFG.startVariable);
    }

    /**
     * Finally, we convert all remaining rules into the proper form. We replace each
     * rule A → u1u2 ··· uk, where k ≥ 3 and each ui is a variable or terminal symbol,
     * with the rules A → u1A1, A1 → u2A2, A2 → u3A3, ... , and Ak−2 → uk−1uk.
     * The Ai’s are new variables. We replace any terminal ui in the preceding rule(s)
     * with the new variable Ui and add the rule Ui → ui.
     * @param rules
     * @param cfg
     */
    static step4(rules, cfg) {
        let newRules = [];
        let switcherRules = [];
        Rule.sort(rules).forEach(rule => {
            if (rule.outputList.length > 2) {
                let generatedRules = this.generateRulesForStep4(rule);
                let matchingRules = [];
                generatedRules.forEach(rule => {
                    let equivalentRule = this.findEquivalentRule(rule, switcherRules);
                    if (equivalentRule) {
                        matchingRules.push([rule.inputVariable, equivalentRule.inputVariable]);
                    }
                });
                generatedRules = generatedRules.map(rule => {
                    let matchingRule = matchingRules.find(r => ObjectHelper.equals(r[0], rule.inputVariable));
                    if (matchingRule) {
                        return null;
                    } else {
                        return new Rule(rule.inputVariable, rule.outputList.map(output => {
                            let match = matchingRules.find(r => ObjectHelper.equals(r[0], output));
                            if (match) {
                                return match[1];
                            } else {
                                return output;
                            }
                        }))
                    }
                }).filter(x => x !== null);

                switcherRules = switcherRules.concat(generatedRules);
            } else {
                ArrayHelper.push_distinct(newRules, rule);
            }
        });

        newRules = newRules.concat(switcherRules);

        return this.replaceTerminals(newRules, cfg);
    }

    static generateRulesForStep4(rule) {
        let generatedRules = [new Rule(rule.inputVariable, [rule.outputList[0], rule.inputVariable.sub(1)])];

        for (let i = 1, len = rule.outputList.length - 2; i < len; i++) {
            generatedRules.push(new Rule(
                rule.inputVariable.sub(i),
                [rule.outputList[i], rule.inputVariable.sub(i)]
            ));
        }

        generatedRules.push(new Rule(
            rule.inputVariable.sub(rule.outputList.length - 2),
            rule.outputList.slice(rule.outputList.length - 2, rule.outputList.length)
        ));

        return generatedRules;
    }

    static findEquivalentRule(rule, rules) {
        for (let i = 0, len = rules.length; i < len; i++) {
            if (ObjectHelper.equals(rule.outputList, rules[i].outputList)) {
                return rules[i];
            }
        }
        return null;
    }

    static replaceTerminals(rules, cfg) {
        let terminalSwitching = {};
        let newRules = [];
        rules.forEach(rule => {
            if (rule.isMixedOutput()) {
                newRules.push(new Rule(rule.inputVariable, rule.outputList.map(o => {
                    if (o instanceof Terminal) {
                        if (!terminalSwitching[o.id]) {
                            terminalSwitching[o.id] = new Rule(cfg.nextVariable(), [o]);
                        }
                        return terminalSwitching[o.id].inputVariable;
                    } else {
                        return o;
                    }
                })));
            } else {
                newRules.push(rule);
            }
        })

        for (let k in terminalSwitching) {
            newRules.push(terminalSwitching[k]);
        }

        return newRules;
    }
}