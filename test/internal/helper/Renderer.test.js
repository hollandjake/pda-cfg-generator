import Renderer from "../../../src/internal/helper/Renderer.js";
import Transition from "../../../src/internal/pda/Transition.js";
import State from "../../../src/internal/pda/State.js";
import InputSymbol from "../../../src/internal/pda/InputSymbol.js";
import StackSymbol from "../../../src/internal/pda/StackSymbol.js";
import PDA from "../../../src/internal/pda/PDA.js";

test('Can convert to DOT notation', () => {
    let testPDA = PDA.fromTransitions([
        new Transition(State.q0, State.q(1, true), InputSymbol.EPSILON, StackSymbol.EMPTY_STACK, StackSymbol.EMPTY_STACK),
        new Transition(State.q0, State.q(2), InputSymbol.EPSILON, StackSymbol.EMPTY_STACK, StackSymbol.EMPTY_STACK)
    ], State.q0);
    expect(Renderer.convertToDotNotation(testPDA)).toBe("digraph {" +
        "rankdir=LR;" +
        "node [shape = circle, color=green]; q0;" +
        "node [shape = doublecircle, color=black]; q1;" +
        "node [shape = circle];" +
        "q0 -> q1 [label = \"ε, $ → $\", color = black ]; " +
        "q0 -> q2 [label = \"ε, $ → $\", color = black ];}");
});

test('Can create Renderer instance', () => {
    let DOMNode = HTMLElement.DOCUMENT_NODE;
    let renderer = new Renderer(DOMNode);
    expect(renderer.graphElement).toBe(DOMNode);
})