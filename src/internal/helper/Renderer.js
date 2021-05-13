import Subscript from "./Subscript.js";

export default class Renderer {
    constructor(graphElement) {
        this._graphElement = graphElement;
    }

    get graphElement() {
        return this._graphElement;
    }

    /**
     *
     * @param {PDA} pda
     */
    static convertToDotNotation(pda) {
        return 'digraph {' +
            'rankdir=LR;' +
            `node [shape = circle, color=green]; ${pda.startState.id};` +
            (pda.acceptStates.length > 0 ? `node [shape = doublecircle, color=black]; ${pda.acceptStates.map(acceptState => acceptState.id).join(" ")};` : '') +
            'node [shape = circle, color=black];' +
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
     * @param {string} html
     */
    static mapToLatex(html) {

        html = html.replace(/ε/g, '\\varepsilon ');
        html = html.replace(/→/g, '\\rightarrow ');
        html = html.replace(/\$/g, '\\$ ');
        html = html.replace(/<text (.+)>(.+)<\/text>/g, '<text $1>&#36;$2&#36;<\/text>');
        html = html.replace(/<title>(.+)<\/title>/g, '<title>&#36;$1&#36;<\/title>');

        Object.entries(Subscript.SUBSCRIPTS).forEach(([key, value]) => {
            html = html.replace(new RegExp(value, 'g'), `_{${key}}`);
        })

        return html;
    }

    /* istanbul ignore next */
    /**
     * @param {PDA} pda
     * @param {boolean} forLatex
     */
    render(pda, forLatex = false) {
        let dotNotation = Renderer.convertToDotNotation(pda);

        try {
            let innerHTML = Viz(dotNotation, 'svg', 'dot');
            if (forLatex) {
                innerHTML = Renderer.mapToLatex(innerHTML);
            }
            this._graphElement.innerHTML = innerHTML;
        } catch (e) {
            console.error(e);
            this._graphElement.innerHTML = "";
        }
    }
}