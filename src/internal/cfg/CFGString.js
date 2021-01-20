import Variable from "./Variable.js";
import Terminal from "./Terminal.js";
import Subscript from "../helper/Subscript.js";

export default class CFGString {
    static of(id, subscript) {
        let stringId = id.toString();
        if (stringId !== 'ε' && stringId.toUpperCase() === id) {
            return new Variable(stringId, subscript);
        } else {
            return new Terminal(stringId, subscript);
        }
    }

    static from(string) {
        let output = []
        let stringArr = string.split('');
        for (let i = 0, len = stringArr.length; i < len; i++) {
            let key = Subscript.getKey(stringArr[i + 1]);
            if ((i < len - 1) && key) {
                output.push(this.of(stringArr[i], key));
                i++;
            } else {
                output.push(this.of(stringArr[i]));
            }
        }
        return output;
    }
}