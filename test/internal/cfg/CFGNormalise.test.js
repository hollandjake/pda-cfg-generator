import CFGNormalise from "../../../src/internal/cfg/CFGNormalise.js";
import Rule from "../../../src/internal/cfg/Rule.js";
import Variable from "../../../src/internal/cfg/Variable.js";
import CFG from "../../../src/internal/cfg/CFG.js";

test('Step 4 - Simplified', () => {
    let newRules = CFGNormalise.step4([
        Rule.fromString('S\u2080 -> ASA'),
        Rule.fromString('S -> ASA'),
        Rule.fromString('A -> ASA')
    ]);

    expect(newRules).toEqual(Rule.sort([
        Rule.fromString('A\u2081 -> SA'),
        Rule.fromString('A -> AA\u2081'),
        Rule.fromString('S\u2080 -> AA\u2081'),
        Rule.fromString('S -> AA\u2081')
    ]))
})

test('Step 4', () => {
    let cfg = CFG.fromRules([
        Rule.fromString('S\u2080 -> ASA'),
        Rule.fromString('S\u2080 -> aB'),
        Rule.fromString('S\u2080 -> a'),
        Rule.fromString('S\u2080 -> SA'),
        Rule.fromString('S\u2080 -> AS'),
        Rule.fromString('S -> ASA'),
        Rule.fromString('S -> aB'),
        Rule.fromString('S -> a'),
        Rule.fromString('S -> SA'),
        Rule.fromString('S -> AS'),
        Rule.fromString('A -> b'),
        Rule.fromString('A -> ASA'),
        Rule.fromString('A -> aB'),
        Rule.fromString('A -> a'),
        Rule.fromString('A -> SA'),
        Rule.fromString('A -> AS'),
        Rule.fromString('B -> b')
    ], Variable.of('S', 0))
    let newRules = CFGNormalise.step4(cfg.rules, cfg);

    let actual = Rule.sort(newRules);
    expect(actual).toEqual(Rule.sort([
        Rule.fromString('S\u2080 -> AA\u2081'),
        Rule.fromString('S\u2080 -> CB'),
        Rule.fromString('S\u2080 -> a'),
        Rule.fromString('S\u2080 -> SA'),
        Rule.fromString('S\u2080 -> AS'),
        Rule.fromString('S -> AA\u2081'),
        Rule.fromString('S -> CB'),
        Rule.fromString('S -> a'),
        Rule.fromString('S -> SA'),
        Rule.fromString('S -> AS'),
        Rule.fromString('A -> b'),
        Rule.fromString('A -> AA\u2081'),
        Rule.fromString('A -> CB'),
        Rule.fromString('A -> a'),
        Rule.fromString('A -> SA'),
        Rule.fromString('A -> AS'),
        Rule.fromString('A\u2081 -> SA'),
        Rule.fromString('C -> a'),
        Rule.fromString('B -> b')
    ]))
})

test('Replace Terminals', () => {
    let newRules = CFGNormalise.replaceTerminals([
        Rule.fromString('S -> aA'),
        Rule.fromString('A -> B'),
        Rule.fromString('B -> b')
    ],CFG.fromRules([Rule.fromString('S -> aA'),
        Rule.fromString('A -> B'),
        Rule.fromString('B -> b')]));

    expect(Rule.sort(newRules)).toEqual(Rule.sort([
        Rule.fromString('S -> CA'),
        Rule.fromString('A -> B'),
        Rule.fromString('B -> b'),
        Rule.fromString('C -> a')
    ]))
})