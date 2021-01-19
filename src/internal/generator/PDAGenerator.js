import PDA from "../pda/PDA.js";
import Transition from "../pda/Transition.js";
import State from "../pda/State.js";
import PDASymbol from "../pda/PDASymbol.js";
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
				State.q0,
				State.q(1),
				PDASymbol.of("a"),
				StackSymbol.EPSILON,
				PDASymbol.of("B")
			),
			new Transition(
				State.q(1),
				State.q(1),
				PDASymbol.of("a"),
				StackSymbol.EPSILON,
				PDASymbol.of("B")
			),
			new Transition(
				State.q(1),
				State.q(2),
				InputSymbol.EPSILON,
				PDASymbol.of("B"),
				StackSymbol.EPSILON
			),
			new Transition(
				State.q(2),
				State.q(1),
				InputSymbol.EPSILON,
				PDASymbol.of("B"),
				PDASymbol.of("A")
			),
			new Transition(
				State.q(1),
				State.q(3),
				PDASymbol.of("b"),
				PDASymbol.of("A"),
				StackSymbol.EPSILON
			),
			new Transition(
				State.q(3),
				State.q(3),
				PDASymbol.of("b"),
				PDASymbol.of("A"),
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