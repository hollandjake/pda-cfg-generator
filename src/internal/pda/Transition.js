import State from "./State.js";
import Symbol from "../Symbol.js";

export default class Transition {
    /**
     * @param {State} fromState
     * @param {State} toState
     * @param {Symbol} input
     * @param {Symbol} stackHead
     * @param {Symbol} stackPush
     */

    constructor(fromState, toState, input, stackHead, stackPush) {
        if (fromState === null || typeof fromState !== "object" || !(fromState instanceof State)) {
            throw new Error("'fromState' is not of type 'State'");
        }

        if (toState === null || typeof toState !== "object" || !(toState instanceof State)) {
            throw new Error("'toState' is not of type 'State'");
        }

        if (input === null || typeof input !== "object" || !(input instanceof Symbol)) {
            throw new Error("'input' is not of type 'Symbol'");
        }

        if (stackHead === null || typeof stackHead !== "object" || !(stackHead instanceof Symbol)) {
            throw new Error("'stackHead' is not of type 'Symbol'");
        }

        if (stackPush === null || typeof stackPush !== "object" || !(stackPush instanceof Symbol)) {
            throw new Error("'stackPush' is not of type 'Symbol'");
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