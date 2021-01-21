import ObjectHelper from "../helper/ObjectHelper.js";
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
        newRules = this.reduce(newRules, cfg); //Remove completely useless rules
        newRules = this.substitution(newRules, cfg); //Perform substitution
        newRules = this.reduce(newRules, cfg); //Remove any newly created useless rules

        return CFG.fromRules(newRules, cfg.startVariable);
    }

    /**
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

            newRules.forEach(r => {
                if (r.outputList.length === 1 && !ObjectHelper.equals(r.inputVariable, cfg.startVariable) && r.outputList[0] instanceof Terminal && !matchingRulesMap.has(r.inputVariable) && !ArrayHelper.contains(removedRules, r)) {
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

                    let powerSet = ArrayHelper.powerSet(Array.from(matchedIndices.keys()));

                    powerSet.forEach(indexArray => {
                        let newOutput = [...r.outputList];
                        indexArray.reverse().forEach(i => {
                            let replacement = matchingRulesMap.get(matchedIndices.get(i));
                            let isEpsilonReplacement = ObjectHelper.equals(replacement, Terminal.EPSILON);

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
                let newRules1 = this.reduce(newRules, cfg);
                newRules = newRules1;
            }
        } while (matchingRulesMap.size > 0);

        return newRules;
    }

    static reduce(rules, cfg) {
        let reachability = this.reachability(rules, cfg);
        let terminality = this.terminality(reachability, cfg);
        let useless = this.useless(terminality, cfg);
        return ArrayHelper.distinct(useless);
    }

    /**
     * Reachable from start
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
     *
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

    /**
     *
     * @param {Rule[]} rules
     * @param {CFG} cfg
     * @return {Rule[]}
     */
    static useless(rules, cfg) {
        //Remove rules which just make themselves e.g. A->A
        return rules.filter(r => r.outputList.length > 1 || !ObjectHelper.equals(r.outputList[0], r.inputVariable));
    }
}