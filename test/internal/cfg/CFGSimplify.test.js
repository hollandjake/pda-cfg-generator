import Rule from "../../../src/internal/cfg/Rule.js";
import CFG from "../../../src/internal/cfg/CFG.js";
import CFGSimplify from "../../../src/internal/cfg/CFGSimplify.js";
import Variable from "../../../src/internal/cfg/Variable.js";

test('Step 1 - A', () => {
    let newRules = CFGSimplify.step1([], CFG.fromString("A->B"));
    expect(newRules[0]).toEqual(Variable.S);
    expect(newRules[1]).toEqual([Rule.fromString('S->A')]);
})

test('Step 1 - S', () => {
    let newRules = CFGSimplify.step1([], CFG.fromString("S->B"));
    expect(newRules[0]).toEqual(Variable.S0);
    expect(newRules[1]).toEqual([Rule.fromString('S\u2080 -> S')]);
})

test('Step 2', () => {
    let newRules = CFGSimplify.step2([
            Rule.fromString('S\u2080 -> S'),
            Rule.fromString('S -> ASA'),
            Rule.fromString('S -> aB'),
            Rule.fromString('A -> B'),
            Rule.fromString('A -> S'),
            Rule.fromString('B -> b'),
            Rule.fromString('B -> ε')
        ]
    );
    expect(Rule.sort(newRules)).toEqual(Rule.sort([
        Rule.fromString('S\u2080 -> S'),
        Rule.fromString('S -> S'),
        Rule.fromString('S -> a'),
        Rule.fromString('S -> aB'),
        Rule.fromString('S -> AS'),
        Rule.fromString('S -> SA'),
        Rule.fromString('S -> ASA'),
        Rule.fromString('A -> B'),
        Rule.fromString('A -> S'),
        Rule.fromString('B -> b'),
    ]))
})

test('Step 3', () => {
    let newRules = CFGSimplify.step3([
        Rule.fromString('A -> B'),
        Rule.fromString('A -> S'),
        Rule.fromString('B -> b'),
        Rule.fromString('S -> S'),
        Rule.fromString('S -> a'),
        Rule.fromString('S -> AS'),
        Rule.fromString('S -> SA'),
        Rule.fromString('S -> aB'),
        Rule.fromString('S -> ASA'),
        Rule.fromString('S\u2080 -> S'),
    ])

    expect(Rule.sort(newRules)).toEqual(Rule.sort([
        Rule.fromString('S\u2080 -> ASA'),
        Rule.fromString('S\u2080 -> aB'),
        Rule.fromString('S\u2080 -> a'),
        Rule.fromString('S\u2080 -> SA'),
        Rule.fromString('S\u2080 -> AS'),
        Rule.fromString('S -> ASA'),
        Rule.fromString('S -> aB'),
        Rule.fromString('S -> a'),
        Rule.fromString('S -> SA'),
        Rule.fromString('S -> AS'),
        Rule.fromString('A -> b'),
        Rule.fromString('A -> ASA'),
        Rule.fromString('A -> aB'),
        Rule.fromString('A -> a'),
        Rule.fromString('A -> SA'),
        Rule.fromString('A -> AS'),
        Rule.fromString('B -> b')
    ]));
})

test('simplify', () => {
    let cfg = CFG.fromRules([
        Rule.fromString("S->A"),
        Rule.fromString("S->aBA"),
        Rule.fromString("A->A"),
        Rule.fromString("A->B"),
        Rule.fromString("A->a"),
        Rule.fromString("B->b"),
        Rule.fromString("C->c")
    ])

    expect(CFGSimplify.simplify(cfg)).toEqual(CFG.fromRules([
        Rule.fromString("S->A"),
        Rule.fromString("S->aBA"),
        Rule.fromString("A->A"),
        Rule.fromString("A->B"),
        Rule.fromString("A->a"),
        Rule.fromString("B->b"),
    ]))
})