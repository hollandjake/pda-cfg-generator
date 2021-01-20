import Transition from "../../../src/internal/pda/Transition.js";
import State from "../../../src/internal/pda/State.js";
import StackSymbol from "../../../src/internal/pda/StackSymbol.js";
import PDAConvert from "../../../src/internal/pda/PDAConvert.js";
import Rule from "../../../src/internal/cfg/Rule.js";
import PDA from "../../../src/internal/pda/PDA.js";
import Variable from "../../../src/internal/cfg/Variable.js";
import CFG from "../../../src/internal/cfg/CFG.js";
import InputSymbol from "../../../src/internal/pda/InputSymbol.js";
import Terminal from "../../../src/internal/cfg/Terminal.js";

test('step1', () => {
    let pda = PDA.fromTransitions([
        new Transition(State.p0, State.p(1), InputSymbol.of('a'), StackSymbol.EPSILON, StackSymbol.of('T')),
        new Transition(State.p(2), State.p(3), InputSymbol.of('b'), StackSymbol.of('T'), StackSymbol.EPSILON),
    ]);

    let actual = PDAConvert.step1([], pda);

    expect(Rule.sort(actual)).toEqual(Rule.sort([
        new Rule(
            Variable.A('p0p3'),
            [
                Terminal.of('a'),
                Variable.A('p1p2'),
                Terminal.of('b')
            ])
    ]))
})

test('step2', () => {
    let pda = PDA.fromTransitions([
        new Transition(State.p0, State.p(1), InputSymbol.of('a'), StackSymbol.EPSILON, StackSymbol.of('A')),
        new Transition(State.p(1), State.p(2, true), InputSymbol.of('b'), StackSymbol.of('A'), StackSymbol.EPSILON),
        new Transition(State.p(2, true), State.p(1), InputSymbol.of('a'), StackSymbol.EPSILON, StackSymbol.of('A')),
    ]);

    let actual = PDAConvert.step2([], pda);

    expect(Rule.sort(actual)).toEqual(Rule.sort([
        new Rule(Variable.A('p0p0'), [Variable.A('p0p0'), Variable.A('p0p0')]),
        new Rule(Variable.A('p0p0'), [Variable.A('p0p1'), Variable.A('p1p0')]),
        new Rule(Variable.A('p0p0'), [Variable.A('p0p2'), Variable.A('p2p0')]),
        new Rule(Variable.A('p0p1'), [Variable.A('p0p0'), Variable.A('p0p1')]),
        new Rule(Variable.A('p0p1'), [Variable.A('p0p1'), Variable.A('p1p1')]),
        new Rule(Variable.A('p0p1'), [Variable.A('p0p2'), Variable.A('p2p1')]),
        new Rule(Variable.A('p0p2'), [Variable.A('p0p0'), Variable.A('p0p2')]),
        new Rule(Variable.A('p0p2'), [Variable.A('p0p1'), Variable.A('p1p2')]),
        new Rule(Variable.A('p0p2'), [Variable.A('p0p2'), Variable.A('p2p2')]),
        new Rule(Variable.A('p1p0'), [Variable.A('p1p0'), Variable.A('p0p0')]),
        new Rule(Variable.A('p1p0'), [Variable.A('p1p1'), Variable.A('p1p0')]),
        new Rule(Variable.A('p1p0'), [Variable.A('p1p2'), Variable.A('p2p0')]),
        new Rule(Variable.A('p1p1'), [Variable.A('p1p0'), Variable.A('p0p1')]),
        new Rule(Variable.A('p1p1'), [Variable.A('p1p1'), Variable.A('p1p1')]),
        new Rule(Variable.A('p1p1'), [Variable.A('p1p2'), Variable.A('p2p1')]),
        new Rule(Variable.A('p1p2'), [Variable.A('p1p0'), Variable.A('p0p2')]),
        new Rule(Variable.A('p1p2'), [Variable.A('p1p1'), Variable.A('p1p2')]),
        new Rule(Variable.A('p1p2'), [Variable.A('p1p2'), Variable.A('p2p2')]),
        new Rule(Variable.A('p2p0'), [Variable.A('p2p0'), Variable.A('p0p0')]),
        new Rule(Variable.A('p2p0'), [Variable.A('p2p1'), Variable.A('p1p0')]),
        new Rule(Variable.A('p2p0'), [Variable.A('p2p2'), Variable.A('p2p0')]),
        new Rule(Variable.A('p2p1'), [Variable.A('p2p0'), Variable.A('p0p1')]),
        new Rule(Variable.A('p2p1'), [Variable.A('p2p1'), Variable.A('p1p1')]),
        new Rule(Variable.A('p2p1'), [Variable.A('p2p2'), Variable.A('p2p1')]),
        new Rule(Variable.A('p2p2'), [Variable.A('p2p0'), Variable.A('p0p2')]),
        new Rule(Variable.A('p2p2'), [Variable.A('p2p1'), Variable.A('p1p2')]),
        new Rule(Variable.A('p2p2'), [Variable.A('p2p2'), Variable.A('p2p2')]),
    ]))
})

