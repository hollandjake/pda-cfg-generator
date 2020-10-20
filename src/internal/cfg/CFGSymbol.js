import Variable from "./Variable.js";
import Terminal from "./Terminal.js";

export default class CFGSymbol {
    static S = CFGSymbol.of('S');

    static of(id) {
        if (id.toString().toUpperCase() === id) {
            return new Variable(id.toString());
        } else {
            return new Terminal(id.toString());
        }
    }
}