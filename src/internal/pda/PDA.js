import ArrayHelper from "../helper/ArrayHelper.js";
import State from "./State.js";
import Symbol from "../Symbol.js";
import Transition from "./Transition.js";
import ObjectHelper from "../helper/ObjectHelper.js";
import StackSymbol from "./StackSymbol.js";
import InputSymbol from "./InputSymbol.js";

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
     * @param {Transition[]} transitions
     * @param {State} startState Defaults to {State.p0}
     */
    static fromTransitions(transitions, startState = State.p0) {
        let states = [];
        let inputAlphabet = [];
        let stackAlphabet = [];
        let acceptStates = [];

        transitions = ArrayHelper.distinct(transitions);

        transitions.forEach(transition => {
            if (!(transition instanceof Transition)) {
                throw new Error("transition is not of type 'Transition'");
            }
            if (transition.toState.isAcceptState) {
                acceptStates.push(transition.toState);
            }
        });

        transitions = transitions.map(transition => {
            let fromState = transition.fromState;
            let toState = transition.toState;
            acceptStates.forEach(acceptState => {
                if (acceptState.id === fromState.id) {
                    fromState = acceptState;
                }

                if (acceptState.id === toState.id) {
                    toState = acceptState;
                }
            })
            states.push(fromState, toState);
            inputAlphabet.push(transition.input);
            stackAlphabet.push(transition.stackHead, transition.stackPush);
            return new Transition(fromState, toState, transition.input, transition.stackHead, transition.stackPush);
        })

        if (!ArrayHelper.contains(states, startState)) {
            throw new Error("Start start not found in transition states");
        }

        return new PDA(states, inputAlphabet, stackAlphabet, transitions, startState, acceptStates);
    }

    /**
     *
     * @param {InputSymbol[]} inputSequence
     * @param {State} state
     * @param {StackSymbol[]} stack
     */
    accepts(inputSequence, state = this._startState, stack = []) {
        inputSequence = inputSequence.filter(i => !InputSymbol.EPSILON.equals(i));
        if (inputSequence.length === 0 && state.isAcceptState) {
            return true;
        }

        let input = inputSequence.shift();
        let stackHead = stack.pop();

        return this._transitions
            .filter(t => ObjectHelper.equals(state, t.fromState)) //Get all transitions coming from the state
            .filter(t => InputSymbol.EPSILON.equals(t.input) || ObjectHelper.equals(input, t.input))
            .filter(t => StackSymbol.EPSILON.equals(t.stackHead) || ObjectHelper.equals(stackHead, t.stackHead))
            .some(t => {
                let newStack = [...stack];
                let newInputSequence = [...inputSequence];

                if (InputSymbol.EPSILON.equals(t.input)) {
                    if (input && !InputSymbol.EPSILON.equals(input)) {
                        newInputSequence.unshift(input);
                    }
                }

                if (StackSymbol.EPSILON.equals(t.stackHead)) {
                    if (stackHead) {
                        newStack.push(stackHead);
                    }
                }

                if (!StackSymbol.EPSILON.equals(t.stackPush)) {
                    newStack.push(t.stackPush);
                }

                return this.accepts(newInputSequence, t.toState, newStack);
            })
    }

    /* istanbul ignore next */
    toString() {
        return `PDA (Q = {${this.states.map(s => s.toString())}}, Σ = {${this.inputAlphabet.map(i => i.toString())}}, Γ = {${this.stackAlphabet.map(s => s.toString())}}, δ, '${this.startState.toString()}' ,F = {${this.acceptStates.map(s => s.toString())}}) δ: [\n\t${this.transitions.map(t => t.toString()).join(',\n\t')}\n]`;
    }
}