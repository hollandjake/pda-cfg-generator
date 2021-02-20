import PDA from "../../../src/internal/pda/PDA.js";
import State from "../../../src/internal/pda/State.js";
import Transition from "../../../src/internal/pda/Transition.js";
import InputSymbol from "../../../src/internal/pda/InputSymbol.js";
import StackSymbol from "../../../src/internal/pda/StackSymbol.js";
import CFG from "../../../src/internal/cfg/CFG.js";
import Rule from "../../../src/internal/cfg/Rule.js";
import Variable from "../../../src/internal/cfg/Variable.js";
import Terminal from "../../../src/internal/cfg/Terminal.js";

test('Creates a PDA', () => {
    let acceptingState = State.p(1, true);
    let states = [State.p0, acceptingState];
    let inputAlphabet = [InputSymbol.EPSILON];
    let stackAlphabet = [StackSymbol.EMPTY_STACK];
    let transitions = [new Transition(State.p0, acceptingState, InputSymbol.EPSILON, StackSymbol.EMPTY_STACK, StackSymbol.EMPTY_STACK)];
    let startState = State.p0;
    let acceptStates = [acceptingState];
    let pda = new PDA(states, inputAlphabet, stackAlphabet, transitions, startState, acceptStates);
    expect(pda.states).toEqual(states);
    expect(pda.inputAlphabet).toEqual(inputAlphabet);
    expect(pda.stackAlphabet).toEqual(stackAlphabet);
    expect(pda.transitions).toEqual(transitions);
    expect(pda.startState).toEqual(startState);
    expect(pda.acceptStates).toEqual(acceptStates);

})

test('Throws Error When Constructing PDA with NULL startState', () => {
    expect(() => {
        new PDA([], [], [], [], null, []);
    }).toThrowError();
});

test('Throws Error When Constructing PDA with non State startState', () => {
    expect(() => {
        new PDA([], [], [], [], {id: 1}, []);
    }).toThrowError();
});

test('Throws Error When Constructing PDA with NULL acceptState', () => {
    expect(() => {
        new PDA([], [], [], [], State.p0, [null]);
    }).toThrowError();
});

test('Throws Error When Constructing PDA with non State acceptState', () => {
    expect(() => {
        new PDA([], [], [], [], State.p0, [{id: 1}]);
    }).toThrowError();
});

test('Creates a PDA from transitions', () => {
    let acceptingState = State.p(1, true);
    let states = [State.p0, acceptingState, State.p(2)];
    let inputAlphabet = [InputSymbol.EPSILON];
    let stackAlphabet = [StackSymbol.EMPTY_STACK];
    let transitions = [
        new Transition(State.p0, acceptingState, InputSymbol.EPSILON, StackSymbol.EMPTY_STACK, StackSymbol.EMPTY_STACK),
        new Transition(State.p0, State.p(2), InputSymbol.EPSILON, StackSymbol.EMPTY_STACK, StackSymbol.EMPTY_STACK)
    ];
    let startState = State.p0;
    let acceptStates = [acceptingState];
    let target = new PDA(states, inputAlphabet, stackAlphabet, transitions, startState, acceptStates);

    let pda = PDA.fromTransitions(transitions, startState);
    expect(pda).toEqual(target);
})

test('Throws Error When Creating a PDA from transitions and startState isn\'t in transitions', () => {
    expect(() => {
        PDA.fromTransitions([])
    }).toThrowError();
})

test('Throws Error When Creating a PDA from non Transition transition', () => {
    expect(() => {
        PDA.fromTransitions([null])
    }).toThrowError();
})

test('isEasy true', () => {
    let pda = PDA.fromTransitions([
        new Transition(State.start, State.p0, InputSymbol.EPSILON, StackSymbol.EPSILON, StackSymbol.of('A')),
        new Transition(State.p0, State.accept, InputSymbol.EPSILON, StackSymbol.of('A'), StackSymbol.EPSILON)
    ], State.start)

    expect(pda.isEasy()).toBeTruthy();
})

test('isEasy one transition isn\'t easy', () => {
    let pda = PDA.fromTransitions([
        new Transition(State.start, State.p0, InputSymbol.EPSILON, StackSymbol.EPSILON, StackSymbol.of('A')),
        new Transition(State.p0, State.accept, InputSymbol.EPSILON, StackSymbol.of('A'), StackSymbol.of('A'))
    ], State.start)

    expect(pda.isEasy()).toBeFalsy();
})

test('isEasy two accept states', () => {
    let pda = PDA.fromTransitions([
        new Transition(State.start, State.p0, InputSymbol.EPSILON, StackSymbol.EPSILON, StackSymbol.of('A')),
        new Transition(State.p0, State.accept, InputSymbol.EPSILON, StackSymbol.of('A'), StackSymbol.EPSILON),
        new Transition(State.p0, State.p(1, true), InputSymbol.EPSILON, StackSymbol.of('A'), StackSymbol.EPSILON)
    ], State.start)

    expect(pda.isEasy()).toBeFalsy();
})

test('isEasy accept state not State.accept', () => {
    let pda = PDA.fromTransitions([
        new Transition(State.start, State.p0, InputSymbol.EPSILON, StackSymbol.EPSILON, StackSymbol.of('A')),
        new Transition(State.p0, State.p(1, true), InputSymbol.EPSILON, StackSymbol.of('A'), StackSymbol.EPSILON),
        new Transition(State.p0, State.p(2, true), InputSymbol.EPSILON, StackSymbol.of('A'), StackSymbol.EPSILON)
    ], State.start)

    expect(pda.isEasy()).toBeFalsy();
})

test('toCFG', () => {
    let pda = PDA.fromTransitions([
        new Transition(State.p0, State.p(1), InputSymbol.EPSILON, StackSymbol.EPSILON, StackSymbol.EMPTY_STACK),
        new Transition(State.p(1), State.p(1), InputSymbol.of('a'), StackSymbol.EPSILON, StackSymbol.of('A')),
        new Transition(State.p(1), State.p(2), InputSymbol.of('b'), StackSymbol.of('A'), StackSymbol.EPSILON),
        new Transition(State.p(2), State.p(2), InputSymbol.of('b'), StackSymbol.of('A'), StackSymbol.EPSILON),
        new Transition(State.p(2), State.p(3, true), InputSymbol.EPSILON, StackSymbol.EMPTY_STACK, StackSymbol.EPSILON),
    ])

    let actual = pda.toCFG();

    let expected = CFG.fromRules([
        new Rule(Variable.A('p1p2'), [Terminal.of('a'), Terminal.of('b')]),
        new Rule(Variable.A('p1p2'), [Terminal.of('a'), Variable.A('p1p2'), Terminal.of('b')]),
        new Rule(Variable.S, [Terminal.of('a'), Terminal.of('b')]),
        new Rule(Variable.S, [Terminal.of('a'), Variable.A('p1p2'), Terminal.of('b')]),
    ]);
    expect(actual).toEqual(expected);
})