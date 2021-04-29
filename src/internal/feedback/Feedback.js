export default class Feedback {

    constructor(targetCFG, studentCFG) {
        this._targetCFG = targetCFG;
        this._studentCFG = studentCFG;
        this._notes = this.generateNotes();
    }

    get targetCFG() {
        return this._targetCFG;
    }

    get studentCFG() {
        return this._studentCFG;
    }

    get notes() {
        return this._notes;
    }

    static for(targetCFG, studentCFG) {
        return new Feedback(targetCFG, studentCFG);
    }

    generateNotes() {
        let targetAccepts = this._targetCFG.getAcceptingInputs().map(s => s.join("")).sort().reverse();
        let studentAccepts = this._studentCFG ? this._studentCFG.getAcceptingInputs().map(s => s.join("")).sort().reverse() : [];

        let missingAccepts = targetAccepts.filter(x => !studentAccepts.includes(x));
        let extraAccepts = studentAccepts.filter(x => !targetAccepts.includes(x));

        return missingAccepts.map(missing => `Your query doesn't accept "${missing}", but the answer does`)
            .concat(extraAccepts.map(extra => `Your query accepts "${extra}", when the answer doesn't`));
    }
}