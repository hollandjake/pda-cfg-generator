import Rule from "../../../src/internal/cfg/Rule.js";
import CFG from "../../../src/internal/cfg/CFG.js";
import CFGSimplify from "../../../src/internal/cfg/CFGSimplify.js";

test('substitution', () => {
    let cfg = CFG.fromString("S->aB, A->aaA,A->abBc,B->aA,B->b");
    let newRules = CFGSimplify.substitution(cfg.rules, cfg);
    expect(Rule.sort(newRules)).toEqual(Rule.sort([
        Rule.fromString("S->aB"),
        Rule.fromString("S->ab"),
        Rule.fromString("A->aaA"),
        Rule.fromString("A->abBc"),
        Rule.fromString("A->abbc"),
        Rule.fromString("B->aA")
    ]));
})

test('epsilon substitution', () => {
    let cfg = CFG.fromString('S->aMb,M->aMcMb,M->e');
    let newRules = CFGSimplify.substitution(cfg.rules, cfg);
    expect(Rule.sort(newRules)).toEqual(Rule.sort([
        Rule.fromString('S->aMb'),
        Rule.fromString('S->ab'),
        Rule.fromString('M->aMcMb'),
        Rule.fromString('M->aMcb'),
        Rule.fromString('M->acMb'),
        Rule.fromString('M->acb')
    ]));
})

test('terminality', () => {
    let cfg = CFG.fromString("S->AC, S->B, A->a, C->c, C->BC, E->aA, E->e, B->F, F->B");
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
    let cfg = CFG.fromString("S->AC, A->a, A->S, C->c, E->aA, E->e");
    let newRules = CFGSimplify.reachability(cfg.rules, cfg);
    expect(Rule.sort(newRules)).toEqual(Rule.sort([
        Rule.fromString('S->AC'),
        Rule.fromString('A->a'),
        Rule.fromString('A->S'),
        Rule.fromString('C->c'),
    ]));
})

test('useless', () => {
    let cfg = CFG.fromString("S->A,A->B,B->a");
    let newRules = CFGSimplify.useless(cfg.rules, cfg);
    expect(Rule.sort(newRules)).toEqual(Rule.sort([
        Rule.fromString('S->a'),
        Rule.fromString('A->a'),
        Rule.fromString('B->a')
    ]))
})

test('condense', () => {
    let cfg = CFG.fromString('S->AC, A->e, A->AA, C->c');

    let newRules = CFGSimplify.condense(cfg.rules, cfg);
    expect(Rule.sort(newRules)).toEqual(Rule.sort([
        Rule.fromString('S->AC'),
        Rule.fromString('A->e'),
        Rule.fromString('C->c')
    ]))
})

test('simplify', () => {
    let cfg = CFG.fromString("S->AC,S->B,A->x,A->a,C->e,C->c,C->BC,E->aA,E->e");

    let actual = CFGSimplify.simplify(cfg);
    expect(actual).toEqual(CFG.fromRules([
        Rule.fromString("S->ac"),
        Rule.fromString("S->xc"),
        Rule.fromString("S->a"),
        Rule.fromString("S->x")
    ]))
})

test('simplify with recursion', () => {
    let cfg = CFG.fromString('S->AC,S->B,A->AA,A->a,A->e,C->c,C->BC,E->aA,E->e');

    let actual = CFGSimplify.simplify(cfg);
    expect(actual).toEqual(CFG.fromRules([
        Rule.fromString('S->c'),
        Rule.fromString('S->Ac'),
        Rule.fromString('S->ac'),
        Rule.fromString('A->AA'),
        Rule.fromString('A->Aa'),
        Rule.fromString('A->aA'),
        Rule.fromString('A->aa'),
        Rule.fromString('A->e')
    ]))
})


// test('test', () => {
//     let pda = PDAGenerator.generatePDA(5);
//     let cfg = pda.toCFG();
//
//     expect(cfg).toEqual(CFG.fromRules([]))
// })