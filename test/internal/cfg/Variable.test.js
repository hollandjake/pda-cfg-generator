import Variable from "../../../src/internal/cfg/Variable.js";

test('Can create variable with subscript', () => {
    expect(Variable.of('S').sub('0')).toEqual(Variable.of('S', '0'))
})

test('Create Variable with V notation', () => {
    expect(Variable.V(0)).toEqual(Variable.of('V', '0'))
})