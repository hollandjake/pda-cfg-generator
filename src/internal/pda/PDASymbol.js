import StackSymbol from "./StackSymbol.js";
import InputSymbol from "./InputSymbol.js";

export default class PDASymbol {
    static of(id) {
        if (id.toString().toUpperCase() === id) {
            return new StackSymbol(id.toString());
        } else {
            return new InputSymbol(id.toString());
        }
    }
}