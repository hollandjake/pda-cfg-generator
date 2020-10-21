import Variable from "./Variable.js";
import CFGSymbol from "./CFGSymbol.js";

export default class Rule {

    /**
     *
     * @param {Variable} inputVariable
     * @param {Symbol[]} outputList
     */
    constructor(inputVariable, outputList) {
        if (inputVariable === null || typeof inputVariable !== "object" || !(inputVariable instanceof Variable)) {
            throw new Error("'inputVariable' is not of type 'Variable'");
        }
        if (outputList === null || typeof outputList !== "object" || outputList.length === 0) {
            throw new Error("'outputList' is null or an empty Symbol[]");
        }

        this._inputVariable = inputVariable;
        this._outputList = outputList;
    }

    /**
     * Parse a {Rule} from a string using the format <Variable> -> <Variable|Terminal>*
     * @param {String} ruleString
     * @returns {Rule}
     */
    static fromString(ruleString) {
        if (ruleString !== null && ruleString.length > 0) {
            let [inputVariable, outputString] = ruleString.split('->');
            inputVariable = inputVariable.trim();
            inputVariable = CFGSymbol.of(inputVariable);

            if (!(inputVariable instanceof Variable)) {
                throw new Error(`Input for the rule '${ruleString}' is not of type 'Variable' try using an UPPERCASE letter`);
            }

            let outputs = outputString.trim().split('').map(outputChar => {
                return CFGSymbol.of(outputChar);
            });

            return new Rule(inputVariable, outputs);
        }
        return null;
    }


    get inputVariable() {
        return this._inputVariable;
    }

    get outputList() {
        return this._outputList;
    }

    /* istanbul ignore next */
    toString() {
        return `${this._inputVariable} → ${this.outputList.map(s => s.id).join('')}`
    }
}