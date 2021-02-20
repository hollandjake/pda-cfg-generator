import Variable from "./Variable.js";
import ArrayHelper from "../helper/ArrayHelper.js";
import MagicMap from "../helper/MagicMap.js";
import CFG from "./CFG.js";
import Terminal from "./Terminal.js";
import Rule from "./Rule.js";

export default class CFGSimplify {
    /**
     * Removes any rules which are not reachable from the start node
     *
     * @param {CFG} cfg
     *
     * @return {CFG}
     */
    static simplify(cfg) {
        let newRules = [...cfg.rules];
        let newRulesTemp = [];
        let changed = false;
        do {
            newRulesTemp = this.reduce(newRules, cfg);
            newRulesTemp = this.substitution(newRulesTemp, cfg);
            changed = !ArrayHelper.equals(newRules, newRulesTemp);
            newRules = newRulesTemp;
        } while (changed)

        return CFG.fromRules(newRules, cfg.startVariable);
    }

    /**
     * Attempt to reduce ruleset size by merging any rules in the form of A->a to any rule which uses it.
     * This includes those which are of the form A->e
     *
     * @param {Rule[]} rules
     * @param {CFG} cfg
     *
     * @return {Rule[]}
     */
    static substitution(rules, cfg) {
        /**
         *
         * @type {MagicMap<Variable, Terminal>}
         */
        let matchingRulesMap;
        let newRulesTemp;
        let newRules = [...rules];
        let removedRules = [];

        do {
            matchingRulesMap = new MagicMap();
            newRulesTemp = [];

            //Find all rules which match criteria (only do one instance of the rule at any one time,
            //the loop will handle duplicates
            newRules.forEach(r => {
                if (
                    r.outputList.length === 1 &&
                    !cfg.startVariable.equals(r.inputVariable) &&
                    r.outputList[0] instanceof Terminal &&
                    !matchingRulesMap.has(r.inputVariable) &&
                    !ArrayHelper.contains(removedRules, r)
                ) {
                    matchingRulesMap.set(r.inputVariable, r.outputList[0]);
                    removedRules.push(r);
                } else {
                    newRulesTemp.push(r);
                }
            })
            newRules = newRulesTemp;
            newRulesTemp = [...newRules];

            if (matchingRulesMap.size > 0) {
                newRules.forEach(r => {
                    let matchedIndices = ArrayHelper.findAllFrom(r.outputList, Array.from(matchingRulesMap.keys()));

                    //Calculate all combinations of the matched keys (AKA the powerset), some big brain logic here
                    let powerSet = ArrayHelper.powerSet(Array.from(matchedIndices.keys()));

                    powerSet.forEach(indexArray => {
                        let newOutput = [...r.outputList];
                        indexArray.reverse().forEach(i => {
                            let replacement = matchingRulesMap.get(matchedIndices.get(i));
                            let isEpsilonReplacement = Terminal.EPSILON.equals(replacement);

                            if (isEpsilonReplacement) {
                                newOutput.splice(i, 1);
                            } else {
                                newOutput[i] = replacement;
                            }
                        })
                        if (newOutput.length === 0) {
                            newOutput = [Terminal.EPSILON];
                        }
                        newRules.push(new Rule(r.inputVariable, newOutput));
                    })
                })
                newRules = this.reduce(newRules, cfg);
            }
        } while (matchingRulesMap.size > 0);

        return newRules;
    }

    static reduce(rules, cfg) {
        rules = this.condense(rules, cfg);
        rules = this.reachability(rules, cfg);
        rules = this.terminality(rules, cfg);
        rules = this.useless(rules, cfg);
        return ArrayHelper.distinct(rules);
    }

    /**
     * Is the Rule reachable from startVariable
     *
     * @param {Rule[]} rules
     * @param {CFG} cfg
     *
     * @return {Rule[]}
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
                        .filter(r => variable.equals(r.inputVariable)) // Rules generated from variable
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
     * Remove any variables which don't eventually terminate
     *
     * @param {Rule[]} rules
     * @param {CFG} cfg
     *
     * @return {Rule[]}
     */
    static terminality(rules, cfg) {
        let terminatingVariables = [];

        let remainingRules = [...rules];
        let terminatingRules = [];
        let changed = false;

        do {
            changed = false;
            remainingRules = remainingRules.filter(r => {
                if (r.terminates(terminatingVariables)) {
                    ArrayHelper.push_distinct(terminatingVariables, r.inputVariable);
                    terminatingRules.push(r);
                    changed = true;
                    return false;
                }
                return true;
            });
        } while (changed)

        return terminatingRules;
    }

    /**
     *
     * @param {Rule[]} rules
     * @param {CFG} cfg
     * @return {Rule[]}
     */
    static useless(rules, cfg) {
        //Remove rules which just make themselves e.g. A->A
        rules = rules.filter(r => r.outputList.length > 1 || !r.inputVariable.equals(r.outputList[0]));

        let newRules = [...rules];
        let changed = false;
        do {
            changed = false;
            let tempRules = [];

            /**
             * Stores a map from variable to every sequence that it can produce
             * @type {MagicMap<Variable, [[Symbol]]>}
             */
            let variableMapping = new MagicMap();
            cfg.variables.forEach(v => {
                variableMapping.set(v, newRules.filter(r => r.inputVariable.equals(v)).map(r => r.outputList));
            })

            newRules.forEach(r => {
                //Replace any rule which just does A->B with rules generated by B
                if (r.outputList.length === 1 && r.outputList[0] instanceof Variable) {
                    variableMapping.get(r.outputList[0]).forEach(sequence => {
                        tempRules.push(new Rule(r.inputVariable, sequence));
                    })
                    changed = true
                } else {
                    tempRules.push(r);
                }
            });
            newRules = ArrayHelper.distinct(tempRules);
        } while (changed);

        return newRules;
    }

    /**
     * If the only rules a variable generates will eventually collapse
     * into the same string then we can just take the rule which
     * produces the smallest sequence.
     *
     * @param {Rule[]} rules
     * @param {CFG} cfg
     */
    static condense(rules, cfg) {
        //Group rules based on the input Variable
        let variableMapping = new MagicMap();
        cfg.variables.forEach(v => variableMapping.set(v, rules.filter(r => r.inputVariable.equals(v))));

        variableMapping.forEach((rules, variable) => {
            let hasEpsilonRule = false;
            let nonEpsilonRules = rules.filter(r => {
                if (r.isEpsilonRule()) {
                    hasEpsilonRule = true;
                    return false;
                }
                return true;
            });

            if (nonEpsilonRules.length === 1 && nonEpsilonRules[0].outputList.every(o => o.equals(variable))) {
                variableMapping.set(variable, new Rule(variable));
            }
        })

        return Array.from(variableMapping.values()).flat();
    }
}