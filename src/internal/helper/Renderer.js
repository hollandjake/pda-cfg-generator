import PDA from "../pda/PDA.js";
export default class Renderer {
    constructor(graphElement) {
        this._graphElement = graphElement;
    }

    /**
     *
     * @param {PDA} pda
     */
    convertToDotNotation(pda) {
        return 'digraph {' +
            'rankdir=LR;' +
            `node [shape = circle, color=green]; ${pda.startState.id};` +
            `node [shape = doublecircle, color=black]; ${pda.acceptStates.map(acceptState => acceptState.id).join(" ")};` +
            'node [shape = circle];' +
            `${pda.transitions.map(transition => Renderer.#convertTransitionToDotNotation(transition)).join("\n")}` +
            '}'
    }

    /**
     *
     * @param {Transition} transition
     * @returns {*}
     */
    static #convertTransitionToDotNotation(transition) {
        return `${transition.fromState.id} -> ${transition.toState.id} [label = "${transition.input}, ${transition.stackHead} → ${transition.stackPush}", color = black ];`;
    }

    /**
     * @param {PDA} pda
     */
    render(pda) {
        this.renderWithVisJs(pda);
        this.renderWithVizJs(pda);
        this.renderWithDagreJs(pda);
    }

    renderWithVisJs(pda) {
        let dotNotation = this.convertToDotNotation(pda);
        dotNotation = dotNotation.replace("node [shape = doublecircle, color=black];", "node [shape = doublecircle, color=red ];");
        let options = {
            layout: {
                randomSeed: 0
            },
            interaction: {
                dragNodes: false,
                dragView: false
            },
            nodes: {
                fixed: false
            },
            edges: {
                smooth: {
                    enabled: true
                },
                physics: true
            },
            physics: {
                forceAtlas2Based: {
                    gravitationalConstant: -26,
                    centralGravity: 0.005,
                    springLength: 230,
                    springConstant: 0.18,
                    avoidOverlap: 1.5
                },
                maxVelocity: 146,
                solver: 'forceAtlas2Based',
                timestep: 0.35,
                stabilization: {
                    enabled: true,
                    iterations: 1000,
                    updateInterval: 25
                }
            }
        };

        let network = new vis.Network(this._graphElement, {}, options);

        let data = vis.parseDOTNetwork(dotNotation);
        network.setData(data);
        network.on("stabilizationIterationsDone", function () {
            network.setOptions( { nodes: {fixed: true} } );
        });
    }

    renderWithVizJs(pda) {
        let dotNotation = this.convertToDotNotation(pda);
        try {
            let result = Viz(dotNotation, 'svg', 'dot');
            this._graphElement.innerHTML = result;
        } catch (e) {
            this._graphElement.innerHTML = e;
        }
    }

    /**
     *
     * @param {PDA} pda
     */
    renderWithDagreJs(pda) {

        let dotNotation = this.convertToDotNotation(pda);
        dotNotation = dotNotation.replace("doublecircle", "circle");


        let render = dagreD3.render();

        let g = graphlibDot.read(dotNotation);


        // Set margins, if not present
        if (!g.graph().hasOwnProperty("marginx") &&
            !g.graph().hasOwnProperty("marginy")) {
            g.graph().marginx = 20;
            g.graph().marginy = 20;
        }

        g.graph().transition = function(selection) {
            return selection.transition().duration(500);
        };

        var svg = d3.select("#dagre"),
            inner = svg.select("g");

        // Set up zoom support
        var zoom = d3.zoom().on("zoom", function() {
            inner.attr("transform", d3.event.transform);
        });
        svg.call(zoom);

        //Render the graph into svg g
        render(inner, g);

        var initialScale = 1;
        svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * initialScale) / 2, 20).scale(initialScale));

        svg.attr('height', g.graph().height * initialScale + 40);
    }
}