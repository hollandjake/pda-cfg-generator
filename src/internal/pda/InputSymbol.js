import Symbol from "../Symbol.js";

export default class InputSymbol extends Symbol {
    static EPSILON = new InputSymbol('ε');

    constructor(id) {
        super(id);
    }
}