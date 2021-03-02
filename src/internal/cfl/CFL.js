import MagicMap from "../helper/MagicMap.js";
import ArrayHelper from "../helper/ArrayHelper.js";
import Variable from "../cfg/Variable.js";
import Terminal from "../cfg/Terminal.js";
import PathSegment from "./PathSegment.js";

export default class CFL {
    constructor(paths) {
        this._paths = paths;
    }

    get paths() {
        return this._paths;
    }

    /**
     * @param {CFG} cfg
     */
    static fromCFG(cfg) {
        let rules = cfg.rules;

        let baseVariableMap = new MagicMap();

        cfg.variables.forEach(variable => {
            baseVariableMap.set(variable, rules.filter(r => variable.equals(r.inputVariable)).map(r => r.outputList));
        });

        let paths = this.L(cfg.startVariable, baseVariableMap, [], new MagicMap());

        paths = ArrayHelper.distinct(paths);
        return new CFL(paths);
    }

    /**
     * 1. For each rule generated from the variable
     * 2.   generate all possible languages for its elements
     * 3. combine and flatten all combinations such that the output is an array of symbol sequences i.e. [[Symbol]]
     *
     *
     * @param {Variable} targetVariable
     * @param {MagicMap<Variable, Symbol[]>} variableMappings
     * @param {Variable[]} exploreStack
     * @param {MagicMap<Variable, [[Symbol]]>} finalMapping
     * @returns [[Symbol]]
     */
    static L(targetVariable, variableMappings, exploreStack, finalMapping) {
        // If variable has already been searched then we propagate back up as we have met a loop
        if (ArrayHelper.contains(exploreStack, targetVariable)) {
            return [[targetVariable]];
        }

        // Optimisation: if we have completed the search for a variable, there is no need to re-search it again.
        if (finalMapping.has(targetVariable)) {
            return finalMapping.get(targetVariable);
        }

        // Add variable to explore stack: this enables the handling of loops
        exploreStack.push(targetVariable);

        //Recursion
        //For each output the variable can generate
        //Produce the Symbol sequences which they can produce

        let variableMap = variableMappings.get(targetVariable)
            .map(mapping => {
                let newMappings = mapping.map(element => {
                    if (element instanceof Variable) {
                        return this.L(element, variableMappings, [...exploreStack], finalMapping);
                    } else if (Terminal.EPSILON.equals(element)) {
                        return [[]];
                    } else {
                        return [[element]];
                    }
                })
                // Flatten the mappings into an array of sequences
                return this.expandMapping(newMappings);
            })
            .flat() // Convert into a large 2d array
            .map(mapping => {
                let i = ArrayHelper.find(mapping, targetVariable);
                if (i !== null) {
                    let left = mapping.slice(0, i);
                    let right = mapping.slice(i + 1, mapping.length);

                    let combined = [];

                    if (left.length > 0) {
                        combined.push(PathSegment.from(left));
                    }
                    if (right.length > 0) {
                        combined.push(PathSegment.from(right));
                    }
                    return combined;
                }
                return mapping;
            })

        exploreStack.pop(); //Release the lock on the variable as we have now produced its path
        finalMapping.set(targetVariable, variableMap);

        return variableMap;
    }

    /**
     * Generates all possible of combinations of concatenations on a collection of array of sequences
     *
     * e.g.
     * [
     *  [
     *      [A,B],
     *      [C,D]
     *  ],
     *  [
     *      [E,F],
     *      [G]
     *  ]
     * ]
     *
     * would produce
     * [
     *  [A,B,E,F],
     *  [A,B,G],
     *  [C,D,E,F],
     *  [C,D,G]
     * ]
     *
     *
     * @param {[[[Symbol]]]} m
     * @returns {[[Symbol]]}
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

    /* istanbul ignore next */
    toString() {
        return `CFL {\n\t${this._paths.map(path => path.toString()).join("\n\t")}\n}`;
    }
}