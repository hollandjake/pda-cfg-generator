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
        for (let item of array) {
            if (ObjectHelper.equals(item, search)) {
                return true;
            }
        }
        return false;
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