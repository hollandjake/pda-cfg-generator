import State from "./State.js";
import InputSymbol from "./InputSymbol.js";
import StackSymbol from "./StackSymbol.js";

export default class Transition {
    /**
     * @param {State} fromState
     * @param {State} toState
     * @param {InputSymbol} input
     * @param {StackSymbol} stackHead
     * @param {StackSymbol} stackPush
     */
    constructor(fromState, toState, input = InputSymbol.EPSILON, stackHead = StackSymbol.EPSILON, stackPush = StackSymbol.EPSILON) {
        if (fromState === null || typeof fromState !== "object" || !(fromState instanceof State)) {
            throw new Error("'fromState' is not of type 'State'");
        }

        if (toState === null || typeof toState !== "object" || !(toState instanceof State)) {
            throw new Error("'toState' is not of type 'State'");
        }

        if (input === null || typeof input !== "object" || !(input instanceof InputSymbol)) {
            throw new Error("'input' is not of type 'InputSymbol'");
        }

        if (stackHead === null || typeof stackHead !== "object" || !(stackHead instanceof StackSymbol)) {
            throw new Error("'stackHead' is not of type 'StackSymbol'");
        }

        if (stackPush === null || typeof stackPush !== "object" || !(stackPush instanceof StackSymbol)) {
            throw new Error("'stackPush' is not of type 'StackSymbol'");
        }

        this._fromState = fromState;
        this._toState = toState;
        this._input = input;
        this._stackHead = stackHead;
        this._stackPush = stackPush;
    }

    /* istanbul ignore next */
    /**
     * @returns {State}
     */
    get fromState() {
        return this._fromState;
    }

    /* istanbul ignore next */
    /**
     * @returns {State}
     */
    get toState() {
        return this._toState;
    }

    /* istanbul ignore next */
    /**
     * @returns {InputSymbol}
     */
    get input() {
        return this._input;
    }

    /* istanbul ignore next */
    /**
     * @returns {StackSymbol}
     */
    get stackHead() {
        return this._stackHead;
    }

    /* istanbul ignore next */
    /**
     * @returns {StackSymbol}
     */
    get stackPush() {
        return this._stackPush;
    }

    /* istanbul ignore next */
    toString() {
        return `(${this.toState}, ${this.stackPush}) ∈ δ(${this.fromState}, ${this.input}, ${this.stackHead})`;
    }

    /**
     *
     * @param {Transition[]} transitions
     * @returns Transition[]
     */
    static sort(transitions) {
        if (transitions.length === 1) {
            return [transitions[0]];
        }
        // noinspection DuplicatedCode
        return transitions.sort((a, b) => {
            if (a.fromState.id < b.fromState.id) {
                return -1;
            }
            if (a.fromState.id > b.fromState.id) {
                return 1;
            }

            if (a.toState.id < b.toState.id) {
                return -1;
            }
            if (a.toState.id > b.toState.id) {
                return 1;
            }

            if (a.input.id < b.input.id) {
                return -1;
            }
            if (a.input.id > b.input.id) {
                return 1;
            }

            if (a.stackHead.id < b.stackHead.id) {
                return -1;
            }
            if (a.stackHead.id > b.stackHead.id) {
                return 1;
            }

            if (a.stackPush.id < b.stackPush.id) {
                return -1;
            }
            if (a.stackPush.id > b.stackPush.id) {
                return 1;
            }

            return 0;
        });
    }

    isEasy() {
        return (StackSymbol.EPSILON.equals(this.stackPush) && StackSymbol.EPSILON.equals(this.stackHead)) || (!StackSymbol.EPSILON.equals(this.stackPush) && !StackSymbol.EPSILON.equals(this.stackHead));
    }

    withoutAccept() {
        return new Transition(this.fromState.withoutAccept(), this.toState.withoutAccept(), this.input, this.stackHead, this.stackPush);
    }
}