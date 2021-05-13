import CFGNormalise from "../../../src/internal/cfg/CFGNormalise.js";
import Rule from "../../../src/internal/cfg/Rule.js";
import Variable from "../../../src/internal/cfg/Variable.js";
import CFG from "../../../src/internal/cfg/CFG.js";

test('Step 4', () => {
    let cfg = CFG.fromRules([
        Rule.fromString('S -> ASASA'),
        Rule.fromString('A -> ASASA')
    ], Variable.S)

    let newRules = CFGNormalise.step4(cfg.rules, cfg);

    expect(Rule.sort(newRules)).toEqual(Rule.sort([
        Rule.fromString('S -> AE'),
        Rule.fromString('A -> AB'),
        Rule.fromString('B -> SC'),
        Rule.fromString('C -> AD'),
        Rule.fromString('D -> SA'),
        Rule.fromString('E -> SF'),
        Rule.fromString('F -> AD'),
    ]))
})

test('Replace Terminals', () => {
    let ruleset = [
        Rule.fromString('S -> aa'),
        Rule.fromString('S -> aA'),
        Rule.fromString('A -> B'),
        Rule.fromString('B -> b')
    ];

    let newRules = CFGNormalise.replaceTerminals(ruleset, CFG.fromRules(ruleset));

    expect(Rule.sort(newRules)).toEqual(Rule.sort([
        Rule.fromString('S -> CC'),
        Rule.fromString('S -> CA'),
        Rule.fromString('A -> B'),
        Rule.fromString('B -> b'),
        Rule.fromString('C -> a')
    ]))
})