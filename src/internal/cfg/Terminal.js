import Symbol from "../Symbol.js";

export default class Terminal extends Symbol {
    static s = new Terminal('s');
    static EPSILON = new Terminal('ε');

    constructor(id) {
        super(id);
    }

    /**
     * @param id
     * @returns {Terminal}
     */
    static of(id) {
        return new Terminal(id);
    }
}