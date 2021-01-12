import PDA from "./PDA.js";
import Transition from "./Transition.js";
import ObjectHelper from "../helper/ObjectHelper.js";
import StackSymbol from "./StackSymbol.js";
import State from "./State.js";
import InputSymbol from "./InputSymbol.js";

export default class PDASimplify {

    static simplify(pda) {
        let oldTransitions = [...pda.transitions];

        let [newTransitions, newAcceptState] = this.singleAcceptState(oldTransitions, pda);
        newTransitions = this.splitTransitions(newTransitions, pda);
        newTransitions = this.emptiesStack(newTransitions, newAcceptState, pda);

        return PDA.fromTransitions(newTransitions, pda.startState.withoutAccept())
    }

    static singleAcceptState(transitions, pda) {
        let acceptStates = pda.acceptStates;

        // Make all transitions have no accept states (this also handles the situations where you have
        // a transition coming from an accept state
        let newTransitions = transitions.map(transition => transition.withoutAccept());

        //We dont want it to be accepting yet since in step 2 we are going to change the accept state again
        let newAcceptState = pda.generateNewState().withoutAccept();
        acceptStates.forEach(acceptState => {
            newTransitions.push(new Transition(acceptState.withoutAccept(), newAcceptState));
        })

        return [newTransitions, newAcceptState];
    }

    static emptiesStack(transitions, newAcceptState, pda) {
        let stackAlphabet = pda.stackAlphabet;

        stackAlphabet.filter(a => !ObjectHelper.equals(a, StackSymbol.EPSILON)).forEach(a => {
            transitions.push(new Transition(newAcceptState, newAcceptState, InputSymbol.EPSILON, a, StackSymbol.EPSILON));
        })

        transitions.push(new Transition(newAcceptState, State.accept));

        return transitions;
    }

    static splitTransitions(transitions, pda) {
        let newTransitions = [];

        transitions.forEach(transition => {
            // If transition pops epsilon and pushes epsilon then it needs to be split
            if (ObjectHelper.equals(transition.stackHead, StackSymbol.EPSILON) && ObjectHelper.equals(transition.stackPush, StackSymbol.EPSILON)) {
                let newState = pda.generateNewState();
                let newSymbol = pda.generateNewStackSymbol();

                newTransitions.push(
                    new Transition(transition.fromState, newState, transition.input, StackSymbol.EPSILON, newSymbol),
                    new Transition(newState, transition.toState, InputSymbol.EPSILON, newSymbol, StackSymbol.EPSILON)
                )
                // If transition has both stackHead and stackPush as non epsilon then it needs to be split
            } else if (!ObjectHelper.equals(transition.stackHead, StackSymbol.EPSILON) && !ObjectHelper.equals(transition.stackPush, StackSymbol.EPSILON)) {
                let newState = pda.generateNewState();

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