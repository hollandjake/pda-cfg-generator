import ArrayHelper from "../../../src/internal/helper/ArrayHelper.js";

test('push_unique with array', () => {
    let array = [0, 1, 2, 3];
    let target = [0, 1, 2, 3];
    ArrayHelper.push_distinct(array, 2);
    expect(array).toEqual(target);
})

test('push_unique with single object', () => {
    let array = [{id: 1}];
    let target = [{id: 1}, {id: 2}];
    ArrayHelper.push_distinct(array, {id: 2});
    expect(array).toEqual(target);
})

test('push_unique with multiple objects', () => {
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