import PDA from "../pda/PDA.js";
import Transition from "../pda/Transition.js";
import State from "../pda/State.js";
import StackSymbol from "../pda/StackSymbol.js";
import InputSymbol from "../pda/InputSymbol.js";
import CFG from "../cfg/CFG.js";

export default class PDAGenerator {
    /**
     *
     * @param {number} difficulty
     *
     * @return {[PDA|CFG]}
     */
    static generatePDA(difficulty) {
        return PDA.fromTransitions([
            new Transition(
                State.p0,
                State.p(1),
                InputSymbol.of("a"),
                StackSymbol.EPSILON,
                StackSymbol.of("B")
            ),
            new Transition(
                State.p(1),
                State.p(1),
                InputSymbol.of("a"),
                StackSymbol.EPSILON,
                StackSymbol.of("B")
            ),
            new Transition(
                State.p(1),
                State.p(2),
                InputSymbol.EPSILON,
                StackSymbol.of("B"),
                StackSymbol.EPSILON
            ),
            new Transition(
                State.p(2),
                State.p(1),
                InputSymbol.EPSILON,
                StackSymbol.of("B"),
                StackSymbol.of("A")
            ),
            new Transition(
                State.p(1),
                State.p(3),
                InputSymbol.of("b"),
                StackSymbol.of("A"),
                StackSymbol.EPSILON
            ),
            new Transition(
                State.p(3),
                State.p(3),
                InputSymbol.of("b"),
                StackSymbol.of("A"),
                StackSymbol.EPSILON
            ),
            new Transition(
                State.p(3),
                State.p(difficulty, true),
                InputSymbol.EPSILON,
                StackSymbol.EMPTY_STACK,
                StackSymbol.EMPTY_STACK
            )
        ]);
    }

    /**
     *
     * @param {number} difficulty
     *
     * @return {[PDA|CFG]}
     */
    static generatePair(difficulty) {
        let PDA_CFG_PAIRS = [
            [
                PDA.fromTransitions([
                    new Transition(State.p0, State.p(1), InputSymbol.of("a"), StackSymbol.EPSILON, StackSymbol.of('A')),
                    new Transition(State.p(1), State.p(2, true), InputSymbol.of("b"), StackSymbol.of('A'), StackSymbol.EPSILON),
                ]),
                CFG.fromString('S->aSb,S->e')
            ],
            [
                PDA.fromTransitions([
                    new Transition(State.p0, State.p(1, true), InputSymbol.of("a"))
                ]),
                CFG.fromString('S->a')
            ]
        ];

        return PDA_CFG_PAIRS[Math.floor(Math.random() * PDA_CFG_PAIRS.length)];
    }
}