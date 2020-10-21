import Rule from "../../../src/internal/cfg/Rule.js";
import Variable from "../../../src/internal/cfg/Variable.js";
import CFGSymbol from "../../../src/internal/cfg/CFGSymbol.js";
import CFG from "../../../src/internal/cfg/CFG.js";

test('Construct new Rule', () => {
    let S = CFGSymbol.of("S");
    let outputList = [S];
    let newRule = new Rule(S, outputList);
    expect(newRule.inputVariable).toBe(S);
    expect(newRule.outputList).toBe(outputList);
});

test('Expect error when creating a Rule with null inputVariable', () => {
    expect(() => {
        new Rule(null, []);
    }).toThrowError();
});

test('Expect error when creating a Rule with non Variable inputVariable', () => {
    expect(() => {
        new Rule({id:1}, []);
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
    expect(rule.inputVariable).toEqual(CFGSymbol.of("A"));
    expect(rule.outputList).toEqual([CFGSymbol.of("a"),CFGSymbol.of("A")]);
})

test('Returns null when empty string given to string parser', () => {
    expect(Rule.fromString("")).toBe(null);
})

test('Returns null when null given to string parser', () => {
    expect(Rule.fromString(null)).toBe(null);
})

test('Expect error when parsing string input when inputVariable non Variable type', () => {
    expect(() => {
        Rule.fromString("a->a");
    }).toThrowError();
})