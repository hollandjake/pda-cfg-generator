import ArrayHelper from "../helper/ArrayHelper.js";
import State from "./State.js";
import Symbol from "../Symbol.js";
import Transition from "./Transition.js";
import PDAConvert from "./PDAConvert.js";
import CFGSimplify from "../cfg/CFGSimplify.js";

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
        this._transitions = Transition.sort(ArrayHelper.distinct(transitions));
        this._startState = startState;
        this._acceptStates = Symbol.sort(ArrayHelper.distinct(acceptStates));
        this._generatedStates = [];
    }

    /* istanbul ignore next */
    /**
     * @return {CFG}
     */
    toCFG() {
        return CFGSimplify.simplify(PDAConvert.toCFG(this));
    }

    isEasy() {
        return this.startState.equals(State.start) &&
            this.acceptStates.length === 1 &&
            this.acceptStates[0].equals(State.accept) &&
            this.transitions.every(t => t.isEasy());
    }

    /* istanbul ignore next */
    /**
     * @returns {State[]}
     */
    get states() {
        return this._states;
    }

    /* istanbul ignore next */
    /**
     * @returns {InputSymbol[]}
     */
    get inputAlphabet() {
        return this._inputAlphabet;
    }

    /* istanbul ignore next */
    /**
     * @returns {StackSymbol[]}
     */
    get stackAlphabet() {
        return this._stackAlphabet;
    }

    /* istanbul ignore next */
    /**
     * @returns {Transition[]}
     */
    get transitions() {
        return this._transitions;
    }

    /* istanbul ignore next */
    /**
     * @returns {State}
     */
    get startState() {
        return this._startState;
    }

    /* istanbul ignore next */
    /**
     * @returns {State[]}
     */
    get acceptStates() {
        return this._acceptStates;
    }

    /**
     * @returns {State}
     */
    generateNewState() {
        let newState = State.p(-1 * (this._generatedStates.length + 1));
        this._generatedStates.push(newState);

        return newState;
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

    /* istanbul ignore next */
    toString() {
        return `PDA (Q = {${this.states.map(s => s.toString())}}, Σ = {${this.inputAlphabet.map(i => i.toString())}}, Γ = {${this.stackAlphabet.map(s => s.toString())}}, δ, '${this.startState.toString()}' ,F = {${this.acceptStates.map(s => s.toString())}}) δ: [\n\t${this.transitions.map(t => t.toString()).join(',\n\t')}\n]`;
    }
}