import CFG from "../cfg/CFG.js";
import Transition from "./Transition.js";
import State from "./State.js";
import InputSymbol from "./InputSymbol.js";
import StackSymbol from "./StackSymbol.js";
import PDA from "./PDA.js";

export default class PDAConvert {
    /* istanbul ignore next */
    /**
     * @param {PDA} pda
     * @return {CFG}
     */
    static toCFG(pda) {
        return CFG.fromString("S->AS");
    }

    /**
     * @param {PDA} pda
     */
    static makeEasy(pda) {
        let transitions = pda.transitions;

        //1. One accept state
        transitions = transitions.map(t => t.withoutAccept());
        let tempAcceptState = pda.generateNewState();
        pda.acceptStates.forEach(s => transitions.push(new Transition(s.withoutAccept(), tempAcceptState)));

        //2. Empties stack before accepting
        pda.stackAlphabet.filter(a => !StackSymbol.EPSILON.equals(a)).forEach(a => {
            transitions.push(new Transition(tempAcceptState, tempAcceptState, InputSymbol.EPSILON, a, StackSymbol.EPSILON));
        })
        transitions.push(new Transition(tempAcceptState, State.accept, InputSymbol.EPSILON, StackSymbol.NEW_STACK_SYMBOL, StackSymbol.EPSILON));

        //3. Transition splitting
        let newTransitions = [];
        transitions.forEach(t => {
            if (t.isEasy()) {
                if (StackSymbol.EPSILON.equals(t.stackHead)) {
                    let newState = pda.generateNewState();
                    let stackSymbol = StackSymbol.FILL;
                    newTransitions.push(new Transition(t.fromState, newState, t.input, StackSymbol.EPSILON, stackSymbol));
                    newTransitions.push(new Transition(newState, t.toState, InputSymbol.EPSILON, stackSymbol, StackSymbol.EPSILON));
                } else {
                    let newState = pda.generateNewState();
                    newTransitions.push(new Transition(t.fromState, newState, t.input, t.stackHead, StackSymbol.EPSILON));
                    newTransitions.push(new Transition(newState, t.toState, InputSymbol.EPSILON, StackSymbol.EPSILON, t.stackPush));
                }
            } else {
                newTransitions.push(t);
            }
        })

        newTransitions.push(new Transition(State.start, pda.startState.withoutAccept(), InputSymbol.EPSILON, StackSymbol.EPSILON, StackSymbol.NEW_STACK_SYMBOL));

        return PDA.fromTransitions(newTransitions, State.start);
    }
}