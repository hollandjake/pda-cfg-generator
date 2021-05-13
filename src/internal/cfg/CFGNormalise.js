import CFG from "./CFG.js";
import Rule from "./Rule.js";
import ArrayHelper from "../helper/ArrayHelper.js";
import ObjectHelper from "../helper/ObjectHelper.js";
import Terminal from "./Terminal.js";
import MagicMap from "../helper/MagicMap.js";

export default class CFGNormalise {
    /**
     * Normalises the CFG into Chomsky normal form
     *
     * @param {CFG} cfg
     * @returns {CFG}
     */
    static normalise(cfg) {
        let newCFG = cfg.simplify();
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
                let generatedRules = this.generateRulesForStep4(rule, cfg);
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

    static generateRulesForStep4(rule, cfg) {
        let nextVariable = cfg.nextVariable();
        let generatedRules = [new Rule(rule.inputVariable, [rule.outputList[0], nextVariable])];

        for (let i = 1, len = rule.outputList.length - 2; i < len; i++) {
            let nextNextVariable = cfg.nextVariable();
            generatedRules.push(new Rule(
                nextVariable,
                [rule.outputList[i], nextNextVariable]
            ));
            nextVariable = nextNextVariable;
        }

        generatedRules.push(new Rule(
            nextVariable,
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
        let terminalSwitching = new MagicMap();
        let newRules = [];
        rules.forEach(rule => {
            if (rule.outputList.length > 1) {
                newRules.push(new Rule(rule.inputVariable, rule.outputList.map(o => {
                    if (o instanceof Terminal) {
                        if (!terminalSwitching.has(o)) {
                            terminalSwitching.set(o, new Rule(cfg.nextVariable(), [o]));
                        }
                        return terminalSwitching.get(o).inputVariable;
                    } else {
                        return o;
                    }
                })));
            } else {
                newRules.push(rule);
            }
        })

        newRules = newRules.concat(Array.from(terminalSwitching.values()));

        return newRules;
    }
}