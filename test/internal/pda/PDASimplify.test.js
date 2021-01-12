import PDA from "../../../src/internal/pda/PDA.js";
import Transition from "../../../src/internal/pda/Transition.js";
import State from "../../../src/internal/pda/State.js";
import PDASimplify from "../../../src/internal/pda/PDASimplify.js";
import StackSymbol from "../../../src/internal/pda/StackSymbol.js";
import InputSymbol from "../../../src/internal/pda/InputSymbol.js";

test('singleAcceptState', () => {
    let pda = PDA.fromTransitions([
        new Transition(State.p0, State.p(1, true)),
        new Transition(State.p0, State.p(2, true)),
        new Transition(State.p0, State.p(3, true)),
    ]);

    let [transitions, newAcceptState] = PDASimplify.singleAcceptState(pda.transitions, pda);
    expect(Transition.sort(transitions)).toEqual(Transition.sort([
        new Transition(State.p0, State.p(1)),
        new Transition(State.p0, State.p(2)),
        new Transition(State.p0, State.p(3)),
        new Transition(State.p(1), State.p(-1)),
        new Transition(State.p(2), State.p(-1)),
        new Transition(State.p(3), State.p(-1)),
    ]));

    expect(newAcceptState).toEqual(State.p(-1))
})

test('Empty Stack', () => {
    let pda = PDA.fromTransitions([
        new Transition(State.p0, State.p(1)),
        new Transition(State.p0, State.p(1), InputSymbol.of('a'), StackSymbol.of('B'), StackSymbol.of('C')),
        new Transition(State.p0, State.p(1), InputSymbol.of('b'), StackSymbol.EPSILON, StackSymbol.of('D')),
        new Transition(State.p(1), State.p(2))
    ]);
    let transitions1 = PDASimplify.emptiesStack(pda.transitions, State.p(2), pda);
    expect(Transition.sort(transitions1)).toEqual(Transition.sort([
        new Transition(State.p0, State.p(1)),
        new Transition(State.p0, State.p(1), InputSymbol.of('a'), StackSymbol.of('B'), StackSymbol.of('C')),
        new Transition(State.p0, State.p(1), InputSymbol.of('b'), StackSymbol.EPSILON, StackSymbol.of('D')),
        new Transition(State.p(1), State.p(2)),
        new Transition(State.p(2), State.p(2), InputSymbol.EPSILON, StackSymbol.of('B'), StackSymbol.EPSILON),
        new Transition(State.p(2), State.p(2), InputSymbol.EPSILON, StackSymbol.of('C'), StackSymbol.EPSILON),
        new Transition(State.p(2), State.p(2), InputSymbol.EPSILON, StackSymbol.of('D'), StackSymbol.EPSILON),
        new Transition(State.p(2), State.accept),
    ]))
})

test('transitionSplitting', () => {
    let pda = PDA.fromTransitions([
        new Transition(State.p0, State.p(1, true)),
        new Transition(State.p0, State.p(1, true), InputSymbol.of('a'), StackSymbol.of('B'), StackSymbol.of('C')),
        new Transition(State.p0, State.p(1, true), InputSymbol.of('b'), StackSymbol.EPSILON, StackSymbol.of('D')),
    ]);

    expect(Transition.sort(PDASimplify.splitTransitions(pda.transitions, pda))).toEqual(Transition.sort([
        new Transition(State.p0, State.p(1, true), InputSymbol.of('b'), StackSymbol.EPSILON, StackSymbol.of('D')),
        new Transition(State.p0, State.p(-1), InputSymbol.EPSILON, StackSymbol.EPSILON, StackSymbol.of(-1)),
        new Transition(State.p(-1), State.p(1, true), InputSymbol.EPSILON, StackSymbol.of(-1), StackSymbol.EPSILON),
        new Transition(State.p0, State.p(-2), InputSymbol.of('a'), StackSymbol.of('B'), StackSymbol.EPSILON),
        new Transition(State.p(-2), State.p(1, true), InputSymbol.EPSILON, StackSymbol.EPSILON, StackSymbol.of('C')),
    ]));
})

test('simplify', () => {
    let pda = PDA.fromTransitions([
        new Transition(State.p(0, true), State.p(0, true), InputSymbol.of('a'), StackSymbol.EPSILON, StackSymbol.of("A")),
        new Transition(State.p(0, true), State.p(0, true), InputSymbol.of('b'), StackSymbol.of('A'), StackSymbol.EPSILON),
    ], State.p(0, true));

    let actual = PDASimplify.simplify(pda);

    expect(actual).toEqual(PDA.fromTransitions([
        new Transition(State.p0, State.p0, InputSymbol.of('a'), StackSymbol.EPSILON, StackSymbol.of("A")),
        new Transition(State.p0, State.p0, InputSymbol.of('b'), StackSymbol.of("A"), StackSymbol.EPSILON),
        new Transition(State.p0, State.p(-2), InputSymbol.EPSILON, StackSymbol.EPSILON, StackSymbol.of(-1)),
        new Transition(State.p(-2), State.p(-1), InputSymbol.EPSILON, StackSymbol.of(-1), StackSymbol.EPSILON),
        new Transition(State.p(-1), State.p(-1), InputSymbol.EPSILON, StackSymbol.of('A'), StackSymbol.EPSILON),
        new Transition(State.p(-1), State.accept, InputSymbol.EPSILON, StackSymbol.EPSILON, StackSymbol.EPSILON),
    ]));
})