import ArrayHelper from "../helper/ArrayHelper.js";
import State from "./State.js";
import Symbol from "../Symbol.js";
import InputSymbol from "./InputSymbol.js";
import StackSymbol from "./StackSymbol.js";

export default class PDA {
    /**
     * @param {State[]} states (Q)
     * @param {InputSymbol[]} inputAlphabet (Σ)
     * @param {StackSymbol[]} stackAlphabet (Γ)
     * @param {Transition[]} transitions (δ)
     * @param {State} startState (q0)
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
    }

    get states() {
        return this._states;
    }

    get inputAlphabet() {
        return this._inputAlphabet;
    }

    get stackAlphabet() {
        return this._stackAlphabet;
    }

    get transitions() {
        return this._transitions;
    }

    get startState() {
        return this._startState;
    }

    get acceptStates() {
        return this._acceptStates;
    }

    /**
     * @param {Transition[]} transitions
     * @param {State} startState Defaults to {State.q0}
     */
    static fromTransitions(transitions, startState = State.q0) {
        let states = [];
        let inputAlphabet = [];
        let stackAlphabet = [StackSymbol.EMPTY_STACK];
        let acceptStates = [];

        ArrayHelper.distinct(transitions).forEach(transition => {
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

        return new PDA(states, inputAlphabet, stackAlphabet, transitions, startState, acceptStates)
    }

    /* istanbul ignore next */
    toString() {
        return `PDA (Q = {${this.states.map(s => s.toString())}}, Σ = {${this.inputAlphabet.map(i => i.toString())}}, Γ = {${this.stackAlphabet.map(s => s.toString())}}, δ, '${this.startState.toString()}' ,F = {${this.acceptStates.map(s => s.toString())}}) δ: [\n\t${this.transitions.map(t => t.toString()).join(',\n\t')}\n]`;
    }
}