import Rule from "../../../src/internal/cfg/Rule.js";
import Variable from "../../../src/internal/cfg/Variable.js";

test('Construct new Rule', () => {
    let S = Variable.S;
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