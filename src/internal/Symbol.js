import ObjectHelper from "./helper/ObjectHelper.js";

export default class Symbol {
    /**
     * @param {String} id
     */
    constructor(id) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    static of(id) {
        return new Symbol(id);
    }

    /**
     * @param {*} x
     * @return {boolean}
     */

    /**
     *
     * @param {Symbol[]} symbols
     */
    static sort(symbols) {
        return symbols.sort((a, b) => {
            if (a.id < b.id) {
                return -1;
            }
            if (a.id > b.id) {
                return 1;
            }
            return 0;
        });
    }

    /* istanbul ignore next */
    equals(x) {
        return ObjectHelper.equals(this, x);
    }

    /* istanbul ignore next */
    toString() {
        return this.id;
    }
}