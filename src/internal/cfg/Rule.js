import Variable from "./Variable.js";
import CFGString from "./CFGString.js";
import Terminal from "./Terminal.js";
import ArrayHelper from "../helper/ArrayHelper.js";

export default class Rule {

    /**
     *
     * @param {Variable} inputVariable
     * @param {Symbol[]} outputList
     */
    constructor(inputVariable, outputList = [Terminal.EPSILON]) {
        if (inputVariable === null || typeof inputVariable !== "object" || !(inputVariable instanceof Variable)) {
            throw new Error("'inputVariable' is not of type 'Variable'");
        }
        if (outputList === null || typeof outputList !== "object" || outputList.length === 0) {
            throw new Error("'outputList' is null or an empty Symbol[]");
        }

        this._inputVariable = inputVariable;
        this._outputList = outputList;
    }

    /* istanbul ignore next */
    get inputVariable() {
        return this._inputVariable;
    }

    /* istanbul ignore next */
    get outputList() {
        return this._outputList;
    }

    /**
     * Parse a {Rule} from a string using the format <Variable> -> <Variable|Terminal>*
     * @param {String} ruleString
     * @returns {Rule}
     */
    static fromString(ruleString) {
        if (ruleString !== null && ruleString.length > 0) {
            ruleString = ruleString.replace("e", Terminal.EPSILON.id);
            let [inputVariable, outputString] = ruleString.split('->');
            inputVariable = CFGString.from(inputVariable.trim());

            if (inputVariable.length !== 1 || !(inputVariable[0] instanceof Variable)) {
                throw new Error(`Input for the rule '${ruleString}' is not of type 'Variable' try using an UPPERCASE letter`);
            }

            let outputs = CFGString.from(outputString.trim())

            return new Rule(inputVariable[0], outputs);
        }
        return null;
    }

    /**
     *
     * @param {Rule[]} rules
     * @returns Rule[]
     */
    static sort(rules) {
        if (rules.length === 1) {
            return [rules[0]];
        }
        // noinspection DuplicatedCode
        return rules.sort((a, b) => {
            if (a.inputVariable.id < b.inputVariable.id) {
                return -1;
            }
            if (a.inputVariable.id > b.inputVariable.id) {
                return 1;
            }

            if (a.outputList.length < b.outputList.length) {
                return -1
            }
            if (a.outputList.length > b.outputList.length) {
                return 1;
            }

            for (let i = 0, len = a.outputList.length; i < len; i++) {
                let aSymbol = a.outputList[i];
                let bSymbol = b.outputList[i];
                if (aSymbol.id < bSymbol.id) {
                    return -1;
                }
                if (aSymbol.id > bSymbol.id) {
                    return 1;
                }
            }

            return 0;
        });
    }

    /**
     * Calculates if the rule is a terminating given a list of already known terminating variables.
     *
     * @param {Variable[]} terminatingVariables
     * @returns {boolean}
     */
    terminates(terminatingVariables = []) {
        return this.outputList.every(o => o instanceof Terminal || ArrayHelper.contains(terminatingVariables, o));
    }

    isEpsilonRule() {
        return this.outputList.every(o => o.equals(Terminal.EPSILON));
    }

    /* istanbul ignore next */
    toString() {
        return `${this._inputVariable} → ${this.outputString()}`;
    }

    /* istanbul ignore next */
    outputString() {
        return this.outputList.map(s => s.id).join('');
    }
}