import CFG from "../../../src/internal/cfg/CFG.js";
import CFGReduce from "../../../src/internal/cfg/CFGReduce.js";
import PDA from "../../../src/internal/pda/PDA.js";
import Transition from "../../../src/internal/pda/Transition.js";
import State from "../../../src/internal/pda/State.js";
import InputSymbol from "../../../src/internal/pda/InputSymbol.js";
import StackSymbol from "../../../src/internal/pda/StackSymbol.js";
import CFL from "../../../src/internal/cfl/CFL.js";

test('reduce', () => {
    let cfg = CFG.fromString('S->AB, A->a,B->b');

    let reducedCFG = CFGReduce.reduce(cfg);

    expect(reducedCFG).toEqual(CFG.fromString('S->ab'));
})

test('x', () => {
    let pda = PDA.fromTransitions([
        new Transition(
            State.p0,
            State.p(1),
            InputSymbol.EPSILON,
            StackSymbol.EPSILON,
            StackSymbol.EMPTY_STACK
        ),
        new Transition(
            State.p(1),
            State.p(1),
            InputSymbol.of("("),
            StackSymbol.EPSILON,
            StackSymbol.of("(")
        ),
        new Transition(
            State.p(1),
            State.p(2),
            InputSymbol.of("int"),
            StackSymbol.EPSILON,
            StackSymbol.EPSILON
        ),
        new Transition(
            State.p(2),
            State.p(2),
            InputSymbol.of(')'),
            StackSymbol.of("("),
            StackSymbol.EPSILON
        ),
        new Transition(
            State.p(2),
            State.p(1),
            InputSymbol.of('+')
        ),
        new Transition(
            State.p(2),
            State.p(1),
            InputSymbol.of('*')
        ),
        new Transition(
            State.p(2),
            State.p(3, true),
            InputSymbol.EPSILON,
            StackSymbol.EMPTY_STACK,
            StackSymbol.EMPTY_STACK
        )
    ])

    let cfg = pda.toCFG();

    let cfl = CFL.fromCFG(cfg);
})