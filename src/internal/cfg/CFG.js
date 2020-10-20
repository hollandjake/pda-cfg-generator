import Terminal from "./Terminal.js";
import Variable from "./Variable.js";
import Symbol from "../Symbol.js";
import ArrayHelper from "../helper/ArrayHelper.js";
import CFGSymbol from "./CFGSymbol.js";

export default class CFG {
    /**
     * @param {Variable[]} variables
     * @param {Terminal[]} terminals
     * @param {Rule[]} rules
     * @param {Variable} startVariable
     */
    constructor(variables, terminals, rules, startVariable) {
        if (startVariable === null || typeof startVariable !== "object" || !(startVariable instanceof Variable)) {
            throw new Error("'startVariable' is not of type 'Variable'");
        }
        this._variables = Symbol.sort(ArrayHelper.distinct(variables));
        this._terminals = Symbol.sort(ArrayHelper.distinct(terminals));

        this._rules = ArrayHelper.distinct(rules);
        this._startVariable = startVariable;
    }

    get variables() {
        return this._variables;
    }

    get terminals() {
        return this._terminals;
    }

    get rules() {
        return this._rules;
    }

    get startVariable() {
        return this._startVariable;
    }

    /**
     * @param {Rule[]} rules
     * @param {Variable} startVariable
     * @return CFG
     */
    static fromRules(rules, startVariable = CFGSymbol.S) {
        let variables = [];
        let terminals = [];

        ArrayHelper.distinct(rules).forEach(function (rule) {
            variables.push(rule.inputVariable);
            rule.outputList.forEach(function (symbol) {
                if (symbol instanceof Variable) {
                    variables.push(symbol);
                } else if (symbol instanceof Terminal) {
                    terminals.push(symbol);
                }
            })
        })

        if (!ArrayHelper.contains(variables, startVariable)) {
            throw new Error("Start variable not found in variables");
        }

        return new CFG(variables, terminals, rules, startVariable)
    }

    /* istanbul ignore next */
    toString() {
        return `CFG (V = {${this.variables.map(v => v.toString())}}, Σ = {${this.terminals.map(t => t.toString())}}, R, S = ${this.startVariable}) R: [\n\t${this.rules.map(r => r.toString()).join(',\n\t')}\n]`;
    }
}