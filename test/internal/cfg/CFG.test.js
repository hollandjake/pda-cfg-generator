import Rule from "../../../src/internal/cfg/Rule.js";
import CFG from "../../../src/internal/cfg/CFG.js";
import CFGSymbol from "../../../src/internal/cfg/CFGSymbol.js";
import Variable from "../../../src/internal/cfg/Variable.js";
import Symbol from "../../../src/internal/Symbol.js";
import CFGSimplify from "../../../src/internal/cfg/CFGSimplify.js";
import Terminal from "../../../src/internal/cfg/Terminal.js";

test('Creates a CFG', () => {
    let startVariable = Variable.S;
    let variables = [Variable.S];
    let terminals = [Terminal.of('a')];
    let rules = [new Rule(Variable.S, CFGSymbol.from('a'))];
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
        new Rule(Variable.S, CFGSymbol.from('Sa'))
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
            new Rule(Variable.S,[Symbol.of("a")])
        ])
    }).toThrowError();
})

test('Can parse string input', () => {
    let cfg = CFG.fromString("A->aA,B->bB");
    let target = CFG.fromRules([
        new Rule(Variable.of('A'), CFGSymbol.from('aA')),
        new Rule(Variable.of('B'), CFGSymbol.from('bB'))
    ], Variable.of('A'))
    expect(cfg).toEqual(target);
})

test('Returns null when empty input given to string parser', () => {
    expect(CFG.fromString("")).toEqual(null);
})

test('Returns null when no rules given to string parser', () => {
    expect(CFG.fromString(",")).toEqual(null);
})

test('Returns null when null given to string parser', () => {
    expect(CFG.fromString(null)).toEqual(null);
})


test('Expect error when parsing string input when inputVariable non Variable type', () => {
    expect(() => {
        CFG.fromString("a->a");
    }).toThrowError();
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

    expect(cfg.simplify()).toEqual(CFG.fromRules([
        Rule.fromString("S->A"),
        Rule.fromString("S->aBA"),
        Rule.fromString("A->A"),
        Rule.fromString("A->B"),
        Rule.fromString("A->a"),
        Rule.fromString("B->b"),
    ]))
})

test('normalise', () => {
    let cfg = CFG.fromString("S->ASA,S->aB,A->B,A->S,B->b,B->ε");

    let actual = cfg.simplify().normalise();
    let expected = CFG.fromString("S\u2080->AA\u2081,S\u2080->CB,S\u2080->a,S\u2080->SA,S\u2080->AS," +
        "S->AA\u2081,S->CB,S->a,S->SA,S->AS," +
        "A->b,A->AA\u2081,A->CB,A->a,A->SA,A->AS," +
        "A\u2081->SA," +
        "C->a," +
        "B->b").simplify();
    console.log(actual.toString());
    console.log(expected.toString());
    expect(actual).toEqual(expected);
})