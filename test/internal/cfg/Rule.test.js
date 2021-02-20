import Rule from "../../../src/internal/cfg/Rule.js";
import Variable from "../../../src/internal/cfg/Variable.js";
import Terminal from "../../../src/internal/cfg/Terminal.js";

test('Construct new Rule', () => {
    let S = Variable.S;
    let outputList = [S];
    let newRule = new Rule(S, outputList);
    expect(newRule.inputVariable).toBe(S);
    expect(newRule.outputList).toBe(outputList);
});

test('Construct new Rule with defaults', () => {
    let actual = new Rule(Variable.S);
    let expected = new Rule(Variable.S, [Terminal.EPSILON]);

    expect(actual).toEqual(expected);
})

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
    expect(rule.outputList).toEqual([Terminal.of("a"), Variable.of("A")]);
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

test('Sort Rules', () => {
    expect(Rule.sort([
        Rule.fromString("A->A"),
        Rule.fromString("C->A"),
        Rule.fromString("B->A"),
        Rule.fromString("B->AA"),
        Rule.fromString("B->D"),
        Rule.fromString("B->C"),
        Rule.fromString("B->D")
    ])).toEqual([
        Rule.fromString("A->A"),
        Rule.fromString("B->A"),
        Rule.fromString("B->C"),
        Rule.fromString("B->D"),
        Rule.fromString("B->D"),
        Rule.fromString("B->AA"),
        Rule.fromString("C->A")
    ])
})

test('terminates', () => {
    expect(Rule.fromString('S->a').terminates()).toBeTruthy();
    expect(Rule.fromString('S->A').terminates()).toBeFalsy();
    expect(Rule.fromString('S->A').terminates([Variable.of('A')])).toBeTruthy();
})