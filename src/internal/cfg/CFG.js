import Symbol from "../Symbol.js";
import ArrayHelper from "../helper/ArrayHelper.js";
import Variable from "./Variable.js";
import Rule from "./Rule.js";
import Terminal from "./Terminal.js";
import CFGNormalise from "./CFGNormalise.js";
import CFGSimplify from "./CFGSimplify.js";
import CFT from "../cft/CFT.js";
import CFGRemapper from "./CFGRemapper.js";

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

    remap() {
        return CFGRemapper.remap(this);
    }

    normalise() {
        return CFGNormalise.normalise(this);
    }

    simplify() {
        return CFGSimplify.simplify(this);
    }

    /**
     * @param maxLength
     * @returns {[[Terminal]]}
     */
    getAcceptingInputs(maxLength = 50) {
        return CFT.fromCFG(this.normalise(), maxLength + 10).filter(sequence => sequence.length <= maxLength);
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

    nextVariable() {
        let usedVariables = Symbol.sort(this.variables.concat(this._ghost_variables)).reverse().filter(s => !Variable.S.equals(s) && !Variable.S0.equals(s));
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

    generateVariableStrings() {
        return [
            `${this.startVariable.toString()} -> ${this.rules.filter(r => this.startVariable.equals(r.inputVariable)).map(r => r.outputString()).join(' | ')}`,
            this.variables.filter(v => !v.equals(this.startVariable)).map(v => {
                return `${v.toString()} -> ${this.rules.filter(r => r.inputVariable.equals(v)).map(r => r.outputString()).join(' | ')}`;
            })
        ]
    }

    /* istanbul ignore next */
    toString() {
        let [startVariableString, otherVariableStrings] = this.generateVariableStrings();
        return `CFG (V = {${this.variables.map(v => v.toString())}}, Σ = {${this.terminals.map(t => t.toString())}}, R, S = ${this.startVariable}) R: [\n\t${
            startVariableString
        },\n\t${
            otherVariableStrings.join(',\n\t')
        }\n]`;
    }
}