test('step3', () => {
    let pda = PDA.fromTransitions([
        new Transition(State.p0, State.p(1), InputSymbol.of('a'), StackSymbol.EPSILON, StackSymbol.of('T')),
        new Transition(State.p(1), State.p(2, true), InputSymbol.of('b'), StackSymbol.of('T'), StackSymbol.EPSILON),
    ])

    let actual = PDAConvert.step3([], pda);

    expect(Rule.sort(actual)).toEqual(Rule.sort([
        new Rule(Variable.A('p0p0')),
        new Rule(Variable.A('p1p1')),
        new Rule(Variable.A('p2p2'))
    ]))
})

test('step4 with p0 start state', () => {
    let pda = PDA.fromTransitions([
        new Transition(State.p0, State.p(1), InputSymbol.of('a'), StackSymbol.EPSILON, StackSymbol.of('T')),
        new Transition(State.p(2), State.p(3, true), InputSymbol.of('b'), StackSymbol.of('T'), StackSymbol.EPSILON),
    ]);

    let [rules, startVariable] = PDAConvert.step4([], pda);

    expect(rules).toEqual([new Rule(Variable.S0, [Variable.A('p0p3')])])
    expect(startVariable).toEqual(Variable.S0);
})

test('toCFG', () => {
    let pda = PDA.fromTransitions([
        new Transition(State.p0, State.p(1), InputSymbol.of('a'), StackSymbol.EPSILON, StackSymbol.of('a')),
        new Transition(State.p(1), State.p(2, true), InputSymbol.of('b'), StackSymbol.of('a'), StackSymbol.EPSILON),
        new Transition(State.p(2, true), State.p(1), InputSymbol.of('a'), StackSymbol.EPSILON, StackSymbol.of('a'))
    ])

    let actual = PDAConvert.toCFG(pda);

    let expected = CFG.fromRules([
        new Rule(Variable.A('p0p0')),
        new Rule(Variable.A('p1p1')),
        new Rule(Variable.A('p2p2')),
        new Rule(Variable.A('p0p0'), [Variable.A('p0p0'), Variable.A('p0p0')]),
        new Rule(Variable.A('p0p0'), [Variable.A('p0p1'), Variable.A('p1p0')]),
        new Rule(Variable.A('p0p0'), [Variable.A('p0p2'), Variable.A('p2p0')]),
        new Rule(Variable.A('p0p1'), [Variable.A('p0p0'), Variable.A('p0p1')]),
        new Rule(Variable.A('p0p1'), [Variable.A('p0p1'), Variable.A('p1p1')]),
        new Rule(Variable.A('p0p1'), [Variable.A('p0p2'), Variable.A('p2p1')]),
        new Rule(Variable.A('p0p2'), [Variable.A('p0p0'), Variable.A('p0p2')]),
        new Rule(Variable.A('p0p2'), [Variable.A('p0p1'), Variable.A('p1p2')]),
        new Rule(Variable.A('p0p2'), [Variable.A('p0p2'), Variable.A('p2p2')]),
        new Rule(Variable.A('p0p2'), [Terminal.of('a'), Variable.A('p1p1'), Terminal.of('b')]),
        new Rule(Variable.A('p1p0'), [Variable.A('p1p0'), Variable.A('p0p0')]),
        new Rule(Variable.A('p1p0'), [Variable.A('p1p1'), Variable.A('p1p0')]),
        new Rule(Variable.A('p1p0'), [Variable.A('p1p2'), Variable.A('p2p0')]),
        new Rule(Variable.A('p1p1'), [Variable.A('p1p0'), Variable.A('p0p1')]),
        new Rule(Variable.A('p1p1'), [Variable.A('p1p1'), Variable.A('p1p1')]),
        new Rule(Variable.A('p1p1'), [Variable.A('p1p2'), Variable.A('p2p1')]),
        new Rule(Variable.A('p1p2'), [Variable.A('p1p0'), Variable.A('p0p2')]),
        new Rule(Variable.A('p1p2'), [Variable.A('p1p1'), Variable.A('p1p2')]),
        new Rule(Variable.A('p1p2'), [Variable.A('p1p2'), Variable.A('p2p2')]),
        new Rule(Variable.A('p2p0'), [Variable.A('p2p0'), Variable.A('p0p0')]),
        new Rule(Variable.A('p2p0'), [Variable.A('p2p1'), Variable.A('p1p0')]),
        new Rule(Variable.A('p2p0'), [Variable.A('p2p2'), Variable.A('p2p0')]),
        new Rule(Variable.A('p2p1'), [Variable.A('p2p0'), Variable.A('p0p1')]),
        new Rule(Variable.A('p2p1'), [Variable.A('p2p1'), Variable.A('p1p1')]),
        new Rule(Variable.A('p2p1'), [Variable.A('p2p2'), Variable.A('p2p1')]),
        new Rule(Variable.A('p2p2'), [Variable.A('p2p0'), Variable.A('p0p2')]),
        new Rule(Variable.A('p2p2'), [Variable.A('p2p1'), Variable.A('p1p2')]),
        new Rule(Variable.A('p2p2'), [Variable.A('p2p2'), Variable.A('p2p2')]),
        new Rule(Variable.A('p2p2'), [Terminal.of('a'), Variable.A('p1p1'), Terminal.of('b')]),
        new Rule(Variable.S0, [Variable.A('p0p2')]),
    ], Variable.S0);

    expect(actual).toEqual(expected);
})