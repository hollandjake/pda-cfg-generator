import CFG from "../../../src/internal/cfg/CFG.js";
import CFL from "../../../src/internal/cfl/CFL.js";
import Terminal from "../../../src/internal/cfg/Terminal.js";
import PathSegment from "../../../src/internal/cfl/PathSegment.js";

test('L = a^{n}b^{2n}, n>=0', () => {
    let cfg = CFG.fromString("S->aaPb,P->aaPb,P->e");

    let cfl = CFL.fromCFG(cfg);
    let target = [
        [Terminal.of('a'), Terminal.of('a'), Terminal.of('b')],
        [Terminal.of('a'), Terminal.of('a'), PathSegment.from([Terminal.of('a'), Terminal.of('a')]), PathSegment.from([Terminal.of('b')]), Terminal.of('b')]
    ];
    expect(cfl.paths).toEqual(target);
})