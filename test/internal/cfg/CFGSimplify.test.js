import Rule from "../../../src/internal/cfg/Rule.js";
import CFG from "../../../src/internal/cfg/CFG.js";
import CFGSimplify from "../../../src/internal/cfg/CFGSimplify.js";


test('terminality', () => {
    let cfg = CFG.fromString("S->AC, S->B,A->a,C->c,C->BC,E->aA,E->ε");
    let newRules = CFGSimplify.terminality(cfg.rules, cfg);
    expect(Rule.sort(newRules)).toEqual(Rule.sort([
        Rule.fromString("S->AC"),
        Rule.fromString("A->a"),
        Rule.fromString("C->c"),
        Rule.fromString("E->aA"),
        Rule.fromString("E->ε"),
    ]))
})

test('reachability', () => {
    let cfg = CFG.fromString("S->AC, A->a, A->S, C->c, E->aA,E->ε");
    let newRules = CFGSimplify.reachability(cfg.rules, cfg);
    expect(Rule.sort(newRules)).toEqual(Rule.sort([
        Rule.fromString('S->AC'),
        Rule.fromString('A->a'),
        Rule.fromString('A->S'),
        Rule.fromString('C->c'),
    ]));
})

test('simplify', () => {
    let cfg = CFG.fromString("S->AC,S->B,A->a,C->c,C->BC,E->aA,E->ε");

    expect(CFGSimplify.simplify(cfg)).toEqual(CFG.fromRules([
        Rule.fromString("S->AC"),
        Rule.fromString("A->a"),
        Rule.fromString("C->c"),
    ]))
})