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
     * @param {number} maxLength
     * @returns {[[Terminal]]}
     */
    static fromCFG(cfg, maxLength) {
        let rules = cfg.rules;

        let variableMappings = new MagicMap();

        cfg.variables.forEach(variable => {
            variableMappings.set(variable, rules.filter(r => variable.equals(r.inputVariable)).map(r => r.outputList));
        });

        return CFT.dive([[cfg.startVariable]], variableMappings, maxLength);
    }

    /**
     * @param {[[Symbol]]} layer
     * @param variableMappings
     * @param maxLength
     * @returns {[[Terminal]]}
     */
    static dive(layer, variableMappings, maxLength) {
        let prevLayer;
        let startTime = performance.now();
        let maxDuration = maxLength * 1000; // 1 second per length

        main:
            while (performance.now() - startTime < maxDuration) {
                prevLayer = layer;

                let newLayer = [];
                for (let sequence of layer) {
                    if (performance.now() - startTime > maxDuration) break main;

                    let sequenceNewLayer = sequence.map(element => {
                        if (element instanceof Variable) {
                            return variableMappings.get(element);
                        } else {
                            return [[element]];
                        }
                    });

                    newLayer.push(this.expandMapping(sequenceNewLayer));
                }

                layer = ArrayHelper.fast_distinct(newLayer.flat())
                    .map(sequence => {
                        let newSequence = sequence.filter(element => !Terminal.EPSILON.equals(element));
                        if (newSequence.length > 0) {
                            return newSequence;
                        } else {
                            return [Terminal.EPSILON];
                        }
                    })
                    .filter(sequence => sequence.filter(x => x instanceof Terminal).length <= maxLength);

                if (ArrayHelper.equals(prevLayer, layer)) {
                    break;
                }
            }

        return ArrayHelper.fast_distinct(layer).filter(sequence => !sequence.some(element => element instanceof Variable))
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