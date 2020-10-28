import Transition from "./Transition.js";
import InputSymbol from "./InputSymbol.js";
import StackSymbol from "./StackSymbol.js";
import ObjectHelper from "../helper/ObjectHelper.js";
import PDA from "./PDA.js";
import State from "./State.js";

export default class PDASimplify {
    /**
     * @param {PDA} originalPDA
     * @returns {PDA}
     */
    static simplify(originalPDA) {
        let transitions = [...originalPDA.transitions];
        let newAcceptState;
        [transitions, newAcceptState] = this.singleAcceptState(transitions, originalPDA);
        transitions = this.transitionSplitting(transitions, originalPDA);
        transitions = this.emptyStack(transitions, newAcceptState, originalPDA);

        return PDA.fromTransitions(transitions, originalPDA.startState.withoutAccept());
    }

    /**
     *
     * @param {Transition[]} transitions
     * @param originalPDA
     * @returns {(Transition[]|State)[]}
     */
    static singleAcceptState(transitions, originalPDA) {
        let acceptStates = originalPDA.acceptStates;

        let newTransitions = transitions.map(transition => transition.withoutAccept());

        //We dont want it to be accepting yet since in step 2 we are going to change the accept state again
        let newAcceptState = originalPDA.nextState().withoutAccept();
        acceptStates.forEach(acceptState => {
            newTransitions.push(new Transition(acceptState.withoutAccept(), newAcceptState));
        })

        return [newTransitions, newAcceptState];
    }

    /**
     *
     * @param {Transition[]} transitions
     * @param {State} currentAcceptState
     * @param {PDA} originalPDA
     * @returns {Transition[]}
     */
    static emptyStack(transitions, currentAcceptState, originalPDA) {
        let stackAlphabet = originalPDA.stackAlphabet;

        stackAlphabet.filter(a => !ObjectHelper.equals(a, StackSymbol.EPSILON)).forEach(a => {
            transitions.push(new Transition(currentAcceptState, currentAcceptState, InputSymbol.EPSILON, a, StackSymbol.EPSILON));
        })

        transitions.push(new Transition(currentAcceptState, State.accept));

        return transitions;
    }

    /**
     *
     * @param {Transition[]} transitions
     * @param {PDA} originalPDA
     * @returns {Transition[]}
     */
    static transitionSplitting(transitions, originalPDA) {
        let newTransitions = [];

        transitions.forEach(transition => {
            if (ObjectHelper.equals(transition.stackHead, StackSymbol.EPSILON) && ObjectHelper.equals(transition.stackPush, StackSymbol.EPSILON)) {
                let newState = originalPDA.nextState();
                let newSymbol = originalPDA.nextStackSymbol();

                newTransitions.push(
                    new Transition(transition.fromState, newState, transition.input, StackSymbol.EPSILON, newSymbol),
                    new Transition(newState, transition.toState, InputSymbol.EPSILON, newSymbol, StackSymbol.EPSILON)
                )
            } else if (!ObjectHelper.equals(transition.stackHead, StackSymbol.EPSILON) && !ObjectHelper.equals(transition.stackPush, StackSymbol.EPSILON)) {
                let newState = originalPDA.nextState();
                newTransitions.push(
                    new Transition(transition.fromState, newState, transition.input, transition.stackHead, StackSymbol.EPSILON),
                    new Transition(newState, transition.toState, InputSymbol.EPSILON, StackSymbol.EPSILON, transition.stackPush)
                )
            } else {
                newTransitions.push(transition);
            }
        })

        return newTransitions;
    }
}