import Renderer from "./src/internal/helper/Renderer.js";

import PDA from "./src/internal/pda/PDA.js";
import State from "./src/internal/pda/State.js";
import Transition from "./src/internal/pda/Transition.js";
import StackSymbol from "./src/internal/pda/StackSymbol.js";
import InputSymbol from "./src/internal/pda/InputSymbol.js";


let pda = PDA.fromTransitions([
    new Transition(
        State.start,
        State.p0,
        InputSymbol.EPSILON,
        StackSymbol.EPSILON,
        StackSymbol.EMPTY_STACK
    ),
    new Transition(
        State.p0,
        State.p(1),
        InputSymbol.of('a'),
        StackSymbol.EPSILON,
        StackSymbol.of('B')
    ),
    new Transition(
        State.p(1),
        State.p(1),
        InputSymbol.of('a'),
        StackSymbol.EPSILON,
        StackSymbol.of('B')
    ),
    new Transition(
        State.p(1),
        State.p(2),
        InputSymbol.EPSILON,
        StackSymbol.of('B'),
        StackSymbol.EPSILON
    ),
    new Transition(
        State.p(2),
        State.p(1),
        InputSymbol.EPSILON,
        StackSymbol.of('B'),
        StackSymbol.of('A')
    ),
    new Transition(
        State.p(1),
        State.p(3),
        InputSymbol.of('b'),
        StackSymbol.of('A'),
        StackSymbol.EPSILON
    ),
    new Transition(
        State.p(3),
        State.p(3),
        InputSymbol.of('b'),
        StackSymbol.of('A'),
        StackSymbol.EPSILON
    ),
    new Transition(
        State.p(3),
        State.accept,
        InputSymbol.EPSILON,
        StackSymbol.EMPTY_STACK,
        StackSymbol.EMPTY_STACK
    )
]);
console.log(pda.toString());

let renderer = new Renderer(document.getElementById("pda"));
renderer.render(pda);

console.log(pda.toCFG().simplify().toString());
