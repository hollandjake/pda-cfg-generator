import Symbol from "../Symbol.js";

export default class Terminal extends Symbol {
    static s = new Terminal('s');

    constructor(id) {
        super(id);
    }
}