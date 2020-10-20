import CFG from "./src/internal/cfg/CFG.js";
import Rule from "./src/internal/cfg/Rule.js";
import CFGSymbol, {CFGConstants} from "./src/internal/cfg/CFGSymbol.js";

import PDA from "./src/internal/pda/PDA.js";
import Symbol from "./src/internal/Symbol.js";
import {PDASymbols} from "./src/internal/pda/PDASymbol.js";
import State from "./src/internal/pda/State.js";
import Transition from "./src/internal/pda/Transition.js";

console.log(CFG.fromRules([
        new Rule(CFGConstants.S, [CFGConstants.S, CFGSymbol.of("a")]),
        new Rule(CFGSymbol.of("X"), [CFGConstants.S, CFGSymbol.of("e"), CFGSymbol.of('X')]),
    ]
).toString());

console.log(PDA.fromTransitions([
    new Transition(
        State.q0,
        State.q(1),
        Symbol.of("a"),
        PDASymbols.EPSILON,
        Symbol.of("A")
    )
]).toString())