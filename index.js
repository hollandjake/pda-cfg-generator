import Renderer from "./src/internal/helper/Renderer.js";
import CFG from "./src/internal/cfg/CFG.js";

import Rule from "./src/internal/cfg/Rule.js";
import PDA from "./src/internal/pda/PDA.js";
import State from "./src/internal/pda/State.js";
import Transition from "./src/internal/pda/Transition.js";
import CFGSymbol from "./src/internal/cfg/CFGSymbol.js";
import StackSymbol from "./src/internal/pda/StackSymbol.js";
import PDASymbol from "./src/internal/pda/PDASymbol.js";
import Variable from "./src/internal/cfg/Variable.js";
import InputSymbol from "./src/internal/pda/InputSymbol.js";

console.log(CFG.fromRules([
        new Rule(Variable.S, [Variable.S, CFGSymbol.of("a")]),
        new Rule(CFGSymbol.of("P"), [Variable.S, CFGSymbol.of("e"), CFGSymbol.of('P')]),
    ]
).toString());

let pda = PDA.fromTransitions([
    new Transition(
        State.q0,
        State.q(1),
        PDASymbol.of("a"),
        StackSymbol.EPSILON,
        PDASymbol.of("B")
    ),
    new Transition(
        State.q(1),
        State.q(1),
        PDASymbol.of("a"),
        StackSymbol.EPSILON,
        PDASymbol.of("B")
    ),
    new Transition(
        State.q(1),
        State.q(2),
        InputSymbol.EPSILON,
        PDASymbol.of("B"),
        StackSymbol.EPSILON
    ),
    new Transition(
        State.q(2),
        State.q(1),
        InputSymbol.EPSILON,
        PDASymbol.of("B"),
        PDASymbol.of("A")
    ),
    new Transition(
        State.q(1),
        State.q(3),
        PDASymbol.of("b"),
        PDASymbol.of("A"),
        StackSymbol.EPSILON
    ),
    new Transition(
        State.q(3),
        State.q(3),
        PDASymbol.of("b"),
        PDASymbol.of("A"),
        StackSymbol.EPSILON
    ),
    new Transition(
        State.q(3),
        State.q(4, true),
        InputSymbol.EPSILON,
        StackSymbol.EMPTY_STACK,
        StackSymbol.EMPTY_STACK
    )
]);
console.log(pda.toString());

console.log(CFG.fromString("A->aB,A->b\nB->b").toString());

let renderer = new Renderer(document.getElementById("pda"));
renderer.render(pda);
