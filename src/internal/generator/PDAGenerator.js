import PDA from "../pda/PDA.js";
import Transition from "../pda/Transition.js";
import State from "../pda/State.js";
import StackSymbol from "../pda/StackSymbol.js";
import InputSymbol from "../pda/InputSymbol.js";

/* istanbul ignore file */
export default class PDAGenerator {
    /**
     *
     * @param {number} difficulty
     *
     * @return {PDA}
     */
    static generatePDA(difficulty) {
        return PDA.fromTransitions([
            new Transition(
                State.p0,
                State.p(1),
                InputSymbol.EPSILON,
                StackSymbol.EPSILON,
                StackSymbol.EMPTY_STACK
            ),
            new Transition(
                State.p(1),
                State.p(2),
                InputSymbol.of("a"),
                StackSymbol.EPSILON,
                StackSymbol.of("B")
            ),
            new Transition(
                State.p(2),
                State.p(2),
                InputSymbol.of("a"),
                StackSymbol.EPSILON,
                StackSymbol.of("B")
            ),
            new Transition(
                State.p(2),
                State.p(3),
                InputSymbol.EPSILON,
                StackSymbol.of("B"),
                StackSymbol.EPSILON
            ),
            new Transition(
                State.p(3),
                State.p(2),
                InputSymbol.EPSILON,
                StackSymbol.of("B"),
                StackSymbol.of("A")
            ),
            new Transition(
                State.p(2),
                State.p(4),
                InputSymbol.of("b"),
                StackSymbol.of("A"),
                StackSymbol.EPSILON
            ),
            new Transition(
                State.p(4),
                State.p(4),
                InputSymbol.of("b"),
                StackSymbol.of("A"),
                StackSymbol.EPSILON
            ),
            new Transition(
                State.p(4),
                State.p(difficulty, true),
                InputSymbol.EPSILON,
                StackSymbol.EMPTY_STACK,
                StackSymbol.EPSILON
            )
        ]);
    }
}