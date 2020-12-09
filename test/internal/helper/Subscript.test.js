import Subscript from "../../../src/internal/helper/Subscript.js";

test('of with already subscript', () => {
    expect(Subscript.of('p\u2080q')).toEqual("\u209A\u2080")
})