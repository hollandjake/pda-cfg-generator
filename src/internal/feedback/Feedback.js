import Comparison from "./Comparison.js";

export default class Feedback {

    constructor(targetPDA, studentCFG) {
        this._studentCFG = studentCFG;
        this._comparison = Comparison.between(targetPDA, studentCFG);
        this._notes = this._comparison.generateNotes();
    }

    get studentCFG() {
        return this._studentCFG;
    }

    get notes() {
        return this._notes;
    }

    static for(targetPDA, studentCFG) {
        return new Feedback(targetPDA, studentCFG);
    }
}