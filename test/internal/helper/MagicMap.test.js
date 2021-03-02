import MagicMap from "../../../src/internal/helper/MagicMap.js";

test('deletion', () => {
    let map = new MagicMap();
    map.set({id: 1}, 5);
    let deleted = map.delete({id: 1});
    expect(deleted).toBeTruthy();
    expect(map.size).toEqual(0);
})