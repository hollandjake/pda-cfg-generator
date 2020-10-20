import State from "../../../src/internal/pda/State.js";
import Transition from "../../../src/internal/pda/Transition.js";
import {PDASymbol} from "../../../src/internal/pda/PDASymbol.js";
import Rule from "../../../src/internal/cfg/Rule.js";
import Variable from "../../../src/internal/cfg/Variable.js";

test('Construct new Rule', () => {
    let S = new Variable("S");
    let outputList = [S];
    let newRule = new Rule(S, outputList);
    expect(newRule.inputVariable).toBe(S);
    expect(newRule.outputList).toBe(outputList);
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

test('Expect error when creating a Transition with non Symbol input', () => {
    expect(() => {
        new Transition(State.q0, State.q0, {id: 1},null,null);
    }).toThrowError();
});

test('Expect error when creating a Transition with null stackHead', () => {
    expect(() => {
        new Transition(State.q0, State.q0, PDASymbol.EPSILON,null,null);
    }).toThrowError();
});

test('Expect error when creating a Transition with non Symbol stackHead', () => {
    expect(() => {
        new Transition(State.q0, State.q0, PDASymbol.EPSILON, {id: 1},null);
    }).toThrowError();
});

test('Expect error when creating a Transition with null stackPush', () => {
    expect(() => {
        new Transition(State.q0, State.q0, PDASymbol.EPSILON,PDASymbol.EPSILON,null);
    }).toThrowError();
});

test('Expect error when creating a Transition with non Symbol stackPush', () => {
    expect(() => {
        new Transition(State.q0, State.q0, PDASymbol.EPSILON, PDASymbol.EPSILON, {id: 1});
    }).toThrowError();
});