import State from "../../../src/internal/pda/State.js";

test('test withAccept', () => {
    expect(State.p(0, false).withAccept()).toEqual(State.p(0, true))
})

test('test withoutAccept', () => {
    expect(State.p(0, true).withoutAccept()).toEqual(State.p(0, false))
})