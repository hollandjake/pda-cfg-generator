import MagicSet from "../../../src/internal/helper/MagicSet.js";

test('has', () => {
    let set = new MagicSet();
    set.add({id: 1});
    let has = set.has({id: 1});
    expect(has).toBeTruthy();
})

test('delete', () => {
    let set = new MagicSet();
    set.add({id: 1});
    let deleted = set.delete({id: 1});
    expect(deleted).toBeTruthy();
    expect(set.size).toEqual(0);
})