import Symbol from "../Symbol.js";
import Subscript from "../helper/Subscript.js";

export default class State extends Symbol {
    static p0 = State.p(0);
    static start = State.p("s");
    static accept = State.p("a", true);

    /**
     * @param num
     * @param isAcceptState
     */
    constructor(num, isAcceptState) {
        super("p" + Subscript.of(num));
        this._num = num;
        this._isAcceptState = isAcceptState;
    }

    /* istanbul ignore next */
    get subscript() {
        return this._num;
    }

    /* istanbul ignore next */
    get isAcceptState() {
        return this._isAcceptState;
    }

    /**
     *
     * @param {number|string} num
     * @param {boolean} isAcceptState
     * @returns {State}
     */
    static p(num, isAcceptState = false) {
        return new State(num, isAcceptState);
    }

    withAccept() {
        return new State(this._num, true);
    }

    withoutAccept() {
        return new State(this._num, false);
    }
}