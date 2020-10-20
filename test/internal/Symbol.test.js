import Symbol from "../../src/internal/Symbol.js";

test('Sorting symbols correctly', () => {
    let input = [Symbol.of("B"), Symbol.of("A")];
    let target = [Symbol.of("A"), Symbol.of("B")];
    expect(Symbol.sort(input)).toEqual(target);
})

test('Sorting symbols correctly with duplicates', () => {
    let input = [Symbol.of("B"), Symbol.of("A"), Symbol.of("A")];
    let target = [Symbol.of("A"), Symbol.of("A"),Symbol.of("B")];
    expect(Symbol.sort(input)).toEqual(target);
})