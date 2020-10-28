import ArrayHelper from "../helper/ArrayHelper.js";
import State from "./State.js";
import Symbol from "../Symbol.js";
import InputSymbol from "./InputSymbol.js";
import StackSymbol from "./StackSymbol.js";
import Transition from "./Transition.js";
import PDASimplify from "./PDASimplify.js";
import ObjectHelper from "../helper/ObjectHelper.js";
import PDAConvert from "./PDAConvert.js";

export default class PDA {
    /**
     * @param {State[]} states (Q)
     * @param {InputSymbol[]} inputAlphabet (Σ)
     * @param {StackSymbol[]} stackAlphabet (Γ)
     * @param {Transition[]} transitions (δ)
     * @param {State} startState (p0)
     * @param {State[]} acceptStates (F)
     */
    constructor(states, inputAlphabet, stackAlphabet, transitions, startState, acceptStates) {
        if (startState === null || typeof startState !== "object" || !(startState instanceof State)) {
            throw new Error("'startState' is not of type 'State'");
        }
        for (let acceptState of acceptStates) {
            if (acceptState === null || typeof acceptState !== "object" || !(acceptState instanceof State)) {
                throw new Error("'acceptStates' contain one non 'State' object");
            }
        }
        this._states = Symbol.sort(ArrayHelper.distinct(states));
        this._inputAlphabet = Symbol.sort(ArrayHelper.distinct(inputAlphabet));
        this._stackAlphabet = Symbol.sort(ArrayHelper.distinct(stackAlphabet));
        this._transitions = ArrayHelper.distinct(transitions);
        this._startState = startState;
        this._acceptStates = Symbol.sort(ArrayHelper.distinct(acceptStates));
        this._ghost_states = [];
        this._ghost_stackAlphabet = [];
    }

    /**
     * @returns {State[]}
     */
    get states() {
        return this._states;
    }

    /**
     * @returns {InputSymbol[]}
     */
    get inputAlphabet() {
        return this._inputAlphabet;
    }

    /**
     * @returns {StackSymbol[]}
     */
    get stackAlphabet() {
        return this._stackAlphabet;
    }

    /**
     * @returns {Transition[]}
     */
    get transitions() {
        return this._transitions;
    }

    /**
     * @returns {State}
     */
    get startState() {
        return this._startState;
    }

    /**
     * @returns {State[]}
     */
    get acceptStates() {
        return this._acceptStates;
    }

    /**
     * @param {Transition[]} transitions
     * @param {State} startState Defaults to {State.p0}
     */
    static fromTransitions(transitions, startState = State.p0) {
        let states = [];
        let inputAlphabet = [];
        let stackAlphabet = [];
        let acceptStates = [];

        ArrayHelper.distinct(transitions).forEach(transition => {
            if (!(transition instanceof Transition)) {
                throw new Error("transition is not of type 'Transition'");
            }
            states.push(transition.fromState, transition.toState);
            inputAlphabet.push(transition.input);
            stackAlphabet.push(transition.stackHead, transition.stackPush);
            if (transition.toState.isAcceptState) {
                acceptStates.push(transition.toState);
            }
        });

        if (!ArrayHelper.contains(states, startState)) {
            throw new Error("Start start not found in transition states");
        }

        return new PDA(states, inputAlphabet, stackAlphabet, transitions, startState, acceptStates);
    }

    toCFG() {
        let pda = this.simplify();
        return PDAConvert.toCFG(pda);
    }

    /**
     * @returns {PDA} expanded PDA
     */
    simplify() {
        return PDASimplify.simplify(this);
    }

    /* istanbul ignore next */
    toString() {
        return `PDA (Q = {${this.states.map(s => s.toString())}}, Σ = {${this.inputAlphabet.map(i => i.toString())}}, Γ = {${this.stackAlphabet.map(s => s.toString())}}, δ, '${this.startState.toString()}' ,F = {${this.acceptStates.map(s => s.toString())}}) δ: [\n\t${this.transitions.map(t => t.toString()).join(',\n\t')}\n]`;
    }

    nextState() {
        let usedStates = Symbol.sort(this.states.concat(this._ghost_states)).reverse();
        if (usedStates.length === 0) {
            usedStates = [State.p(-1)];
        }
        let lastNum = usedStates[0].num;
        let nextState = new State(lastNum+1, false);
        this._ghost_states.push(nextState);
        return nextState;
    }

    /**
     * @returns {StackSymbol}
     */
    nextStackSymbol() {
        let usedSymbols = Symbol.sort(this.stackAlphabet.concat(this._ghost_stackAlphabet)).reverse().filter(s => !ObjectHelper.equals(s,StackSymbol.EPSILON) && !ObjectHelper.equals(s, StackSymbol.EMPTY_STACK));
        if (usedSymbols.length === 0) {
            usedSymbols = [new StackSymbol('A')];
        }
        let lastSymbol = usedSymbols[0].id;
        let nextSymbol = new StackSymbol(String.fromCharCode(lastSymbol.charCodeAt(0)+1));
        this._ghost_stackAlphabet.push(nextSymbol);
        return nextSymbol;
    }
}