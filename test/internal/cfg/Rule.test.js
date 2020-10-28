import Rule from "../../../src/internal/cfg/Rule.js";
import Variable from "../../../src/internal/cfg/Variable.js";
import CFGSymbol from "../../../src/internal/cfg/CFGSymbol.js";

test('Construct new Rule', () => {
    let S = Variable.of("S");
    let outputList = [S];
    let newRule = new Rule(S, outputList);
    expect(newRule.inputVariable).toEqual(S);
    expect(newRule.outputList).toEqual(outputList);
});

test('Expect error when creating a Rule with null inputVariable', () => {
    expect(() => {
        new Rule(null, []);
    }).toThrowError();
});

test('Expect error when creating a Rule with non Variable inputVariable', () => {
    expect(() => {
        new Rule({id: 1}, []);
    }).toThrowError();
});

test('Expect error when creating a Rule with null outputList', () => {
    expect(() => {
        new Rule(Variable.S, null)
    }).toThrowError();
})

test('Expect error when creating a Rule with non array outputList', () => {
    expect(() => {
        new Rule(Variable.S, 1)
    }).toThrowError();
})

test('Expect error when creating a Rule with empty outputList', () => {
    expect(() => {
        new Rule(Variable.S, []);
    }).toThrowError();
});

test('Can parse string input', () => {
    let rule = Rule.fromString("A->aA");
    expect(rule.inputVariable).toEqual(Variable.of("A"));
    expect(rule.outputList).toEqual(CFGSymbol.from('aA'));
})

test('Returns null when empty string given to string parser', () => {
    expect(Rule.fromString("")).toEqual(null);
})

test('Returns null when null given to string parser', () => {
    expect(Rule.fromString(null)).toEqual(null);
})

test('Expect error when parsing string input when inputVariable non Variable type', () => {
    expect(() => {
        Rule.fromString("a->a");
    }).toThrowError();
})

test('Can parse correctly with subscript', () => {
    let rule = Rule.fromString('A\u2080 -> AA\u2081')
})

test('Sort', () => {
    expect(Rule.sort([
        Rule.fromString('A -> aS'),
        Rule.fromString('S -> SA'),
        Rule.fromString('S -> AS'),
        Rule.fromString('S -> AS'),
        Rule.fromString('A -> a'),
        Rule.fromString('A -> aSa'),
        Rule.fromString('A -> aSb')
    ])).toEqual([
        Rule.fromString('A -> a'),
        Rule.fromString('A -> aS'),
        Rule.fromString('A -> aSa'),
        Rule.fromString('A -> aSb'),
        Rule.fromString('S -> AS'),
        Rule.fromString('S -> AS'),
        Rule.fromString('S -> SA'),
    ])
})