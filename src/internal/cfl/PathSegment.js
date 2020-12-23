import Superscript from "../helper/Superscript.js";
import ObjectHelper from "../helper/ObjectHelper.js";
import Terminal from "../cfg/Terminal.js";
import Symbol from "../Symbol.js";

export default class PathSegment extends Symbol {
    constructor(superscript, data) {
        super(PathSegment.calculateId(superscript, data));
        this._data = data;
        this._superscript = superscript;
    }

    get data() {
        return this._data;
    }

    get superscript() {
        return this._superscript;
    }

    static withSuperscript(superscript, ...data) {
        return new PathSegment(superscript, data);
    }

    static from(...data) {
        return new PathSegment(1, data);
    }

    static calculateId(superscript, data) {
        let map = data.map(x => {
            if (x instanceof Array) {
                return x.join("");
            } else if (!ObjectHelper.equals(x, Terminal.EPSILON)) {
                return x.toString();
            } else {
                return "";
            }
        });

        if (map.length === 0) {
            return ""
        }

        let superscriptString = "";
        if (superscript > 1) {
            superscriptString = Superscript.of(superscript + "n");
        } else if (superscript === 1) {
            superscriptString = Superscript.of('n');
        } else {
            return map.join('');
        }

        return `{${map.join('')}}${superscriptString}`;
    }

    /* istanbul ignore next */
    toString() {
        return this.id;
    }
}