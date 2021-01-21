import Symbol from "../Symbol.js";
import ArrayHelper from "../helper/ArrayHelper.js";
import Variable from "./Variable.js";
import Rule from "./Rule.js";
import ObjectHelper from "../helper/ObjectHelper.js";
import Terminal from "./Terminal.js";

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

        this._rules = Rule.sort(ArrayHelper.distinct(rules));
        this._startVariable = startVariable;
        this._ghost_variables = [];
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
     *
     * @return CFG
     */
    static fromRules(rules, startVariable = Variable.S) {
        let variables = [];
        let terminals = [];

        rules.forEach(function (rule) {
            variables.push(rule.inputVariable);
            rule.outputList.forEach(symbol => {
                if (symbol instanceof Variable) {
                    variables.push(symbol);
                } else if (symbol instanceof Terminal) {
                    terminals.push(symbol);
                } else {
                    throw new Error("One of the Rule's outputList elements isn't supported, please use 'Terminal' or  'Variable'");
                }
            })
        })

        if (!ArrayHelper.contains(variables, startVariable)) {
            throw new Error("Start variable not found in variables");
        }

        return new CFG(variables, terminals, rules, startVariable);
    }

    /**
     * Convert a string into a CFG using the following format
     * <Rule>,<Rule>,<Rule>
     * Or
     * <Rule>\n<Rule>\n<Rule>
     *
     * @param {String} inputString
     * @returns {CFG}
     */
    static fromString(inputString) {
        if (inputString !== null && inputString.length > 0) {
            let ruleStrings = inputString.split(/[,\n]/);

            let rules = ruleStrings.map(rule => Rule.fromString(rule)).filter(rule => rule !== null);

            if (rules.length > 0) {
                let startVariable = rules[0].inputVariable;

                return CFG.fromRules(rules, startVariable);
            }
        }

        return null;
    }

    nextVariable() {
        let usedVariables = Symbol.sort(this.variables.concat(this._ghost_variables)).reverse().filter(s => !ObjectHelper.equals(s, Variable.S) && !ObjectHelper.equals(s, Variable.S0));
        if (usedVariables.length === 0) {
            usedVariables = [new Variable(String.fromCharCode(64))];
        }
        let lastVariable = usedVariables[0].id;
        let nextCharCode = lastVariable.charCodeAt(0) + 1;
        if (nextCharCode === 83) {
            nextCharCode = 84
        }
        let nextVariable = new Variable(String.fromCharCode(nextCharCode));
        this._ghost_variables.push(nextVariable);
        return nextVariable;
    }

    /* istanbul ignore next */
    toString() {
        return `CFG (V = {${this.variables.map(v => v.toString())}}, Σ = {${this.terminals.map(t => t.toString())}}, R, S = ${this.startVariable}) R: [\n\t${this.rules.filter(r => ObjectHelper.equals(r.inputVariable, this.startVariable)).map(r => r.toString()).join(',\n\t')},\n\t${this.rules.filter(r => !ObjectHelper.equals(r.inputVariable, this.startVariable)).map(r => r.toString()).join(',\n\t')}\n]`;
    }
}