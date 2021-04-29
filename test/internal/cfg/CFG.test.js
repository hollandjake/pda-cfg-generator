import Rule from "../../../src/internal/cfg/Rule.js";
import CFG from "../../../src/internal/cfg/CFG.js";
import Variable from "../../../src/internal/cfg/Variable.js";
import Symbol from "../../../src/internal/Symbol.js";
import Terminal from "../../../src/internal/cfg/Terminal.js";

test('Creates a CFG', () => {
    let startVariable = Variable.S;
    let variables = [Variable.S];
    let terminals = [Terminal.of('a')];
    let rules = [new Rule(Variable.S, [Terminal.of('a')])];
    let cfg = new CFG(variables, terminals, rules, startVariable);
    expect(cfg.startVariable).toEqual(startVariable);
    expect(cfg.variables).toEqual(variables);
    expect(cfg.terminals).toEqual(terminals);
    expect(cfg.rules).toEqual(rules);
})

test('Throws Error When Constructing CFG with NULL startVariable', () => {
    expect(() => {
        new CFG([], [], [], null);
    }).toThrowError();
});

test('Throws Error When Constructing CFG with non Variable startVariable', () => {
    expect(() => {
        new CFG([], [], [], {id: 1});
    }).toThrowError();
});

test('Creates a CFG from rules', () => {
    let startVariable = Variable.S;
    let variables = [Variable.S];
    let terminals = [Terminal.of('a')];
    let rules = [
        new Rule(Variable.S, [Variable.S, Terminal.of('a')])
    ];
    let target = new CFG(variables, terminals, rules, startVariable);

    let cfg = CFG.fromRules(rules, startVariable);
    expect(cfg).toEqual(target);
})

test('Throws Error When Creating a CFG from rules and startVariable isnt in rules', () => {
    expect(() => {
        CFG.fromRules([], Variable.S)
    }).toThrowError();
})


test('Throws Error When Creating a CFG from rules and outputList contains a non Terminal or Variable', () => {
    expect(() => {
        CFG.fromRules([
            new Rule(Variable.S, [Symbol.of("a")])
        ])
    }).toThrowError();
})

test('Can parse string input', () => {
    let cfg = CFG.fromString("A->aA,B->bB");
    let target = CFG.fromRules([
        new Rule(Variable.of('A'), [Terminal.of('a'), Variable.of('A')]),
        new Rule(Variable.of('B'), [Terminal.of('b'), Variable.of('B')])
    ], Variable.of('A'))
    expect(cfg).toEqual(target);
})

test('Returns null when empty input given to string parser', () => {
    expect(CFG.fromString("")).toBe(null);
})

test('Returns null when no rules given to string parser', () => {
    expect(CFG.fromString(",")).toBe(null);
})

test('Returns null when null given to string parser', () => {
    expect(CFG.fromString(null)).toBe(null);
})

test('Expect error when parsing string input when inputVariable non Variable type', () => {
    expect(() => {
        CFG.fromString("a->a");
    }).toThrowError();
})

test('generateVariableStrings', () => {
    expect(CFG.fromString('S->aAb,S->e,A->a').generateVariableStrings()).toEqual([
        'S -> ε | aAb',
        [
            'A -> a'
        ]
    ])
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

    let actual1 = cfg.simplify();
    expect(actual1).toEqual(CFG.fromRules([
        Rule.fromString("S->a"),
        Rule.fromString("S->b"),
        Rule.fromString("S->aba"),
        Rule.fromString("S->abb"),
    ]))
})

test('normalise', () => {
    let cfg = CFG.fromString("S->ASA,S->aB,A->B,A->S,B->b,B->e");

    expect(cfg.normalise()).toEqual(CFG.fromString("" +
        "S->AB,S->CB," +
        "A->B,A->S," +
        "B->b,B->e,B->SA," +
        "C->a"
    ));
})

test('remap', () => {
    let cfg = CFG.fromString("S->XSX,S->aT,X->T,X->S,T->b,T->e");

    expect(cfg.remap()).toEqual(CFG.fromString("S->BSB,S->aA,B->A,B->S,A->b,A->e"))
})

test('getAcceptingInputs', () => {
    let cfg = CFG.fromString("S->ASA,S->aB,A->B,A->S,B->b,B->e");

    let acceptingInputs = cfg.getAcceptingInputs(3);
    expect(acceptingInputs).toEqual([
        [Terminal.of("b"), Terminal.of("b")],
        [Terminal.of("b")],
        [Terminal.EPSILON],
        [Terminal.of("a"), Terminal.of("b")],
        [Terminal.of("a")]
    ])
})