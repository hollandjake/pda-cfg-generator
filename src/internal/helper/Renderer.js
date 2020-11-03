import PDA from "../pda/PDA.js";

export default class Renderer {
    constructor(graphElement) {
        this._graphElement = graphElement;
    }

    /**
     *
     * @param {PDA} pda
     */
    static convertToDotNotation(pda) {
        return 'digraph {' +
            'rankdir=LR;' +
            `node [shape = circle, color=green]; ${pda.startState.id};` +
            `node [shape = doublecircle, color=black]; ${pda.acceptStates.map(acceptState => acceptState.id).join(" ")};` +
            'node [shape = circle];' +
            `${pda.transitions.map(transition => Renderer.convertTransitionToDotNotation(transition)).join(" ")}` +
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
    /* istanbul ignore next */
    render(pda) {
        let dotNotation = Renderer.convertToDotNotation(pda);
        try {
            this._graphElement.innerHTML = Viz(dotNotation, 'svg', 'dot');
        } catch (e) {
            this._graphElement.innerHTML = e;
        }
    }

    get graphElement() {
        return this._graphElement;
    }
}