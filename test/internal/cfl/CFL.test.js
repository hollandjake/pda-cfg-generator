import CFG from "../../../src/internal/cfg/CFG.js";
import CFL from "../../../src/internal/cfl/CFL.js";
import Terminal from "../../../src/internal/cfg/Terminal.js";
import PathSegment from "../../../src/internal/cfl/PathSegment.js";
import Variable from "../../../src/internal/cfg/Variable.js";


test('expandMapping', () => {
    let mapping = [
        [[Terminal.of('a')]],
        [[Variable.of('B'), Variable.of('C')], [Terminal.EPSILON]]
    ]
    expect(CFL.expandMapping(mapping)).toEqual([
        [Terminal.of('a'), Variable.of('B'), Variable.of('C')],
        [Terminal.of('a'), Terminal.EPSILON]
    ])
})

test('L = a^{n}b^{2n}, n>=0', () => {
    let cfg = CFG.fromString("S->aaPb,P->aaPb,P->e");

    let cfl = CFL.fromCFG(cfg);
    let target = [
        [Terminal.of('a'), Terminal.of('a'), Terminal.of('b')],
        [Terminal.of('a'), Terminal.of('a'), PathSegment.from([Terminal.of('a'), Terminal.of('a')]), PathSegment.from([Terminal.of('b')]), Terminal.of('b')]
    ];
    expect(cfl.paths).toEqual(target);
})

test('L = a^{n}b^{2n}, n>=0 Chomsky Form', () => {
    let cfg = CFG.fromString("S->BA,S->CA,P->BA,P->CA,A->b,B->CP,C->DD,D->a,P->e");

    let cfl = CFL.fromCFG(cfg);
    let target = [
        [Terminal.of('a'), Terminal.of('a'), Terminal.of('b')],
        [Terminal.of('a'), Terminal.of('a'), PathSegment.from([Terminal.of('a'), Terminal.of('a')]), PathSegment.from([Terminal.of('b')]), Terminal.of('b')]
    ];
    expect(cfl.paths).toEqual(target);
})


test('L = a^{n}b^{2n}s, n>=0 Chomsky Form', () => {
    let cfg = CFG.fromString("S->ASA,S->aB,A->B,A->S,B->b,B->e");
    let cfg2 = CFG.fromString("O->AC,O->UB,O->a,O->SA,O->AS,S->AC,S->UB,S->a,S->SA,S->AS,A->b,A->AC,A->UB,A->a,A->SA,A->AS,C->SA,U->a,B->b");

    let cfl1 = CFL.fromCFG(cfg);
    let cfl2 = CFL.fromCFG(cfg2);
    expect(cfl1.paths).toEqual(cfl2.paths);
})