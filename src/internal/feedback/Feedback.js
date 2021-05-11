export default class Feedback {
    _targetCFG;
    _studentCFG;
    _notes;
    _score;

    constructor(targetCFG, studentCFG) {
        this._targetCFG = targetCFG;
        this._studentCFG = studentCFG;
        [this._score, this._notes] = this.generateNotes();
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

    get score() {
        return this._score;
    }

    static for(targetCFG, studentCFG) {
        return new Feedback(targetCFG, studentCFG);
    }

    generateNotes() {
        let targetAccepts = this._targetCFG.getAcceptingInputs().map(s => s.join("")).sort().sort((a, b) => a.length - b.length);
        let studentAccepts = this._studentCFG ? this._studentCFG.getAcceptingInputs().map(s => s.join("")).sort().sort((a, b) => a.length - b.length) : [];

        let missingAccepts = targetAccepts.filter(x => !studentAccepts.includes(x));
        let extraAccepts = studentAccepts.filter(x => !targetAccepts.includes(x));

        let score = Math.round((1 - (missingAccepts.length + extraAccepts.length) / (studentAccepts.length + targetAccepts.length)) * 100);

        let notes = [score, missingAccepts.map(missing => `Your query doesn't accept "${missing}", but the answer does`)
            .concat(["\n"])
            .concat(extraAccepts.map(extra => `Your query accepts "${extra}", when the answer doesn't`))];

        if (notes[1].length === 1) {
            return [notes[0], []];
        } else {
            return notes;
        }
    }
}