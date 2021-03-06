import ArrayHelper from "../../../src/internal/helper/ArrayHelper.js";
import MagicMap from "../../../src/internal/helper/MagicMap.js";

test('push_distinct with array', () => {
    let array = [0, 1, 2, 3];
    let target = [0, 1, 2, 3];
    ArrayHelper.push_distinct(array, 2);
    expect(array).toEqual(target);
})

test('push_distinct with single object', () => {
    let array = [{id: 1}];
    let target = [{id: 1}, {id: 2}];
    ArrayHelper.push_distinct(array, {id: 2});
    expect(array).toEqual(target);
})

test('push_distinct with multiple objects', () => {
    let array = [{id: 1}, {id: 2}, {id: 3}];
    let target = [{id: 1}, {id: 2}, {id: 3}];
    ArrayHelper.push_distinct(array, {id: 2});
    expect(array).toEqual(target);
})

test('unique with objects', () => {
    let array = [{id: 1}, {id: 2}, {id: 2}, {id: 3}];
    let target = [{id: 1}, {id: 2}, {id: 3}];
    let actual = ArrayHelper.distinct(array);
    expect(actual).toEqual(target)
})

test('findAll', () => {
    let array = [{id: 1}, {id: 2}, {id: 2}, {id: 3}, {id: 2}];

    expect(ArrayHelper.findAll(array, {id: 2})).toEqual([1, 2, 4]);
})

test('findAllFrom', () => {
    let array = [{id: 1}, {id: 2}, {id: 2}, {id: 3}, {id: 2}];
    let expected = new MagicMap();
    expected.set(1, {"id": 2});
    expected.set(2, {"id": 2});
    expected.set(3, {"id": 3});
    expected.set(4, {"id": 2});

    expect(ArrayHelper.findAllFrom(array, [{id: 2}, {id: 3}])).toEqual(expected);
})

test('powerSet', () => {
    let array = ['a', 'b', 'c', 'd'];

    expect(ArrayHelper.powerSet(array)).toEqual([
        ['a'],
        ['b'],
        ['a', 'b'],
        ['c'],
        ['a', 'c'],
        ['b', 'c'],
        ['a', 'b', 'c'],
        ['d'],
        ['a', 'd'],
        ['b', 'd'],
        ['a', 'b', 'd'],
        ['c', 'd'],
        ['a', 'c', 'd'],
        ['b', 'c', 'd'],
        ['a', 'b', 'c', 'd'],
    ])
})

test('equals with same object', () => {
    let array = [0, 1, 2, 3];
    expect(ArrayHelper.equals(array, array)).toBeTruthy();
})

test('equals with null', () => {
    expect(ArrayHelper.equals([0, 1, 2, 3], null)).toBeFalsy();
})

test('equals with both null', () => {
    expect(ArrayHelper.equals(null, null)).toBeTruthy()
})

test('equals', () => {
    expect(ArrayHelper.equals([
        'a', 'b', {id: 'c'}, 'd', 'a'
    ], [
        {id: 'c'}, 'b', 'd', 'a', 'a'
    ])).toBeTruthy();
})

test('equals array length check', () => {
    expect(ArrayHelper.equals([
        'a', 'b',
    ], [
        {id: 'c'}, 'b', 'd'
    ])).toBeFalsy();
})

test('equals failure case', () => {
    expect(ArrayHelper.equals([
        'a', 'b', 'c'
    ], [
        {id: 'c'}, 'b', 'd'
    ])).toBeFalsy();
})

test('distinct', () => {
    expect(ArrayHelper.distinct([
        0, 1, 2, 1, 2, {id: 1}, {id: 2}, {id: 1}
    ])).toEqual([
        0, 1, 2, {id: 1}, {id: 2}
    ])
})