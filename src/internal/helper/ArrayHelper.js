import ObjectHelper from "./ObjectHelper.js";
import MagicMap from "./MagicMap.js";

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
        let newArray = [];

        array.forEach(item => ArrayHelper.push_distinct(newArray, item));

        return newArray;
    }
}