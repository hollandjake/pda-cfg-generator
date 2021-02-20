import PDA from "../../../src/internal/pda/PDA.js";
import Transition from "../../../src/internal/pda/Transition.js";
import State from "../../../src/internal/pda/State.js";
import InputSymbol from "../../../src/internal/pda/InputSymbol.js";
import StackSymbol from "../../../src/internal/pda/StackSymbol.js";
import PDAConvert from "../../../src/internal/pda/PDAConvert.js";
import Variable from "../../../src/internal/cfg/Variable.js";
import Rule from "../../../src/internal/cfg/Rule.js";
import Terminal from "../../../src/internal/cfg/Terminal.js";
import CFG from "../../../src/internal/cfg/CFG.js";

test('makeEasy', () => {
    let pda = PDA.fromTransitions([
        new Transition(State.p(0, true), State.p(0, true), InputSymbol.of('a'), StackSymbol.EPSILON, StackSymbol.of('a')),
        new Transition(State.p(0, true), State.p(0, true), InputSymbol.of('b'), StackSymbol.of('a'), StackSymbol.EPSILON),
        new Transition(State.p(0, true), State.p(0, true), InputSymbol.of('c'), StackSymbol.of('a'), StackSymbol.of('b')),
        new Transition(State.p(0, true), State.p(0, true), InputSymbol.of('d'), StackSymbol.EPSILON, StackSymbol.EPSILON),
    ], State.p(0, true));

    let easyPDA = PDAConvert.makeEasy(pda);

    let expected = PDA.fromTransitions([
        //Start transition
        new Transition(State.start, State.p0, InputSymbol.EPSILON, StackSymbol.EPSILON, StackSymbol.NEW_STACK_SYMBOL),
        //Transitions without changes
        new Transition(State.p0, State.p0, InputSymbol.of('a'), StackSymbol.EPSILON, StackSymbol.of('a')),
        new Transition(State.p0, State.p0, InputSymbol.of('b'), StackSymbol.of('a'), StackSymbol.EPSILON),
        //Transition with stack push and pop
        new Transition(State.p0, State.p(-2), InputSymbol.of('c'), StackSymbol.of('a'), StackSymbol.EPSILON),
        new Transition(State.p(-2), State.p0, InputSymbol.EPSILON, StackSymbol.EPSILON, StackSymbol.of('b')),
        //Transition with neither push or pop
        new Transition(State.p0, State.p(-3), InputSymbol.of('d'), StackSymbol.EPSILON, StackSymbol.FILL),
        new Transition(State.p(-3), State.p0, InputSymbol.EPSILON, StackSymbol.FILL, StackSymbol.EPSILON),
        //Collapse all accept states into one, these transitions are also then expanded due to the above rule
        new Transition(State.p0, State.p(-4), InputSymbol.EPSILON, StackSymbol.EPSILON, StackSymbol.FILL),
        new Transition(State.p(-4), State.p(-1), InputSymbol.EPSILON, StackSymbol.FILL, StackSymbol.EPSILON),
        //On acceptance the stack contains only the stack symbol
        new Transition(State.p(-1), State.p(-1), InputSymbol.EPSILON, StackSymbol.of('a'), StackSymbol.EPSILON),
        new Transition(State.p(-1), State.p(-1), InputSymbol.EPSILON, StackSymbol.of('b'), StackSymbol.EPSILON),
        //New accept state
        new Transition(State.p(-1), State.accept, InputSymbol.EPSILON, StackSymbol.NEW_STACK_SYMBOL, StackSymbol.EPSILON),
    ], State.start);

    expect(easyPDA).toEqual(expected);
    expect(pda.isEasy()).toBeFalsy();
    expect(easyPDA.isEasy()).toBeTruthy();
})

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

