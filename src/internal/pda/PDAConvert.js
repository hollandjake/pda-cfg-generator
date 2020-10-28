import ObjectHelper from "../helper/ObjectHelper.js";
import Variable from "../cfg/Variable.js";
import Rule from "../cfg/Rule.js";
import Terminal from "../cfg/Terminal.js";
import CFG from "../cfg/CFG.js";
import StackSymbol from "./StackSymbol.js";
import InputSymbol from "./InputSymbol.js";
import State from "./State.js";

export default class PDAConvert {
    /**
     * @param {PDA} pda
     */
    static toCFG(pda) {
        let rules = [];
        //Since there is only one accept state
        let startState;
        rules = this.step1(rules, pda);
        rules = this.step2(rules, pda);
        rules = this.step3(rules, pda);
        [rules,startState] = this.step4(rules, pda);

        return CFG.fromRules(rules, startState);
    }

    /**
     * 1. For each p, q, r, s ∈ Q, u ∈ Γ, and a, b ∈ Σε,
     * if δ(p, a, ε) contains (r, u) and
     * δ(s, b, u) contains (q, ε),
     * put the rule Apq → aArsb in G.
     *
     *
     * (p) a,ε->t (t) ----- (s) b,t->ε (q)
     * A_pq -> a.A_rs.b
     *
     *
     * @param {Rule[]} rules
     * @param {PDA} pda
     * @returns {Rule[]}
     *
     * Slide 36
     */
    static step1(rules, pda) {
        let transitions = pda.transitions;

        //For each transition pair
        transitions.forEach(PR => {
            transitions.filter(SQ => !ObjectHelper.equals(PR, SQ)).forEach(SQ => {
                if (!ObjectHelper.equals(PR.stackPush, StackSymbol.EPSILON) &&
                    !ObjectHelper.equals(SQ.stackHead, StackSymbol.EPSILON) &&
                    ObjectHelper.equals(PR.stackPush, SQ.stackHead)) {

                    let outputList = [];
                    if (!ObjectHelper.equals(PR.input, InputSymbol.EPSILON)) {
                        outputList.push(new Terminal(PR.input.id));
                    }
                    outputList.push(Variable.A(`${PR.toState.id}${SQ.fromState.id}`));
                    if (!ObjectHelper.equals(SQ.input, InputSymbol.EPSILON)) {
                        outputList.push(new Terminal(SQ.input.id));
                    }
                    rules.push(new Rule(
                        Variable.A(`${PR.fromState.id}${SQ.toState.id}`),
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
                        Variable.A(`${p.id}${q.id}`),
                        [
                            Variable.A(`${p.id}${r.id}`),
                            Variable.A(`${r.id}${q.id}`)
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
        let states = pda.states;
        states.forEach(p => {
            rules.push(new Rule(Variable.A(`${p.id}${p.id}`)))
        })

        return rules;
    }

    /**
     *
     * @param {Rule[]} rules
     * @param {PDA} pda
     * @returns {(Rule[]|Variable)[]}
     */
    static step4(rules, pda) {
        let startState = pda.startState;
        let acceptState = pda.acceptStates[0];

        let newStartState;
        if (ObjectHelper.equals(startState,State.start)) {
            newStartState = Variable.S;
        } else {
            newStartState = Variable.of('S', startState.subscript);
        }
        rules.push(new Rule(newStartState, [Variable.A(`${startState.id}${acceptState.id}`)]));
        return [rules,newStartState];
    }
}