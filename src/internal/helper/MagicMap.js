import ArrayHelper from "./ArrayHelper.js";

export default class MagicMap extends Map {
    has(key) {
        return ArrayHelper.contains(Array.from(super.keys()), key);
    }

    get(key) {
        let keys = Array.from(super.keys());
        return super.get(keys[ArrayHelper.find(keys, key)]);
    }
}