test('step1 with epsilon transitions', () => {
    let pda = PDA.fromTransitions([
        new Transition(State.p0, State.p(1), InputSymbol.EPSILON, StackSymbol.EPSILON, StackSymbol.of('T')),
        new Transition(State.p(2), State.p(3), InputSymbol.EPSILON, StackSymbol.of('T'), StackSymbol.EPSILON),
    ]);

    let actual = PDAConvert.step1([], pda);

    expect(Rule.sort(actual)).toEqual(Rule.sort([
        new Rule(
            Variable.A('p0p3'),
            [Variable.A('p1p2')])
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
        new Transition(State.start, State.p0, InputSymbol.of('a'), StackSymbol.EPSILON, StackSymbol.of('A')),
        new Transition(State.p0, State.accept, InputSymbol.of('b'), StackSymbol.of('A'), StackSymbol.EPSILON),
        new Transition(State.accept, State.p0, InputSymbol.of('a'), StackSymbol.EPSILON, StackSymbol.of('A'))
    ], State.start)

    let actual = PDAConvert.toCFG(pda);

    let expected = CFG.fromRules([
        new Rule(Variable.A('psps')),
        new Rule(Variable.A('p0p0')),
        new Rule(Variable.A('papa')),
        new Rule(Variable.A('p0p0'), [Variable.A('p0p0'), Variable.A('p0p0')]),
        new Rule(Variable.A('p0p0'), [Variable.A('p0pa'), Variable.A('pap0')]),
        new Rule(Variable.A('p0p0'), [Variable.A('p0ps'), Variable.A('psp0')]),
        new Rule(Variable.A('p0pa'), [Variable.A('p0p0'), Variable.A('p0pa')]),
        new Rule(Variable.A('p0pa'), [Variable.A('p0pa'), Variable.A('papa')]),
        new Rule(Variable.A('p0pa'), [Variable.A('p0ps'), Variable.A('pspa')]),
        new Rule(Variable.A('p0ps'), [Variable.A('p0p0'), Variable.A('p0ps')]),
        new Rule(Variable.A('p0ps'), [Variable.A('p0pa'), Variable.A('paps')]),
        new Rule(Variable.A('p0ps'), [Variable.A('p0ps'), Variable.A('psps')]),
        new Rule(Variable.A('pap0'), [Variable.A('pap0'), Variable.A('p0p0')]),
        new Rule(Variable.A('pap0'), [Variable.A('papa'), Variable.A('pap0')]),
        new Rule(Variable.A('pap0'), [Variable.A('paps'), Variable.A('psp0')]),
        new Rule(Variable.A('papa'), [Variable.A('pap0'), Variable.A('p0pa')]),
        new Rule(Variable.A('papa'), [Variable.A('papa'), Variable.A('papa')]),
        new Rule(Variable.A('papa'), [Variable.A('paps'), Variable.A('pspa')]),
        new Rule(Variable.A('papa'), [Terminal.of('a'), Variable.A('p0p0'), Terminal.of('b')]),
        new Rule(Variable.A('paps'), [Variable.A('pap0'), Variable.A('p0ps')]),
        new Rule(Variable.A('paps'), [Variable.A('papa'), Variable.A('paps')]),
        new Rule(Variable.A('paps'), [Variable.A('paps'), Variable.A('psps')]),
        new Rule(Variable.A('psp0'), [Variable.A('psp0'), Variable.A('p0p0')]),
        new Rule(Variable.A('psp0'), [Variable.A('pspa'), Variable.A('pap0')]),
        new Rule(Variable.A('psp0'), [Variable.A('psps'), Variable.A('psp0')]),
        new Rule(Variable.A('pspa'), [Variable.A('psp0'), Variable.A('p0pa')]),
        new Rule(Variable.A('pspa'), [Variable.A('pspa'), Variable.A('papa')]),
        new Rule(Variable.A('pspa'), [Variable.A('psps'), Variable.A('pspa')]),
        new Rule(Variable.A('pspa'), [Terminal.of('a'), Variable.A('p0p0'), Terminal.of('b')]),
        new Rule(Variable.A('psps'), [Variable.A('psp0'), Variable.A('p0ps')]),
        new Rule(Variable.A('psps'), [Variable.A('pspa'), Variable.A('paps')]),
        new Rule(Variable.A('psps'), [Variable.A('psps'), Variable.A('psps')]),
        new Rule(Variable.S, [Variable.A('pspa')]),
    ], Variable.S);

    expect(actual).toEqual(expected);
})