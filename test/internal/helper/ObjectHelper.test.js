import ObjectHelper from "../../../src/internal/helper/ObjectHelper.js";

test('equals [NULL,NULL]', () => {
    expect(ObjectHelper.equals(null, null)).toBe(true);
})
test('equals [NULL,primative]', () => {
    expect(ObjectHelper.equals(null, '')).toBe(false);
})
test('equals [primative,NULL]', () => {
    expect(ObjectHelper.equals('', null)).toBe(false);
})
test('equals [{id:1},{id:1}]', () => {
    expect(ObjectHelper.equals({id: 1}, {id: 1})).toBe(true);
})

test('equals != [{id:1},{id:2}]', () => {
    expect(ObjectHelper.equals({id: 1}, {id: 2})).toBe(false);
})

test('equals [{id:1}, {id:1,name:\'test\'}]', () => {
    expect(ObjectHelper.equals({id: 1}, {id: 1, name: 'test'})).toBe(false);
})

test('equals [{id:1,name:\'test\'}, {id:1}]', () => {
    expect(ObjectHelper.equals({id: 1, name: 'test'}, {id: 1})).toBe(false);
})

test('equals [NULL,{id:1,name:\'test\'}]', () => {
    expect(ObjectHelper.equals(null, {id: 1, name: 'test'})).toBe(false);
})
test('equals [{id:1,name:\'test\'},NULL]', () => {
    expect(ObjectHelper.equals({id: 1, name: 'test'}, null)).toBe(false);
})