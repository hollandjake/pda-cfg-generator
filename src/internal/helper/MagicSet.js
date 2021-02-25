import MagicMap from "./MagicMap.js";

export default class MagicSet extends Set {
    constructor() {
        super();
        this._map = new MagicMap();
        this[Symbol.iterator] = this.values;
    }

    add(item) {
        if (!this._map.has(item)) {
            this._map.set(item, item);
        }
        return this;
    }

    has(item) {
        return this._map.has(item);
    }

    values() {
        return this._map.values();
    }

    delete(item) {
        this._map.delete(item);
    }
}