import ObjectHelper from "../helper/ObjectHelper.js";
import Variable from "../cfg/Variable.js";
import ArrayHelper from "../helper/ArrayHelper.js";
import PathSegment from "./PathSegment.js";
import Terminal from "../cfg/Terminal.js";

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

        let variableMap = {}

        //Map each variable into its set of rules which have been reduced
        cfg.variables.forEach(variable => {
            variableMap[variable.id] = cfg.rules
                // For each rule which has variable as input
                .filter(r => ObjectHelper.equals(r.inputVariable, variable))
                // reduce each rule
                .map(r => {
                    // If output contains the variable itself then we must perform the reduction
                    if (ArrayHelper.contains(r.outputList, variable)) {
                        let index = ArrayHelper.find(r.outputList, variable);
                        let x1 = r.outputList.slice(0, index).filter(i => !ObjectHelper.equals(i, Terminal.EPSILON));
                        let x2 = r.outputList.slice(index + 1, r.outputList.length).filter(i => !ObjectHelper.equals(i, Terminal.EPSILON));

                        return [
                            PathSegment.from(x1), PathSegment.from(x2)
                        ];
                    }
                    return r.outputList.filter(i => !ObjectHelper.equals(i, Terminal.EPSILON));
                })
        })

        let paths = variableMap[cfg.startVariable.id];

        let finalPaths = paths.map(path => {
            let outputs = [];
            for (let i = path.length - 1; i >= 0; i--) {
                let element = path[i];

                if (element instanceof Variable) {
                    let varData = variableMap[element.id];
                    if (outputs.length === 0) {
                        outputs = varData;
                    } else {
                        let newOutputs = []
                        varData.forEach(varPath => {
                            outputs.forEach(output => {
                                newOutputs.push(varPath.concat(output));
                            })
                        })
                        outputs = newOutputs;
                    }
                } else {
                    if (outputs.length === 0) {
                        outputs = [[element]]
                    } else {
                        outputs = outputs.map(output => {
                            return [element].concat(output);
                        })
                    }
                }
            }
            return outputs;
        }).flat();

        return new CFL(finalPaths);
    }

    /* istanbul ignore next */
    toString() {
        return `CFL {\n\t${this._paths.map(path => path.toString()).join("\n\t")}\n}`;
    }
}