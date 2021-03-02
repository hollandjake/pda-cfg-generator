import CFG from "../cfg/CFG.js";
import Transition from "./Transition.js";
import State from "./State.js";
import InputSymbol from "./InputSymbol.js";
import StackSymbol from "./StackSymbol.js";
import PDA from "./PDA.js";
import Variable from "../cfg/Variable.js";
import Rule from "../cfg/Rule.js";
import Terminal from "../cfg/Terminal.js";
import ObjectHelper from "../helper/ObjectHelper.js";

export default class PDAConvert {
    /**
     * @param {PDA} pda
     * @return {CFG}
     */
    static toCFG(pda) {
        let easyPda = this.makeEasy(pda);

        let rules = [];
        let startVariable;

        rules = this.step1(rules, easyPda);
        rules = this.step2(rules, easyPda);
        rules = this.step3(rules, easyPda);

        [rules, startVariable] = this.step4(rules, easyPda);

        return CFG.fromRules(rules, startVariable);
    }

    /**
     * @param {PDA} pda
     */
    static makeEasy(pda) {
        if (pda.isEasy()) {
            return pda;
        }

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
                newTransitions.push(t);
            } else {
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
            }
        })

        newTransitions.push(new Transition(State.start, pda.startState.withoutAccept(), InputSymbol.EPSILON, StackSymbol.EPSILON, StackSymbol.NEW_STACK_SYMBOL));

        return PDA.fromTransitions(newTransitions, State.start);
    }

    /**
     * 1. For each p, q, r, s ∈ Q, u ∈ Γ, and a, b ∈ Σε,
     * if δ(p, a, ε) contains (r, u) and
     * δ(s, b, u) contains (q, ε),
     * put the rule A_pq → a.A_rs.b in G.
     *
     *
     * (p) a,ε->t (t) ----- (s) b,t->ε (q)
     * A_pq -> a.A_rs.b
     *
     *
     * @param {Rule[]} rules
     * @param {PDA} pda
     *
     * @returns {Rule[]}
     *
     * Slide 36
     */
    static step1(rules, pda) {
        let transitions = pda.transitions;

        //For each transition pair (excluding itself)
        transitions.forEach(PR => {
            transitions.filter(SQ => !PR.equals(SQ)).forEach(SQ => {
                // If the PR pushes the same thing as SQ pops then there could be a path between them.
                if (ObjectHelper.equals(PR.stackPush, SQ.stackHead) &&
                    !StackSymbol.EPSILON.equals(PR.stackPush)
                ) {
                    let outputList = [];

                    // We can skip adding epsilon since it doesnt provide extra information
                    if (!InputSymbol.EPSILON.equals(PR.input)) {
                        outputList.push(Terminal.of(`${PR.input}`));
                    }
                    //Add the variable
                    outputList.push(Variable.A(`${PR.toState}${SQ.fromState}`));

                    // We can skip adding epsilon since it doesnt provide extra information
                    if (!InputSymbol.EPSILON.equals(SQ.input)) {
                        outputList.push(Terminal.of(`${SQ.input}`));
                    }
                    //A_{pq} -> aA_{rs}b
                    rules.push(new Rule(
                        Variable.A(`${PR.fromState}${SQ.toState}`),
                        outputList
                    ))
                }
            })
        })

        return rules;
    }

    /**
     * For each p, q, r ∈ Q, put the rule Apq → AprArq in G.
     *
     * @param {Rule[]} rules
     * @param {PDA} pda
     * @returns {Rule[]}
     */
    static step2(rules, pda) {
        let states = pda.states;
        states.forEach(p => {
            states.forEach(q => {
                states.forEach(r => {
                    rules.push(new Rule(
                        Variable.A(`${p}${q}`),
                        [
                            Variable.A(`${p}${r}`),
                            Variable.A(`${r}${q}`)
                        ]
                    ))
                })
            })
        })
        return rules;
    }

    /**
     * Finally, for each p ∈ Q, put the rule App → ε in G.
     *
     * @param {Rule[]} rules
     * @param {PDA} pda
     * @returns {Rule[]}
     */
    static step3(rules, pda) {
        pda.states.forEach(p => {
            rules.push(new Rule(Variable.A(`${p}${p}`)));
        });

        return rules;
    }

    /**
     * Generate start rule
     * @param {Rule[]} rules
     * @param {PDA} pda
     * @returns {(Rule[]|Variable)[]}
     */
    static step4(rules, pda) {
        let startState = pda.startState;
        let acceptState = pda.acceptStates[0];

        let startVariable;
        if (State.start.equals(startState)) {
            startVariable = Variable.S;
        } else {
            startVariable = Variable.of('S', startState.subscript);
        }
        rules.push(new Rule(startVariable, [Variable.A(`${startState}${acceptState}`)]));
        return [rules, startVariable];
    }
}