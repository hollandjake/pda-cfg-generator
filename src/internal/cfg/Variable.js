import Symbol from "../Symbol.js";

export default class Variable extends Symbol {
    static S = new Variable('S');

    constructor(id) {
        super(id);
    }
}