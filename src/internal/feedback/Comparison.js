import InputSymbol from "../pda/InputSymbol.js";

export default class Comparison {
    constructor(targetPDA, studentCFG) {
        this._targetPDA = targetPDA;
        this._studentCFG = studentCFG;
        this._inputSequences = Comparison.generateSequences(targetPDA, studentCFG);
    }

    static between(targetPDA, studentCFG) {
        return new Comparison(targetPDA, studentCFG);
    }

    static generateSequences(targetPDA, studentCFG) {
        let inputSequences = [];

        console.log(targetPDA.accepts([]));
        console.log(targetPDA.accepts([InputSymbol.EPSILON]));
        console.log(targetPDA.accepts([InputSymbol.EPSILON, InputSymbol.EPSILON]));
        console.log(targetPDA.accepts([InputSymbol.EPSILON, InputSymbol.of("a"), InputSymbol.of("a"), InputSymbol.of("b"), InputSymbol.EPSILON]));
        console.log(targetPDA.accepts([InputSymbol.of("a"), InputSymbol.of("a"), InputSymbol.of("b")]));
    }

    generateNotes() {
        return ["note1", "note2"]
    }
}