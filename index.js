import CFG from "./src/internal/cfg/CFG.js";
import Rule from "./src/internal/cfg/Rule.js";

import PDA from "./src/internal/pda/PDA.js";
import State from "./src/internal/pda/State.js";
import Transition from "./src/internal/pda/Transition.js";
import CFGSymbol from "./src/internal/cfg/CFGSymbol.js";
import StackSymbol from "./src/internal/pda/StackSymbol.js";
import PDASymbol from "./src/internal/pda/PDASymbol.js";
import Variable from "./src/internal/cfg/Variable.js";

console.log(CFG.fromRules([
        new Rule(Variable.S, [Variable.S, CFGSymbol.of("a")]),
        new Rule(CFGSymbol.of("P"), [Variable.S, CFGSymbol.of("e"), CFGSymbol.of('P')]),
    ]
).toString());

console.log(PDA.fromTransitions([
    new Transition(
        State.q0,
        State.q(1,true),
        PDASymbol.of("a"),
        StackSymbol.EPSILON,
        PDASymbol.of("A")
    )
]).toString())