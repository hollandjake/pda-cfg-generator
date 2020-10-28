import Subscript from "../../../src/internal/helper/Subscript.js";

test('All valid characters map to subscript', () => {
    expect(Subscript.of('0')).toEqual(Subscript.SUBSCRIPTS["0"]);
    expect(Subscript.of('1')).toEqual(Subscript.SUBSCRIPTS["1"]);
    expect(Subscript.of('2')).toEqual(Subscript.SUBSCRIPTS["2"]);
    expect(Subscript.of('3')).toEqual(Subscript.SUBSCRIPTS["3"]);
    expect(Subscript.of('4')).toEqual(Subscript.SUBSCRIPTS["4"]);
    expect(Subscript.of('5')).toEqual(Subscript.SUBSCRIPTS["5"]);
    expect(Subscript.of('6')).toEqual(Subscript.SUBSCRIPTS["6"]);
    expect(Subscript.of('7')).toEqual(Subscript.SUBSCRIPTS["7"]);
    expect(Subscript.of('8')).toEqual(Subscript.SUBSCRIPTS["8"]);
    expect(Subscript.of('9')).toEqual(Subscript.SUBSCRIPTS["9"]);
    expect(Subscript.of('+')).toEqual(Subscript.SUBSCRIPTS["+"]);
    expect(Subscript.of('-')).toEqual(Subscript.SUBSCRIPTS["-"]);
    expect(Subscript.of('a')).toEqual(Subscript.SUBSCRIPTS["a"]);
    expect(Subscript.of('e')).toEqual(Subscript.SUBSCRIPTS["e"]);
    expect(Subscript.of('h')).toEqual(Subscript.SUBSCRIPTS["h"]);
    expect(Subscript.of('k')).toEqual(Subscript.SUBSCRIPTS["k"]);
    expect(Subscript.of('l')).toEqual(Subscript.SUBSCRIPTS["l"]);
    expect(Subscript.of('m')).toEqual(Subscript.SUBSCRIPTS["m"]);
    expect(Subscript.of('n')).toEqual(Subscript.SUBSCRIPTS["n"]);
    expect(Subscript.of('o')).toEqual(Subscript.SUBSCRIPTS["o"]);
    expect(Subscript.of('p')).toEqual(Subscript.SUBSCRIPTS["p"]);
    expect(Subscript.of('s')).toEqual(Subscript.SUBSCRIPTS["s"]);
    expect(Subscript.of('t')).toEqual(Subscript.SUBSCRIPTS["t"]);
    expect(Subscript.of('x')).toEqual(Subscript.SUBSCRIPTS["x"]);
});

test('Invalid characters are mapped to \'\'',() => {
    expect(Subscript.of('b')).toEqual('');
})

test('Multiple characters are mapped correctly', () => {
    expect(Subscript.of('10')).toEqual(Subscript.SUBSCRIPTS["1"]+Subscript.SUBSCRIPTS["0"]);
})

test('Case insensitive', () => {
    expect(Subscript.of('A')).toEqual(Subscript.of('a'));
})

test('getKey', () => {
    expect(Subscript.getKey('a')).toEqual(null);
    expect(Subscript.getKey('\u2080')).toEqual("0");
})

test('of', () => {
    expect(Subscript.of('p0')).toEqual(Subscript.SUBSCRIPTS['p']+Subscript.SUBSCRIPTS['0'])
})