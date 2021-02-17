import PDA from "../../../src/internal/pda/PDA.js";
import Transition from "../../../src/internal/pda/Transition.js";
import State from "../../../src/internal/pda/State.js";
import InputSymbol from "../../../src/internal/pda/InputSymbol.js";
import StackSymbol from "../../../src/internal/pda/StackSymbol.js";
import PDAConvert from "../../../src/internal/pda/PDAConvert.js";

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