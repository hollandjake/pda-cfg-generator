import PDA from "../../../src/internal/pda/PDA.js";
import State from "../../../src/internal/pda/State.js";
import Transition from "../../../src/internal/pda/Transition.js";
import {PDASymbol} from "../../../src/internal/pda/PDASymbol.js";

test('Creates a PDA', () => {
    let acceptingState = State.q(1, true);
    let states = [State.q0, acceptingState];
    let inputAlphabet = [PDASymbol.EPSILON];
    let stackAlphabet = [PDASymbol.EMPTY_STACK];
    let transitions = [new Transition(State.q0, acceptingState, PDASymbol.EPSILON, PDASymbol.EMPTY_STACK, PDASymbol.EMPTY_STACK)];
    let startState = State.q0;
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
        new PDA([], [], [], [],null, []);
    }).toThrowError();
});

test('Throws Error When Constructing PDA with non State startState', () => {
    expect(() => {
        new PDA([], [], [], [], {id:1}, []);
    }).toThrowError();
});

test('Throws Error When Constructing PDA with NULL acceptState', () => {
    expect(() => {
        new PDA([], [], [], [],State.q0, [null]);
    }).toThrowError();
});

test('Throws Error When Constructing PDA with non State acceptState', () => {
    expect(() => {
        new PDA([], [], [], [], State.q0, [{id:1}]);
    }).toThrowError();
});

test('Creates a PDA from transitions', () => {
    let acceptingState = State.q(1, true);
    let states = [State.q0, acceptingState];
    let inputAlphabet = [PDASymbol.EPSILON];
    let stackAlphabet = [PDASymbol.EMPTY_STACK];
    let transitions = [
        new Transition(State.q0, acceptingState, PDASymbol.EPSILON, PDASymbol.EMPTY_STACK, PDASymbol.EMPTY_STACK)
    ];
    let startState = State.q0;
    let acceptStates = [acceptingState];
    let target = new PDA(states, inputAlphabet, stackAlphabet, transitions, startState, acceptStates);

    let pda = PDA.fromTransitions(transitions, startState);
    expect(pda).toEqual(target);
})

test('Throws Error When Creating a PDA from transitions and startState isn\'t in transitions', () => {
    expect(()=> {
        PDA.fromTransitions([], State.q0)
    }).toThrowError();
})