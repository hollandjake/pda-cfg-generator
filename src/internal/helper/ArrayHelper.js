import ObjectHelper from "./ObjectHelper.js";

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
     * @param {Array} array
     * @param {*} search
     * @returns {boolean}
     */
    static contains(array, search) {
        return ArrayHelper.find(array, search) !== null
    }

    /**
     * Find an element in an array
     * @param array
     * @param search
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