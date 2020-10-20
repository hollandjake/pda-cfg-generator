// noinspection EqualityComparisonWithCoercionJS,JSUnfilteredForInLoop
export default class ObjectHelper {
    static equals(item1, item2) {
        if (item1 !== Object(item1) && item2 !== Object(item2)) {
            return item1 == item2;
        }

        for (let prop in item1) {
            if (!ObjectHelper.equals(item1[prop], item2[prop])) {
                return false;
            }
        }

        for (let prop in item2) {
            if (!ObjectHelper.equals(item1[prop], item2[prop])) {
                return false;
            }
        }
        return true;
    }
}