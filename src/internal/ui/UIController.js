import Renderer from "../helper/Renderer.js";
import PDAGenerator from "../generator/PDAGenerator.js";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default class UIController {
    constructor() {
        this._pdaContainer = document.getElementById("pda");
        this._questionContainer = document.getElementById("question");
        this._pdaRenderer = new Renderer(this._pdaContainer);
        this._answerBox = document.getElementById("answer-box");
        this._feedbackBox = document.getElementById("feedback");
        this._scoreBox = document.getElementById("score");
        this._correctAnswerBox = document.getElementById("correct_answer");
        this._difficultyDisplay = document.getElementById("current_difficulty");
        this._difficulty = 1;
    }

    get difficulty() {
        return this._difficulty;
    }

    /**
     * @return {(PDA|CFG)[]}
     */
    generatePDA(difficulty) {
        this._difficultyDisplay.innerText = this.difficulty;

        if (this._questionContainer.classList.contains('active')) {
            this._questionContainer.classList.remove('active');
            this._questionContainer.classList.add('disable');
            this.hideFeedback();
        }

        let pda = PDAGenerator.generatePDA(difficulty);

        this._questionContainer.classList.remove('disable');
        this._pdaRenderer.render(pda);
        sleep(100).then(() => this._questionContainer.classList.add('active')); // Give it some time to load image

        return [pda, pda.toCFG().remap()];
    }

    showFeedback(feedback) {
        this._scoreBox.innerHTML = "";
        this._correctAnswerBox.innerHTML = "";
        this._feedbackBox.innerHTML = "";

        let startVariable = feedback.targetCFG.startVariable;
        this.appendChild(this._correctAnswerBox, startVariable, 'Start Symbol: ');

        let [startVariableString, otherVariableStrings] = feedback.targetCFG.generateVariableStrings();

        this.appendChild(
            this._correctAnswerBox,
            startVariableString
        );

        otherVariableStrings.forEach(v => {
            this.appendChild(this._correctAnswerBox, v)
        })

        this.appendChild(this._scoreBox, `Score: ${feedback.score}%\n`)

        if (feedback.notes.length === 0) {
            this.appendChild(this._feedbackBox, "Congratulations you got it correct!");
        } else {
            feedback.notes.forEach(note => {
                this.appendChild(this._feedbackBox, note);
            })
        }

        let panel = this._answerBox;
        panel.style.maxHeight = panel.scrollHeight + "px";
        panel.style.border = "none";
    }

    hideFeedback() {
        let panel = this._answerBox;
        panel.style.maxHeight = null;
        panel.style.border = null;
    }

    updateDifficulty(n) {
        this._difficulty = Math.max(Math.min(this._difficulty + n, 10), 1);

        return this._difficulty;
    }

    appendChild(parent, child, extraText = '') {
        let element = document.createElement('li');
        element.innerText = extraText + child.toString();
        parent.append(element);
    }
}