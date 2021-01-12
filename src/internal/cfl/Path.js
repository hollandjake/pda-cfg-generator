import Symbol from "../Symbol.js";
import Variable from "../cfg/Variable.js";
import ArrayHelper from "../helper/ArrayHelper.js";

export default class Path extends Symbol {
    /**
     *
     * @param {Symbol[]} sequence
     * @param exploredVariables
     */
    constructor(sequence, exploredVariables) {
        super(sequence.toString());
        this._sequence = sequence;
        this._exploredVariables = ArrayHelper.distinct(
            sequence.filter(s => s instanceof Variable).concat(exploredVariables)
        );
    }

    get sequence() {
        return this._sequence;
    }

    get exploredVariables() {
        return this._exploredVariables;
    }

    expand(baseVariableMap) {
        let newPaths = this.shallowReplace(baseVariableMap);
    }

    /**
     * @param {MagicMap} baseVariableMap
     */
    shallowReplace(baseVariableMap) {
        let hadVariable = false;
        let mapping = this.sequence.map(element => {
            if (element instanceof Variable) {
                hadVariable = true
                return baseVariableMap.get(element);
            } else {
                return [[element]];
            }
        });
        return [mapping, hadVariable]
    }
}