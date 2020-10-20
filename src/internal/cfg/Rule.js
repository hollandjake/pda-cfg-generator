import Variable from "./Variable.js";

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