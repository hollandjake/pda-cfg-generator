import State from "../../../src/internal/pda/State.js";
import Transition from "../../../src/internal/pda/Transition.js";
import InputSymbol from "../../../src/internal/pda/InputSymbol.js";
import StackSymbol from "../../../src/internal/pda/StackSymbol.js";
import PDASymbol from "../../../src/internal/pda/PDASymbol.js";

test('Construct new Transition', () => {
    let fromState = State.q0;
    let toState = State.q0;
    let input = PDASymbol.of("a");
    let stackHead = StackSymbol.EMPTY_STACK;
    let stackPush = StackSymbol.EMPTY_STACK;

    let transition = new Transition(fromState, toState, input, stackHead, stackPush);
    expect(transition.fromState).toBe(fromState);
    expect(transition.toState).toBe(toState);
    expect(transition.input).toBe(input);
    expect(transition.stackHead).toBe(stackHead);
    expect(transition.stackPush).toBe(stackPush);
});

test('Expect error when creating a Transition with null fromState', () => {
    expect(() => {
        new Transition(null, null, null,null,null);
    }).toThrowError();
});

test('Expect error when creating a Transition with non State fromState', () => {
    expect(() => {
        new Transition({id:1}, null,null,null,null);
    }).toThrowError();
});

test('Expect error when creating a Transition with null toState', () => {
    expect(() => {
        new Transition(State.q0, null, null,null,null);
    }).toThrowError();
});

test('Expect error when creating a Transition with non State toState', () => {
    expect(() => {
        new Transition(State.q0, {id: 1},null,null,null);
    }).toThrowError();
});

test('Expect error when creating a Transition with null input', () => {
    expect(() => {
        new Transition(State.q0, State.q0, null,null,null);
    }).toThrowError();
});

test('Expect error when creating a Transition with non InputSymbol input', () => {
    expect(() => {
        new Transition(State.q0, State.q0, {id: 1},null,null);
    }).toThrowError();
});

test('Expect error when creating a Transition with null stackHead', () => {
    expect(() => {
        new Transition(State.q0, State.q0, InputSymbol.EPSILON,null,null);
    }).toThrowError();
});

test('Expect error when creating a Transition with non Symbol stackHead', () => {
    expect(() => {
        new Transition(State.q0, State.q0, InputSymbol.EPSILON, {id: 1},null);
    }).toThrowError();
});

test('Expect error when creating a Transition with null stackPush', () => {
    expect(() => {
        new Transition(State.q0, State.q0, InputSymbol.EPSILON, StackSymbol.EMPTY_STACK,null);
    }).toThrowError();
});

test('Expect error when creating a Transition with non Symbol stackPush', () => {
    expect(() => {
        new Transition(State.q0, State.q0, InputSymbol.EPSILON, StackSymbol.EMPTY_STACK, {id: 1});
    }).toThrowError();
});