import Variable from "../../../src/internal/cfg/Variable.js";

test('Can create variable with subscript', () => {
    expect(Variable.of('S').sub('0')).toEqual(Variable.of('S', '0'))
})

test('Create Variable with A notation', () => {
    expect(Variable.A(0)).toEqual(Variable.of('A', '0'))
})