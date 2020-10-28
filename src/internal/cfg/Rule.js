import Variable from "./Variable.js";
import CFGSymbol from "./CFGSymbol.js";
import Terminal from "./Terminal.js";

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

    get inputVariable() {
        return this._inputVariable;
    }

    get outputList() {
        return this._outputList;
    }

    isMixedOutput() {
        let hasVariable = false;
        let hasTerminal = false;

        for (let i = 0, len = this.outputList.length;i<len;i++) {
            if (this.outputList[i] instanceof Variable) {
                hasVariable = true;
                if (hasTerminal) {
                    return true;
                }
            } else if (this.outputList[i] instanceof Terminal) {
                hasTerminal = true;
                if (hasVariable) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Parse a {Rule} from a string using the format <Variable> -> <Variable|Terminal>*
     * @param {String} ruleString
     * @returns {Rule}
     */
    static fromString(ruleString) {
        if (ruleString !== null && ruleString.length > 0) {
            let [inputVariable, outputString] = ruleString.split('->');
            inputVariable = CFGSymbol.from(inputVariable.trim());

            if (inputVariable.length !== 1 || !(inputVariable[0] instanceof Variable)) {
                throw new Error(`Input for the rule '${ruleString}' is not of type 'Variable' try using an UPPERCASE letter`);
            }

            let outputs = CFGSymbol.from(outputString.trim())

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
            return [...rules];
        }
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

            for (let i = 0, len = a.outputList.length; i < len;i++) {
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

    /* istanbul ignore next */
    toString() {
        return `${this._inputVariable} → ${this.outputList.map(s => s.id).join('')}`;
    }
}