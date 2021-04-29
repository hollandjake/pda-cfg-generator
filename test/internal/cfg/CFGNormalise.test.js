import CFGNormalise from "../../../src/internal/cfg/CFGNormalise.js";
import Rule from "../../../src/internal/cfg/Rule.js";
import Variable from "../../../src/internal/cfg/Variable.js";
import CFG from "../../../src/internal/cfg/CFG.js";

test('Step 4', () => {
    let cfg = CFG.fromRules([
        Rule.fromString('S -> ASA'),
        Rule.fromString('A -> ASA')
    ], Variable.S)

    let newRules = CFGNormalise.step4(cfg.rules, cfg);

    expect(newRules).toEqual(Rule.sort([
        Rule.fromString('S -> AB'),
        Rule.fromString('A -> AB'),
        Rule.fromString('B -> SA'),
    ]))
})

test('Replace Terminals', () => {
    let newRules = CFGNormalise.replaceTerminals([
        Rule.fromString('S -> aA'),
        Rule.fromString('A -> B'),
        Rule.fromString('B -> b')
    ], CFG.fromRules([Rule.fromString('S -> aA'),
        Rule.fromString('A -> B'),
        Rule.fromString('B -> b')]));

    expect(Rule.sort(newRules)).toEqual(Rule.sort([
        Rule.fromString('S -> CA'),
        Rule.fromString('A -> B'),
        Rule.fromString('B -> b'),
        Rule.fromString('C -> a')
    ]))
})