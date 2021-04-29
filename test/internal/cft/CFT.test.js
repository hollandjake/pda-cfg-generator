import CFG from "../../../src/internal/cfg/CFG.js";
import CFT from "../../../src/internal/cft/CFT.js";
import Terminal from "../../../src/internal/cfg/Terminal.js";

test('fromCFG', async () => {
    let cfg = CFG.fromString('S->e,S->AD,S->Ab,A->aa,B->CD,B->Cb, C->aa,D->Bb');

    let x = await CFT.fromCFG(cfg, 5);
    expect(x).toEqual([
        [Terminal.EPSILON],
        [Terminal.of("a"), Terminal.of("a"), Terminal.of("a"), Terminal.of("a"), Terminal.of("b"), Terminal.of("b")],
        [Terminal.of("a"), Terminal.of("a"), Terminal.of("b")]
    ]);
})