import CFL from "../cfl/CFL.js";
import Rule from "./Rule.js";
import Variable from "./Variable.js";
import CFG from "./CFG.js";

export default class CFGReduce {
    /**
     * @param {CFG} cfg
     * @return {CFG}
     */
    static reduce(cfg) {
        /*
         * Find Set of Pairs of variables (A,B) such that the L(A) = L(B)
         * For each (A,B):
         *      MIN_VAR = MIN(|R_A|,|R_B|) Variable which produces the fewest rules
         */


        let cfl = CFL.fromCFG(cfg);

        return this.CFLtoCFG(cfl);
    }

    /**
     * @param {CFL} cfl
     * @return {CFG}
     */
    static CFLtoCFG(cfl) {
        let paths = cfl.paths;
        let rules = paths.map(path => {
            return new Rule(Variable.S, path);
        });
        return CFG.fromRules(rules);
    }
}