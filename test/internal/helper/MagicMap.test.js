import Symbol from "../../../src/internal/Symbol.js";
import MagicMap from "../../../src/internal/helper/MagicMap.js";
import Variable from "../../../src/internal/cfg/Variable.js";

test('Objects of equal hash are identical', () => {
    let obj1 = new Symbol("a");
    let obj2 = new Symbol("a");
    let obj3 = 'a';
    let obj4 = new Variable("a");

    let map = new MagicMap();
    map.set(obj1, 1);
    map.set(obj2, 2);
    map.set(obj3, 3);
    map.set(obj4, 4);
    expect(map.get(obj1)).toBe(2);
    expect(map.get(obj2)).toBe(2);
    expect(map.get(obj3)).toBe(3);
    expect(map.get(obj4)).toBe(4);
})

test('Testing has', () => {
    let obj1 = new Symbol("a");
    let obj2 = new Symbol("a");

    let map = new MagicMap();
    map.set(obj1, 1);

    expect(map.has(obj2)).toBe(true);
})