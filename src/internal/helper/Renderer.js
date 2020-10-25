import PDA from "../pda/PDA.js";

export default class Renderer {
    constructor(graphElement) {
        this._graphElement = graphElement;
    }

    /**
     *
     * @param {PDA} pda
     */
    convertToDotNotation(pda) {
        return 'digraph {' +
            'rankdir=LR;' +
            `node [shape = circle, color=green]; ${pda.startState.id};` +
            `node [shape = doublecircle, color=black]; ${pda.acceptStates.map(acceptState => acceptState.id).join(" ")};` +
            'node [shape = circle];' +
            `${pda.transitions.map(transition => Renderer.convertTransitionToDotNotation(transition)).join("\n")}` +
            '}'
    }

    /**
     *
     * @param {Transition} transition
     * @returns {*}
     */
    static convertTransitionToDotNotation(transition) {
        return `${transition.fromState.id} -> ${transition.toState.id} [label = "${transition.input}, ${transition.stackHead} → ${transition.stackPush}", color = black ];`;
    }

    /**
     * @param {PDA} pda
     */
    render(pda) {
        let dotNotation = this.convertToDotNotation(pda);
        try {
            let result = Viz(dotNotation, 'svg', 'dot');
            this._graphElement.innerHTML = result;
        } catch (e) {
            this._graphElement.innerHTML = e;
        }
    }
}