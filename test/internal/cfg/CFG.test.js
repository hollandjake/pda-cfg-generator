import Rule from "../../../src/internal/cfg/Rule.js";
import CFG from "../../../src/internal/cfg/CFG.js";
import CFGSymbol from "../../../src/internal/cfg/CFGSymbol.js";
import Variable from "../../../src/internal/cfg/Variable.js";

test('Creates a CFG', () => {
    let startVariable = Variable.S;
    let variables = [Variable.S];
    let terminals = [CFGSymbol.of('a')];
    let rules = [new Rule(Variable.S, [CFGSymbol.of('a')])];
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
        new CFG([], [], [], {id:1});
    }).toThrowError();
});

test('Creates a CFG from rules', () => {
    let startVariable = Variable.S;
    let variables = [Variable.S];
    let terminals = [CFGSymbol.of('a')];
    let rules = [
        new Rule(Variable.S, [Variable.S, CFGSymbol.of('a')])
    ];
    let target = new CFG(variables, terminals, rules, startVariable);

    let cfg = CFG.fromRules(rules, startVariable);
    expect(cfg).toEqual(target);
})

test('Throws Error When Creating a CFG from rules and startVariable isnt in rules', () => {
    expect(()=> {
        CFG.fromRules([], Variable.S)
    }).toThrowError();
})