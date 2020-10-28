import Renderer from "../../../src/internal/helper/Renderer.js";
import Transition from "../../../src/internal/pda/Transition.js";
import State from "../../../src/internal/pda/State.js";
import InputSymbol from "../../../src/internal/pda/InputSymbol.js";
import StackSymbol from "../../../src/internal/pda/StackSymbol.js";
import PDA from "../../../src/internal/pda/PDA.js";

test('Can convert to DOT notation', () => {
    let testPDA = PDA.fromTransitions([
        new Transition(State.p0, State.p(1, true), InputSymbol.EPSILON, StackSymbol.EMPTY_STACK, StackSymbol.EMPTY_STACK),
        new Transition(State.p0, State.p(2), InputSymbol.EPSILON, StackSymbol.EMPTY_STACK, StackSymbol.EMPTY_STACK)
    ], State.p0);
    expect(Renderer.convertToDotNotation(testPDA)).toEqual("digraph {" +
        "rankdir=LR;" +
        "node [shape = circle, color=green]; p₀;" +
        "node [shape = doublecircle, color=black]; p₁;" +
        "node [shape = circle];" +
        "p₀ -> p₁ [label = \"ε, $ → $\", color = black ]; " +
        "p₀ -> p₂ [label = \"ε, $ → $\", color = black ];}");
});

test('Can create Renderer instance', () => {
    let DOMNode = HTMLElement.DOCUMENT_NODE;
    let renderer = new Renderer(DOMNode);
    expect(renderer.graphElement).toEqual(DOMNode);
})