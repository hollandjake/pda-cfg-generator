import ObjectHelper from "./ObjectHelper.js";
import MagicMap from "./MagicMap.js";
import MagicSet from "./MagicSet.js";

export default class ArrayHelper {
    /**
     * Push a value to array only if the value doesnt exist already (Set)
     *
     * @param {Array} array
     * @param {*} item
     */
    static push_distinct(array, item) {
        if (!ArrayHelper.contains(array, item)) {
            array.push(item);
        }
    }

    /**
     * Returns whether the array contains the search item, this can be both a primitive and an object
     *
     * @param {[]} array
     * @param {*} search
     * @returns {boolean}
     */
    static contains(array, search) {
        return ArrayHelper.find(array, search) !== null
    }

    /**
     * Find an element in an array
     * @param {[]} array
     * @param {*} search
     * @returns {null|number}
     */
    static find(array, search) {
        for (let i = 0, len = array.length; i < len; i++) {
            if (ObjectHelper.equals(array[i], search)) {
                return i;
            }
        }
        return null;
    }

    /**
     *
     * @param {[]} array
     * @param {*} search
     * @return {[]} list of indices
     */
    static findAll(array, search) {
        let found = [];
        for (let i = 0, len = array.length; i < len; i++) {
            if (ObjectHelper.equals(array[i], search)) {
                found.push(i);
            }
        }
        return found;
    }

    /**
     *
     * @param {[]} array
     * @param {[]} searchList
     * @return {MagicMap} map of indices to their matching item
     */
    static findAllFrom(array, searchList) {
        let found = new MagicMap();
        for (let i = 0, len = array.length; i < len; i++) {
            if (ArrayHelper.contains(searchList, array[i])) {
                found.set(i, array[i]);
            }
        }
        return found;
    }

    /**
     *
     * @param {[]} array
     * @return {[]}
     */
    static powerSet(array) {
        let powerSet = [];

        let length = array.length;
        for (let i = 1; i < (1 << length); i++) {
            let combination = [];

            for (let j = 0; j < length; j++) {
                if (i & (1 << j)) {
                    combination.push(array[j]);
                }
            }
            powerSet.push(combination);
        }

        return powerSet;
    }

    /**
     * Selected the distinct elements in an array and returns a new array containing those elements
     *
     * @param {Array} array
     * @returns {Array}
     */
    static distinct(array) {
        let set = new MagicSet();
        array.forEach(item => set.add(item))
        return Array.from(set);
    }

    /**
     * @param {[]} array1
     * @param {[]} array2
     * @returns {boolean}
     */
    static equals(array1, array2) {
        if (array1 === array2) {
            return true;
        }
        if (array1 === null || array2 === null) {
            return false;
        }

        if (array1.length !== array2.length) {
            return false;
        }

        let aMap = new MagicMap();
        let bMap = new MagicMap();

        array1.forEach(i => {
            if (aMap.has(i)) {
                aMap.set(i, aMap.get(i) + 1)
            } else {
                aMap.set(i, 1);
            }
        })

        array2.forEach(i => {
            if (bMap.has(i)) {
                bMap.set(i, bMap.get(i) + 1)
            } else {
                bMap.set(i, 1);
            }
        })

        let keys = Array.from(aMap.keys());
        for (let i = 0; i < keys.length; i++) {
            if (!bMap.has(keys[i]) || bMap.get(keys[i]) !== aMap.get(keys[i])) {
                return false;
            }
        }
        return true;
    }

    static fast_distinct(array) {
        let map = new Map();

        array.forEach(e => map.set(e.toString(), e));
        return Array.from(map.values());
    }
}