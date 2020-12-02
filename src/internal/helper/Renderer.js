import PDA from "../pda/PDA.js";
import State from "../pda/State.js";
import Terminal from "../cfg/Terminal.js";
import Subscript from "./Subscript.js";

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
     * @param {PDA} pda
     */
    /* istanbul ignore next */
    render(pda, forLatex) {
        let dotNotation = Renderer.convertToDotNotation(pda);

        try {
            let innerHTML = Viz(dotNotation, 'svg', 'dot');
            if (forLatex) {
                innerHTML = this.mapToLatex(innerHTML);
            }
            this._graphElement.innerHTML = innerHTML;
        } catch (e) {
            console.error(e);
            this._graphElement.innerHTML = "";
        }
    }

    mapToLatex(html) {

        html = html.replaceAll(/ε/g,'\\varepsilon ');
        html = html.replaceAll(/→/g,'\\rightarrow ');
        html = html.replaceAll(/\$/g,'\\$ ');
        html = html.replaceAll(/<text (.+)>(.+)<\/text>/g,'<text $1>&#36;$2&#36;<\/text>');
        html = html.replaceAll(/<title>(.+)<\/title>/g,'<title>&#36;$1&#36;<\/title>');

        Object.entries(Subscript.SUBSCRIPTS).forEach(([key,value]) => {
            html = html.replaceAll(value, `_{${key}}`);
        })

        return html;
    }

    get graphElement() {
        return this._graphElement;
    }
}