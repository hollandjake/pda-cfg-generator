import ObjectHelper from "../../../src/internal/helper/ObjectHelper.js";
import {test} from "@jest/globals";

test('equals [NULL,NULL]', () => {
    expect(ObjectHelper.equals(null,null)).toBe(true);
})
test('equals [NULL,primative]', () => {
    expect(ObjectHelper.equals(null,'')).toBe(null == '');
})
test('equals [primative,NULL]', () => {
    expect(ObjectHelper.equals('',null)).toBe('' == null);
})
test('equals [{id:1},{id:1}]', () => {
    expect(ObjectHelper.equals({id:1}, {id:1})).toBe(true);
})

test('equals != [{id:1},{id:2}]', () => {
    expect(ObjectHelper.equals({id:1}, {id:2})).toBe(false);
})

test('equals [{id:1}, {id:1,name:\'test\'}]', () => {
    expect(ObjectHelper.equals({id:1}, {id:1, name: 'test'})).toBe(false);
})

test('equals [{id:1,name:\'test\'}, {id:1}]', () => {
    expect(ObjectHelper.equals({id:1, name: 'test'}, {id:1})).toBe(false);
})