import Symbol from "../Symbol.js";

export default class InputSymbol extends Symbol {
    static EPSILON = new InputSymbol('ε');

    constructor(id) {
        super(id);
    }

    /**
     * @param id
     * @returns {InputSymbol}
     */
    static of(id) {
        return new InputSymbol(id);
    }
}