// noinspection EqualityComparisonWithCoercionJS,JSUnfilteredForInLoop
export default class ObjectHelper {
    static equals(item1, item2) {
        if (item1 !== Object(item1) || item2 !== Object(item2)) {
            return item1 == item2;
        }

        let keys1 = Object.keys(item1);
        let keys2 = Object.keys(item2);

        if (keys1.toString() !== keys2.toString() && keys1.sort().toString() !== keys2.sort().toString()) {
            return false;
        }

        for (let i = 0, len = keys1.length; i < len; i++) {
            if (!ObjectHelper.equals(item1[keys1[i]], item2[keys1[i]])) {
                return false;
            }
        }
        return true;
    }
}