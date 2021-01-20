import PDA from "../pda/PDA.js";
import Transition from "../pda/Transition.js";
import State from "../pda/State.js";
import StackSymbol from "../pda/StackSymbol.js";
import InputSymbol from "../pda/InputSymbol.js";

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
				InputSymbol.of("a"),
				StackSymbol.EPSILON,
				StackSymbol.of("B")
			),
			new Transition(
				State.q(1),
				State.q(1),
				InputSymbol.of("a"),
				StackSymbol.EPSILON,
				StackSymbol.of("B")
			),
			new Transition(
				State.q(1),
				State.q(2),
				InputSymbol.EPSILON,
				StackSymbol.of("B"),
				StackSymbol.EPSILON
			),
			new Transition(
				State.q(2),
				State.q(1),
				InputSymbol.EPSILON,
				StackSymbol.of("B"),
				StackSymbol.of("A")
			),
			new Transition(
				State.q(1),
				State.q(3),
				InputSymbol.of("b"),
				StackSymbol.of("A"),
				StackSymbol.EPSILON
			),
			new Transition(
				State.q(3),
				State.q(3),
				InputSymbol.of("b"),
				StackSymbol.of("A"),
				StackSymbol.EPSILON
			),
			new Transition(
				State.q(3),
				State.q(difficulty, true),
				InputSymbol.EPSILON,
				StackSymbol.EMPTY_STACK,
				StackSymbol.EMPTY_STACK
			)
		]);
	}
}