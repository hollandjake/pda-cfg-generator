import UIController from "./internal/ui/UIController.js";
import Feedback from "./internal/feedback/Feedback.js";
import CFG from "./internal/cfg/CFG.js";


document.addEventListener('DOMContentLoaded', () => {
    let uiController = new UIController();

    let [targetPDA, targetCFG] = uiController.generateNewPDA(uiController.difficulty);
    let userInputField = document.getElementById("cfg-input");

    document.getElementById("submit").addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        let feedback = Feedback.for(targetCFG, CFG.fromString(userInputField.innerText));
        uiController.showFeedback(feedback);
    })

    document.getElementById("new_question_button_easier").addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        [targetPDA, targetCFG] = uiController.generateNewPDA(uiController.updateDifficulty(-1));
    });

    document.getElementById("new_question_button_same").addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        [targetPDA, targetCFG] = uiController.generateNewPDA(uiController.difficulty);
    });
    document.getElementById("new_question_button_harder").addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        [targetPDA, targetCFG] = uiController.generateNewPDA(uiController.updateDifficulty(+1));
    });
})
