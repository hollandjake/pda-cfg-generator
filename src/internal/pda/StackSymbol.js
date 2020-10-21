import Symbol from "../Symbol.js";

export default class StackSymbol extends Symbol {
    static EMPTY_STACK = new StackSymbol('$');
    static EPSILON = new StackSymbol('ε');

    constructor(id) {
        super(id);
    }
}