import CFG from "../../../src/internal/cfg/CFG.js";
import CFGChomsky from "../../../src/internal/cfg/CFGChomsky.js";
import Rule from "../../../src/internal/cfg/Rule.js";
import Variable from "../../../src/internal/cfg/Variable.js";

test('rule1', () => {
    let cfg = CFG.fromString("S->ASA");
    let [newRules, newStartVariable] = CFGChomsky.rule1(cfg.rules, cfg);
    expect(newRules).toEqual([Rule.fromString("S->ASA"), new Rule(Variable.S0, [Variable.S])]);
    expect(newStartVariable).toBe(Variable.S0);
})

test('rule2', () => {
    let cfg = CFG.fromRules([
        new Rule(Variable.S0, [Variable.S]),
        Rule.fromString("S->ASA"),
        Rule.fromString("S->aB"),
        Rule.fromString("A->B"),
        Rule.fromString("A->S"),
        Rule.fromString("B->b"),
        new Rule(Variable.of('B'))
    ]);

    expect(CFGChomsky.rule2(cfg.rules, cfg)).toEqual([
        new Rule(Variable.S0, [Variable.S]),
        Rule.fromString("S->ASA"),
        Rule.fromString("S->aB"),
        Rule.fromString("S->a"),
        Rule.fromString("S->SA"),
        Rule.fromString("S->AS"),
        Rule.fromString("S->S"),
        Rule.fromString("A->B"),
        Rule.fromString("A->S"),
        Rule.fromString("B->b")
    ])
})