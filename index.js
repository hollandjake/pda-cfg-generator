import CFG from "./src/internal/cfg/CFG.js";

import Rule from "./src/internal/cfg/Rule.js";
import CFGString from "./src/internal/cfg/CFGString.js";
import Variable from "./src/internal/cfg/Variable.js";
import Renderer from "./src/internal/helper/Renderer.js";
import Transition from "./src/internal/pda/Transition.js";
import PDA from "./src/internal/pda/PDA.js";
import StackSymbol from "./src/internal/pda/StackSymbol.js";
import InputSymbol from "./src/internal/pda/InputSymbol.js";
import State from "./src/internal/pda/State.js";

console.log(CFG.fromRules([
        new Rule(Variable.S, [Variable.S, CFGString.of("a")]),
        new Rule(CFGString.of("P"), [Variable.S, CFGString.of("e"), CFGString.of('P')]),
    ]
).toString());

let pda = PDA.fromTransitions([
    new Transition(
        State.p0,
        State.p(1),
        InputSymbol.of("a"),
        StackSymbol.EPSILON,
        StackSymbol.of("B")
    ),
    new Transition(
        State.p(1),
        State.p(1),
        InputSymbol.of("a"),
        StackSymbol.EPSILON,
        StackSymbol.of("B")
    ),
    new Transition(
        State.p(1),
        State.p(2),
        InputSymbol.EPSILON,
        StackSymbol.of("B"),
        StackSymbol.EPSILON
    ),
    new Transition(
        State.p(2),
        State.p(1),
        InputSymbol.EPSILON,
        StackSymbol.of("B"),
        StackSymbol.of("A")
    ),
    new Transition(
        State.p(1),
        State.p(3),
        InputSymbol.of("b"),
        StackSymbol.of("A"),
        StackSymbol.EPSILON
    ),
    new Transition(
        State.p(3),
        State.p(3),
        InputSymbol.of("b"),
        StackSymbol.of("A"),
        StackSymbol.EPSILON
    ),
    new Transition(
        State.p(3),
        State.p(4, true),
        InputSymbol.EPSILON,
        StackSymbol.EMPTY_STACK,
        StackSymbol.EMPTY_STACK
    )
]);
console.log(pda.toString());

let renderer = new Renderer(document.getElementById("pda"));
renderer.render(pda, true);
