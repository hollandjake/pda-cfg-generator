import CFGSymbol from "../../../src/internal/cfg/CFGSymbol.js";
import Variable from "../../../src/internal/cfg/Variable.js";

test('of', () => {
    expect(CFGSymbol.of('S',0)).toEqual(new Variable('S',0));
})

test('from', () => {
    expect(CFGSymbol.from('SS\u2080AX')).toEqual([
        CFGSymbol.of('S'),
        CFGSymbol.of('S\u2080'),
        CFGSymbol.of('A'),
        CFGSymbol.of('X')
    ])
})