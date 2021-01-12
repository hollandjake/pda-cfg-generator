import ObjectHelper from "../helper/ObjectHelper.js";
import Variable from "../cfg/Variable.js";
import ArrayHelper from "../helper/ArrayHelper.js";
import PathSegment from "./PathSegment.js";
import Terminal from "../cfg/Terminal.js";
import MagicMap from "../helper/MagicMap.js";

export default class CFL {
    constructor(paths) {
        this._paths = paths;
    }

    get paths() {
        return this._paths;
    }

    static fromPDA(pda) {
        return pda.toCFG().simplify().toCFL();
    }

    /**
     * @param {CFG} cfg
     */
    static fromCFG(cfg) {
        let rules = cfg.rules;

        let baseVariableMap = new MagicMap();

        cfg.variables.forEach(variable => {
            baseVariableMap.set(variable, rules.filter(r => ObjectHelper.equals(r.inputVariable, variable)).map(r => r.outputList));
        });

        let paths = this.forVariable(cfg.startVariable, baseVariableMap, [], new MagicMap());

        paths = ArrayHelper.distinct(paths);
        return new CFL(paths);
    }

    /**
     *
     * @param {[[[Symbol]]]} m
     * @returns {[[]]}
     */
    static expandMapping(m) {
        let mapping = [...m].reverse();
        //Initialise with the first element from the mapping
        let outputs = mapping.pop();

        mapping.reverse().forEach(element => {
            let tempOutputs = [];
            element.forEach(sequence => {
                tempOutputs = tempOutputs.concat(outputs.map(output => {
                    return output.concat(sequence);
                }))
            })
            outputs = tempOutputs;
        })

        return outputs;
    }

    /**
     *
     * @param activeVariable
     * @param {MagicMap} baseMappings
     * @param {Variable[]} exploreStack
     * @param {MagicMap} finalMap
     * @returns [ [Symbol] ]
     */
    static forVariable(activeVariable, baseMappings, exploreStack, finalMap) {
        if (ArrayHelper.contains(exploreStack, activeVariable)) {
            return [[activeVariable]];
        }

        if (finalMap.has(activeVariable)) {
            return finalMap.get(activeVariable);
        }

        exploreStack.push(activeVariable);

        /**
         * @var {[[Symbol]]} variableMappings
         */
        let variableMappings = baseMappings.get(activeVariable);

        //Shallow replace
        variableMappings = variableMappings.map(mapping => {
            let newMappings = mapping.map(element => {
                if (element instanceof Variable) {
                    return this.forVariable(element, baseMappings, [...exploreStack], finalMap);
                } else {
                    if (ObjectHelper.equals(element, Terminal.EPSILON)) {
                        return [[]];
                    } else {
                        return [[element]];
                    }
                }
            })

            return this.expandMapping(newMappings);
        }).flat().map(mapping => {
            // If output contains the variable itself then we must perform the reduction
            if (ArrayHelper.contains(mapping, activeVariable)) {
                let index = ArrayHelper.find(mapping, activeVariable);
                let x1 = mapping.slice(0, index).filter(i => !ObjectHelper.equals(i, Terminal.EPSILON));
                let x2 = mapping.slice(index + 1, mapping.length).filter(i => !ObjectHelper.equals(i, Terminal.EPSILON));

                let response = [];
                if (x1.length > 0) {
                    response.push(PathSegment.from(x1))
                }
                if (x2.length > 0) {
                    response.push(PathSegment.from(x2))
                }

                return response;
            }
            return mapping;
        })

        exploreStack.pop();
        finalMap.set(activeVariable, variableMappings);

        return variableMappings;
    }

    /* istanbul ignore next */
    toString() {
        return `CFL {\n\t${this._paths.map(path => path.toString()).join("\n\t")}\n}`;
    }
}