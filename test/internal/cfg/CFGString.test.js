import CFGString from "../../../src/internal/cfg/CFGString.js";
import Variable from "../../../src/internal/cfg/Variable.js";

test('CFGString.from with subscript', () => {
    expect(CFGString.from("S\u2080")).toEqual([Variable.of("S", 0)])
})