import CFG from "../../../src/internal/cfg/CFG.js";
import CFGRemapper from "../../../src/internal/cfg/CFGRemapper.js";
import Rule from "../../../src/internal/cfg/Rule.js";
import Variable from "../../../src/internal/cfg/Variable.js";
import Terminal from "../../../src/internal/cfg/Terminal.js";

test('remaps correctly', () => {
    let cfg = CFG.fromString('S->AS,A->a,S->e');

    let actual = CFGRemapper.remap(cfg);
    expect(actual).toEqual(CFG.fromRules([
        new Rule(Variable.A(0)),
        new Rule(Variable.A(0), [Variable.A(1), Variable.A(0)]),
        new Rule(Variable.A(1), [Terminal.of('a')])
    ], Variable.A(0)));
})