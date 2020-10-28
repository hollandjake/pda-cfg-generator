import ObjectHelper from "../../../src/internal/helper/ObjectHelper.js";

test('equals [NULL,NULL]', () => {
    expect(ObjectHelper.equals(null, null)).toEqual(true);
})
test('equals [NULL,primative]', () => {
    expect(ObjectHelper.equals(null, '')).toEqual(false);
})
test('equals [primative,NULL]', () => {
    expect(ObjectHelper.equals('', null)).toEqual(false);
})
test('equals [{id:1},{id:1}]', () => {
    expect(ObjectHelper.equals({id: 1}, {id: 1})).toEqual(true);
})

test('equals != [{id:1},{id:2}]', () => {
    expect(ObjectHelper.equals({id: 1}, {id: 2})).toEqual(false);
})

test('equals [{id:1}, {id:1,name:\'test\'}]', () => {
    expect(ObjectHelper.equals({id: 1}, {id: 1, name: 'test'})).toEqual(false);
})

test('equals [{id:1,name:\'test\'}, {id:1}]', () => {
    expect(ObjectHelper.equals({id: 1, name: 'test'}, {id: 1})).toEqual(false);
})

test('equals [NULL,{id:1,name:\'test\'}]', () => {
    expect(ObjectHelper.equals(null, {id:1,name:'test'})).toEqual(false);
})
test('equals [{id:1,name:\'test\'},NULL]', () => {
    expect(ObjectHelper.equals({id:1,name:'test'}, null)).toEqual(false);
})