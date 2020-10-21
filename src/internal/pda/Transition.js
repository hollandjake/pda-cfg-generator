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

    constructor(fromState, toState, input, stackHead, stackPush) {
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

    get fromState() {
        return this._fromState;
    }

    get toState() {
        return this._toState;
    }

    get input() {
        return this._input;
    }

    get stackHead() {
        return this._stackHead;
    }

    get stackPush() {
        return this._stackPush;
    }

    /* istanbul ignore next */
    toString() {
        return `(${this.toState}, ${this.stackPush}) ∈ δ(${this.fromState}, ${this.input}, ${this.stackHead})`;
    }
}