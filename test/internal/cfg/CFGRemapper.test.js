import CFG from "../../../src/internal/cfg/CFG.js";
import CFGRemapper from "../../../src/internal/cfg/CFGRemapper.js";
import Rule from "../../../src/internal/cfg/Rule.js";
import Variable from "../../../src/internal/cfg/Variable.js";
import Terminal from "../../../src/internal/cfg/Terminal.js";

test('remaps correctly', () => {
    let cfg = CFG.fromString('S->AS,A->a,S->e');

    let actual = CFGRemapper.remap(cfg);
    expect(actual).toEqual(CFG.fromRules([
        new Rule(Variable.S, [Variable.of('A'), Variable.S]),
        new Rule(Variable.of('A'), [Terminal.of('a')]),
        new Rule(Variable.S, [Terminal.EPSILON])
    ], Variable.S));
})

test('wont map with two S variables', () => {
    let cfg = CFG.fromString("S->A,A->B,B->C,C->D,D->E,E->F,F->G,G->H,H->I,I->J,J->K,K->L,L->M,M->N,N->O,O->P,P->Q,Q->R,R->T");

    let actual = CFGRemapper.remap(cfg);

    expect(actual).toEqual(CFG.fromString("S->A,A->B,B->C,C->D,D->E,E->F,F->G,G->H,H->I,I->J,J->K,K->L,L->M,M->N,N->O,O->P,P->Q,Q->R,R->T"))
})