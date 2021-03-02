import CFG from "../../../src/internal/cfg/CFG.js";
import CFL from "../../../src/internal/cfl/CFL.js";
import Terminal from "../../../src/internal/cfg/Terminal.js";
import PathSegment from "../../../src/internal/cfl/PathSegment.js";
import Variable from "../../../src/internal/cfg/Variable.js";

test('expandMapping', () => {
    let mapping = [
        [
            [Variable.of('A'), Variable.of('B')],
            [Variable.of('C'), Variable.of('D')]
        ],
        [
            [Variable.of('E'), Variable.of('F')],
            [Variable.of('G')]
        ]
    ]
    expect(CFL.expandMapping(mapping)).toEqual([
        [Variable.of('A'), Variable.of('B'), Variable.of('E'), Variable.of('F')],
        [Variable.of('C'), Variable.of('D'), Variable.of('E'), Variable.of('F')],
        [Variable.of('A'), Variable.of('B'), Variable.of('G')],
        [Variable.of('C'), Variable.of('D'), Variable.of('G')]
    ])
})

test('L = a^{n}b^{2n}, n>0', () => {
    let cfg = CFG.fromString("S->aaPb,P->aaPb,P->e");

    let cfl = CFL.fromCFG(cfg);
    let target = [
        [Terminal.of('a'), Terminal.of('a'), Terminal.of('b')],
        [Terminal.of('a'), Terminal.of('a'), PathSegment.from([Terminal.of('a'), Terminal.of('a')]), PathSegment.from([Terminal.of('b')]), Terminal.of('b')]
    ];
    expect(cfl.paths).toEqual(target);
})