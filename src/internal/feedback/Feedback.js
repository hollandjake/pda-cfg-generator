export default class Feedback {

	constructor(targetCFG, studentCFG) {
		this._targetCFG = targetCFG;
		this._studentCFG = studentCFG;
		this._notes = ["First note", "Second note"];

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
}