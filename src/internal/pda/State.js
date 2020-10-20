import Symbol from "../Symbol.js";

export default class State extends Symbol {
    static q0 = State.q(0, false);

    /**
     * @param id
     * @param isAcceptState
     */
    constructor(id, isAcceptState) {
        super(id);
        this._isAcceptState = isAcceptState;
    }

    get isAcceptState() {
        return this._isAcceptState;
    }

    /**
     *
     * @param {number} num
     * @param {boolean} isAcceptState
     * @returns {State}
     */
    static q(num, isAcceptState = false) {
        return new State("q" + num, isAcceptState);
    }
}