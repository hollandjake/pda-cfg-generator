import Symbol from "../Symbol.js";
import Subscript from "../helper/Subscript.js";

export default class Variable extends Symbol {
    static S = new Variable('S');
    static S0 = new Variable('S', 0);

    constructor(id, subscript) {
        if (subscript !== null && subscript !== undefined) {
            super(id + Subscript.of(subscript));
        } else {
            super(id);
        }
    }

    /**
     * @param id
     * @param subscript
     * @return {Variable}
     */
    static of(id, subscript) {
        return new Variable(id, subscript);
    }

    sub(subscript) {
        return new Variable(this.id, subscript);
    }
}