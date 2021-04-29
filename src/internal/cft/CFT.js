import MagicMap from "../helper/MagicMap.js";
import Variable from "../cfg/Variable.js";
import ArrayHelper from "../helper/ArrayHelper.js";
import Terminal from "../cfg/Terminal.js";

/**
 * CONTEXT-FREE TREE
 */
export default class CFT {
    /**z
     *
     * @param {CFG}cfg
     * @param {number} depth
     * @returns {[[Terminal]]}
     */
    static fromCFG(cfg, depth) {
        let rules = cfg.rules;

        let variableMappings = new MagicMap();

        cfg.variables.forEach(variable => {
            variableMappings.set(variable, rules.filter(r => variable.equals(r.inputVariable)).map(r => r.outputList));
        });

        return CFT.dive([[cfg.startVariable]], variableMappings, depth);
    }

    /**
     * @param layer
     * @param variableMappings
     * @param remainingDepth
     * @returns {[[Terminal]]}
     */
    static dive(layer, variableMappings, remainingDepth) {
        for (let i = remainingDepth; i > 0; i--) {
            layer = layer
                .map(sequence => {
                    let sequenceNewLayer = sequence.map(element => {
                        if (element instanceof Variable) {
                            return variableMappings.get(element);
                        } else {
                            return [[element]];
                        }
                    });

                    return this.expandMapping(sequenceNewLayer);
                })
                .flat()
                .map(sequence => {
                    let newSequence = sequence.filter(element => !Terminal.EPSILON.equals(element));
                    if (newSequence.length > 0) {
                        return newSequence;
                    } else {
                        return [Terminal.EPSILON];
                    }
                });
        }

        let array = layer.filter(sequence => !sequence.some(element => element instanceof Variable));
        return ArrayHelper.distinct(array);
    }

    /**
     * Generates all possible of combinations of concatenations on a collection of array of sequences
     *
     * e.g.
     * [
     *  [
     *      [A,B],
     *      [C,D]
     *  ],
     *  [
     *      [E,F],
     *      [G]
     *  ]
     * ]
     *
     * would produce
     * [
     *  [A,B,E,F],
     *  [A,B,G],
     *  [C,D,E,F],
     *  [C,D,G]
     * ]
     *
     *
     * @param {[[[Symbol]]]} m
     * @returns {[[Symbol]]}
     */
    static expandMapping(m) {
        //Initialise with the first element from the mapping
        let outputs = m.shift();

        for (const element of m) {
            outputs = element.map(sequence => outputs.map(output => output.concat(sequence))).flat();
        }

        return outputs;
    }
}