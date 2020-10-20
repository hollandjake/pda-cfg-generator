import Symbol from "../Symbol.js";

export default class Terminal extends Symbol {
    constructor(id) {
        super(id);
    }

    /* istanbul ignore next */
    toString() {
        return this.id;
    }
}