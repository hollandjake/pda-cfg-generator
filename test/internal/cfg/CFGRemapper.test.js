import CFG from "../../../src/internal/cfg/CFG.js";
import CFGRemapper from "../../../src/internal/cfg/CFGRemapper.js";
import Rule from "../../../src/internal/cfg/Rule.js";
import Variable from "../../../src/internal/cfg/Variable.js";
import Terminal from "../../../src/internal/cfg/Terminal.js";

test('remaps correctly', () => {
    let cfg = CFG.fromString('S->AS,A->a,S->e');

    let actual = CFGRemapper.remap(cfg);
    expect(actual).toEqual(CFG.fromRules([
        new Rule(Variable.V(0), [Variable.V(1), Variable.V(0)]),
        new Rule(Variable.V(1), [Terminal.of('a')]),
        new Rule(Variable.V(0), [Terminal.EPSILON])
    ], Variable.V(0)));
})