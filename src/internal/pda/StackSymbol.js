import Symbol from "../Symbol.js";

export default class StackSymbol extends Symbol {
    static EMPTY_STACK = new StackSymbol('$');
    static EPSILON = new StackSymbol('ε');
    static FILL = new StackSymbol('%');
    static NEW_STACK_SYMBOL = new StackSymbol('@');

    constructor(id) {
        super(id);
    }

    /**
     * @param id
     * @returns {StackSymbol}
     */
    static of(id) {
        return new StackSymbol(id);
    }
}