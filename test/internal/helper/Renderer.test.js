import Renderer from "../../../src/internal/helper/Renderer.js";
import Transition from "../../../src/internal/pda/Transition.js";
import State from "../../../src/internal/pda/State.js";
import InputSymbol from "../../../src/internal/pda/InputSymbol.js";
import StackSymbol from "../../../src/internal/pda/StackSymbol.js";
import PDA from "../../../src/internal/pda/PDA.js";

test('Can convert to DOT notation', () => {
    let testPDA = PDA.fromTransitions([
        new Transition(State.p0, State.p(1, true), InputSymbol.EPSILON, StackSymbol.EMPTY_STACK, StackSymbol.EMPTY_STACK),
        new Transition(State.p0, State.p(2), InputSymbol.EPSILON, StackSymbol.EMPTY_STACK, StackSymbol.EMPTY_STACK)
    ], State.p0);
    expect(Renderer.convertToDotNotation(testPDA)).toBe("digraph {" +
        "rankdir=LR;" +
        "node [shape = circle, color=green]; p\u2080;" +
        "node [shape = doublecircle, color=black]; p\u2081;" +
        "node [shape = circle, color=black];" +
        "p\u2080 -> p\u2081 [label = \"ε, $ → $\", color = black ]; " +
        "p\u2080 -> p\u2082 [label = \"ε, $ → $\", color = black ];}");
});

test('Can create Renderer instance', () => {
    let DOMNode = HTMLElement.DOCUMENT_NODE;
    let renderer = new Renderer(DOMNode);
    expect(renderer.graphElement).toBe(DOMNode);
})

test('Map To Latex', () => {
    let html = "<svg width=\"456pt\" height=\"156pt\" viewBox=\"0.00 0.00 456.00 156.00\" xmlns=\"http://www.w3.org/2000/svg\" >\n" +
        "<g id=\"graph0\" class=\"graph\" transform=\"scale(1 1) rotate(0) translate(4 152)\">\n" +
        "<title>%3</title>\n" +
        "<polygon fill=\"white\" stroke=\"none\" points=\"-4,4 -4,-152 452,-152 452,4 -4,4\"></polygon>\n" +
        "<!-- p₀ -->\n" +
        "<g id=\"node1\" class=\"node\"><title>p₀</title>\n" +
        "<ellipse fill=\"none\" stroke=\"green\" cx=\"23\" cy=\"-85\" rx=\"23.2159\" ry=\"23.2159\"></ellipse>\n" +
        "<text text-anchor=\"middle\" x=\"23\" y=\"-80.8\" font-family=\"Times,serif\" font-size=\"14.00\">p₀</text>\n" +
        "</g>\n" +
        "<!-- p₁ -->\n" +
        "<g id=\"node3\" class=\"node\"><title>p₁</title>\n" +
        "<ellipse fill=\"none\" stroke=\"black\" cx=\"153\" cy=\"-85\" rx=\"23.2159\" ry=\"23.2159\"></ellipse>\n" +
        "<text text-anchor=\"middle\" x=\"153\" y=\"-80.8\" font-family=\"Times,serif\" font-size=\"14.00\">p₁</text>\n" +
        "</g>\n" +
        "<!-- p₀&#45;&gt;p₁ -->\n" +
        "<g id=\"edge1\" class=\"edge\"><title>p₀-&gt;p₁</title>\n" +
        "<path fill=\"none\" stroke=\"black\" d=\"M46.2959,-85C66.4538,-85 96.3882,-85 119.261,-85\"></path>\n" +
        "<polygon fill=\"black\" stroke=\"black\" points=\"119.53,-88.5001 129.53,-85 119.53,-81.5001 119.53,-88.5001\"></polygon>\n" +
        "<text text-anchor=\"middle\" x=\"88\" y=\"-89.2\" font-family=\"Times,serif\" font-size=\"14.00\">a, ε → B</text>\n" +
        "</g>\n" +
        "<!-- p₄ -->\n" +
        "<g id=\"node2\" class=\"node\"><title>p₄</title>\n" +
        "<ellipse fill=\"none\" stroke=\"black\" cx=\"421\" cy=\"-27\" rx=\"23.1999\" ry=\"23.1999\"></ellipse>\n" +
        "<ellipse fill=\"none\" stroke=\"black\" cx=\"421\" cy=\"-27\" rx=\"27.2158\" ry=\"27.2158\"></ellipse>\n" +
        "<text text-anchor=\"middle\" x=\"421\" y=\"-22.8\" font-family=\"Times,serif\" font-size=\"14.00\">p₄</text>\n" +
        "</g>\n" +
        "<!-- p₁&#45;&gt;p₁ -->\n" +
        "<g id=\"edge2\" class=\"edge\"><title>p₁-&gt;p₁</title>\n" +
        "<path fill=\"none\" stroke=\"black\" d=\"M141.495,-105.251C139.54,-116.109 143.375,-126 153,-126 159.467,-126 163.32,-121.535 164.559,-115.312\"></path>\n" +
        "<polygon fill=\"black\" stroke=\"black\" points=\"168.059,-115.232 164.505,-105.251 161.059,-115.27 168.059,-115.232\"></polygon>\n" +
        "<text text-anchor=\"middle\" x=\"153\" y=\"-130.2\" font-family=\"Times,serif\" font-size=\"14.00\">a, ε → B</text>\n" +
        "</g>\n" +
        "<!-- p₂ -->\n" +
        "<g id=\"node4\" class=\"node\"><title>p₂</title>\n" +
        "<ellipse fill=\"none\" stroke=\"black\" cx=\"287\" cy=\"-125\" rx=\"23.2159\" ry=\"23.2159\"></ellipse>\n" +
        "<text text-anchor=\"middle\" x=\"287\" y=\"-120.8\" font-family=\"Times,serif\" font-size=\"14.00\">p₂</text>\n" +
        "</g>\n" +
        "<!-- p₁&#45;&gt;p₂ -->\n" +
        "<g id=\"edge3\" class=\"edge\"><title>p₁-&gt;p₂</title>\n" +
        "<path fill=\"none\" stroke=\"black\" d=\"M174.051,-94.9115C180.338,-97.7768 187.369,-100.738 194,-103 213.619,-109.694 236.258,-115.135 254.169,-118.932\"></path>\n" +
        "<polygon fill=\"black\" stroke=\"black\" points=\"253.61,-122.39 264.11,-120.974 255.019,-115.533 253.61,-122.39\"></polygon>\n" +
        "<text text-anchor=\"middle\" x=\"220\" y=\"-121.2\" font-family=\"Times,serif\" font-size=\"14.00\">ε, B → ε</text>\n" +
        "</g>\n" +
        "<!-- p₃ -->\n" +
        "<g id=\"node5\" class=\"node\"><title>p₃</title>\n" +
        "<ellipse fill=\"none\" stroke=\"black\" cx=\"287\" cy=\"-27\" rx=\"23.2159\" ry=\"23.2159\"></ellipse>\n" +
        "<text text-anchor=\"middle\" x=\"287\" y=\"-22.8\" font-family=\"Times,serif\" font-size=\"14.00\">p₃</text>\n" +
        "</g>\n" +
        "<!-- p₁&#45;&gt;p₃ -->\n" +
        "<g id=\"edge5\" class=\"edge\"><title>p₁-&gt;p₃</title>\n" +
        "<path fill=\"none\" stroke=\"black\" d=\"M171.062,-70.2626C177.858,-64.9508 185.966,-59.2696 194,-55.2 213.024,-45.5635 235.952,-38.5254 254.16,-33.8905\"></path>\n" +
        "<polygon fill=\"black\" stroke=\"black\" points=\"255.11,-37.2615 264.001,-31.4998 253.458,-30.4593 255.11,-37.2615\"></polygon>\n" +
        "<text text-anchor=\"middle\" x=\"220\" y=\"-60.2\" font-family=\"Times,serif\" font-size=\"14.00\">b, A → ε</text>\n" +
        "</g>\n" +
        "<!-- p₂&#45;&gt;p₁ -->\n" +
        "<g id=\"edge4\" class=\"edge\"><title>p₂-&gt;p₁</title>\n" +
        "<path fill=\"none\" stroke=\"black\" d=\"M273.606,-105.712C266.684,-96.7685 257.195,-87.0604 246,-82.2 227.042,-73.9694 203.757,-74.7699 185.357,-77.5771\"></path>\n" +
        "<polygon fill=\"black\" stroke=\"black\" points=\"184.654,-74.1472 175.427,-79.3533 185.887,-81.0378 184.654,-74.1472\"></polygon>\n" +
        "<text text-anchor=\"middle\" x=\"220\" y=\"-87.2\" font-family=\"Times,serif\" font-size=\"14.00\">ε, B → A</text>\n" +
        "</g>\n" +
        "<!-- p₃&#45;&gt;p₄ -->\n" +
        "<g id=\"edge7\" class=\"edge\"><title>p₃-&gt;p₄</title>\n" +
        "<path fill=\"none\" stroke=\"black\" d=\"M310.392,-27C330.421,-27 360.148,-27 383.592,-27\"></path>\n" +
        "<polygon fill=\"black\" stroke=\"black\" points=\"383.864,-30.5001 393.864,-27 383.864,-23.5001 383.864,-30.5001\"></polygon>\n" +
        "<text text-anchor=\"middle\" x=\"352\" y=\"-31.2\" font-family=\"Times,serif\" font-size=\"14.00\">ε, $ → $</text>\n" +
        "</g>\n" +
        "<!-- p₃&#45;&gt;p₃ -->\n" +
        "<g id=\"edge6\" class=\"edge\"><title>p₃-&gt;p₃</title>\n" +
        "<path fill=\"none\" stroke=\"black\" d=\"M275.495,-47.2514C273.54,-58.1087 277.375,-68 287,-68 293.467,-68 297.32,-63.5349 298.559,-57.3117\"></path>\n" +
        "<polygon fill=\"black\" stroke=\"black\" points=\"302.059,-57.2323 298.505,-47.2514 295.059,-57.2702 302.059,-57.2323\"></polygon>\n" +
        "<text text-anchor=\"middle\" x=\"287\" y=\"-72.2\" font-family=\"Times,serif\" font-size=\"14.00\">b, A → ε</text>\n" +
        "</g>\n" +
        "</g>\n" +
        "</svg>";

    let expected = "<svg width=\"456pt\" height=\"156pt\" viewBox=\"0.00 0.00 456.00 156.00\" xmlns=\"http://www.w3.org/2000/svg\" >\n" +
        "<g id=\"graph0\" class=\"graph\" transform=\"scale(1 1) rotate(0) translate(4 152)\">\n" +
        "<title>&#36;%3&#36;</title>\n" +
        "<polygon fill=\"white\" stroke=\"none\" points=\"-4,4 -4,-152 452,-152 452,4 -4,4\"></polygon>\n" +
        "<!-- p₀ -->\n" +
        "<g id=\"node1\" class=\"node\"><title>&#36;p₀&#36;</title>\n" +
        "<ellipse fill=\"none\" stroke=\"green\" cx=\"23\" cy=\"-85\" rx=\"23.2159\" ry=\"23.2159\"></ellipse>\n" +
        "<text text-anchor=\"middle\" x=\"23\" y=\"-80.8\" font-family=\"Times,serif\" font-size=\"14.00\">&#36;p₀&#36;</text>\n" +
        "</g>\n" +
        "<!-- p₁ -->\n" +
        "<g id=\"node3\" class=\"node\"><title>&#36;p₁&#36;</title>\n" +
        "<ellipse fill=\"none\" stroke=\"black\" cx=\"153\" cy=\"-85\" rx=\"23.2159\" ry=\"23.2159\"></ellipse>\n" +
        "<text text-anchor=\"middle\" x=\"153\" y=\"-80.8\" font-family=\"Times,serif\" font-size=\"14.00\">&#36;p₁&#36;</text>\n" +
        "</g>\n" +
        "<!-- p₀&#45;&gt;p₁ -->\n" +
        "<g id=\"edge1\" class=\"edge\"><title>&#36;p₀-&gt;p₁&#36;</title>\n" +
        "<path fill=\"none\" stroke=\"black\" d=\"M46.2959,-85C66.4538,-85 96.3882,-85 119.261,-85\"></path>\n" +
        "<polygon fill=\"black\" stroke=\"black\" points=\"119.53,-88.5001 129.53,-85 119.53,-81.5001 119.53,-88.5001\"></polygon>\n" +
        "<text text-anchor=\"middle\" x=\"88\" y=\"-89.2\" font-family=\"Times,serif\" font-size=\"14.00\">&#36;a, \\varepsilon  \\rightarrow  B&#36;</text>\n" +
        "</g>\n" +
        "<!-- p₄ -->\n" +
        "<g id=\"node2\" class=\"node\"><title>&#36;p₄&#36;</title>\n" +
        "<ellipse fill=\"none\" stroke=\"black\" cx=\"421\" cy=\"-27\" rx=\"23.1999\" ry=\"23.1999\"></ellipse>\n" +
        "<ellipse fill=\"none\" stroke=\"black\" cx=\"421\" cy=\"-27\" rx=\"27.2158\" ry=\"27.2158\"></ellipse>\n" +
        "<text text-anchor=\"middle\" x=\"421\" y=\"-22.8\" font-family=\"Times,serif\" font-size=\"14.00\">&#36;p₄&#36;</text>\n" +
        "</g>\n" +
        "<!-- p₁&#45;&gt;p₁ -->\n" +
        "<g id=\"edge2\" class=\"edge\"><title>&#36;p₁-&gt;p₁&#36;</title>\n" +
        "<path fill=\"none\" stroke=\"black\" d=\"M141.495,-105.251C139.54,-116.109 143.375,-126 153,-126 159.467,-126 163.32,-121.535 164.559,-115.312\"></path>\n" +
        "<polygon fill=\"black\" stroke=\"black\" points=\"168.059,-115.232 164.505,-105.251 161.059,-115.27 168.059,-115.232\"></polygon>\n" +
        "<text text-anchor=\"middle\" x=\"153\" y=\"-130.2\" font-family=\"Times,serif\" font-size=\"14.00\">&#36;a, \\varepsilon  \\rightarrow  B&#36;</text>\n" +
        "</g>\n" +
        "<!-- p₂ -->\n" +
        "<g id=\"node4\" class=\"node\"><title>&#36;p₂&#36;</title>\n" +
        "<ellipse fill=\"none\" stroke=\"black\" cx=\"287\" cy=\"-125\" rx=\"23.2159\" ry=\"23.2159\"></ellipse>\n" +
        "<text text-anchor=\"middle\" x=\"287\" y=\"-120.8\" font-family=\"Times,serif\" font-size=\"14.00\">&#36;p₂&#36;</text>\n" +
        "</g>\n" +
        "<!-- p₁&#45;&gt;p₂ -->\n" +
        "<g id=\"edge3\" class=\"edge\"><title>&#36;p₁-&gt;p₂&#36;</title>\n" +
        "<path fill=\"none\" stroke=\"black\" d=\"M174.051,-94.9115C180.338,-97.7768 187.369,-100.738 194,-103 213.619,-109.694 236.258,-115.135 254.169,-118.932\"></path>\n" +
        "<polygon fill=\"black\" stroke=\"black\" points=\"253.61,-122.39 264.11,-120.974 255.019,-115.533 253.61,-122.39\"></polygon>\n" +
        "<text text-anchor=\"middle\" x=\"220\" y=\"-121.2\" font-family=\"Times,serif\" font-size=\"14.00\">&#36;\\varepsilon , B \\rightarrow  \\varepsilon &#36;</text>\n" +
        "</g>\n" +
        "<!-- p₃ -->\n" +
        "<g id=\"node5\" class=\"node\"><title>&#36;p₃&#36;</title>\n" +
        "<ellipse fill=\"none\" stroke=\"black\" cx=\"287\" cy=\"-27\" rx=\"23.2159\" ry=\"23.2159\"></ellipse>\n" +
        "<text text-anchor=\"middle\" x=\"287\" y=\"-22.8\" font-family=\"Times,serif\" font-size=\"14.00\">&#36;p₃&#36;</text>\n" +
        "</g>\n" +
        "<!-- p₁&#45;&gt;p₃ -->\n" +
        "<g id=\"edge5\" class=\"edge\"><title>&#36;p₁-&gt;p₃&#36;</title>\n" +
        "<path fill=\"none\" stroke=\"black\" d=\"M171.062,-70.2626C177.858,-64.9508 185.966,-59.2696 194,-55.2 213.024,-45.5635 235.952,-38.5254 254.16,-33.8905\"></path>\n" +
        "<polygon fill=\"black\" stroke=\"black\" points=\"255.11,-37.2615 264.001,-31.4998 253.458,-30.4593 255.11,-37.2615\"></polygon>\n" +
        "<text text-anchor=\"middle\" x=\"220\" y=\"-60.2\" font-family=\"Times,serif\" font-size=\"14.00\">&#36;b, A \\rightarrow  \\varepsilon &#36;</text>\n" +
        "</g>\n" +
        "<!-- p₂&#45;&gt;p₁ -->\n" +
        "<g id=\"edge4\" class=\"edge\"><title>&#36;p₂-&gt;p₁&#36;</title>\n" +
        "<path fill=\"none\" stroke=\"black\" d=\"M273.606,-105.712C266.684,-96.7685 257.195,-87.0604 246,-82.2 227.042,-73.9694 203.757,-74.7699 185.357,-77.5771\"></path>\n" +
        "<polygon fill=\"black\" stroke=\"black\" points=\"184.654,-74.1472 175.427,-79.3533 185.887,-81.0378 184.654,-74.1472\"></polygon>\n" +
        "<text text-anchor=\"middle\" x=\"220\" y=\"-87.2\" font-family=\"Times,serif\" font-size=\"14.00\">&#36;\\varepsilon , B \\rightarrow  A&#36;</text>\n" +
        "</g>\n" +
        "<!-- p₃&#45;&gt;p₄ -->\n" +
        "<g id=\"edge7\" class=\"edge\"><title>&#36;p₃-&gt;p₄&#36;</title>\n" +
        "<path fill=\"none\" stroke=\"black\" d=\"M310.392,-27C330.421,-27 360.148,-27 383.592,-27\"></path>\n" +
        "<polygon fill=\"black\" stroke=\"black\" points=\"383.864,-30.5001 393.864,-27 383.864,-23.5001 383.864,-30.5001\"></polygon>\n" +
        "<text text-anchor=\"middle\" x=\"352\" y=\"-31.2\" font-family=\"Times,serif\" font-size=\"14.00\">&#36;\\varepsilon , \\$  \\rightarrow  \\$ &#36;</text>\n" +
        "</g>\n" +
        "<!-- p₃&#45;&gt;p₃ -->\n" +
        "<g id=\"edge6\" class=\"edge\"><title>&#36;p₃-&gt;p₃&#36;</title>\n" +
        "<path fill=\"none\" stroke=\"black\" d=\"M275.495,-47.2514C273.54,-58.1087 277.375,-68 287,-68 293.467,-68 297.32,-63.5349 298.559,-57.3117\"></path>\n" +
        "<polygon fill=\"black\" stroke=\"black\" points=\"302.059,-57.2323 298.505,-47.2514 295.059,-57.2702 302.059,-57.2323\"></polygon>\n" +
        "<text text-anchor=\"middle\" x=\"287\" y=\"-72.2\" font-family=\"Times,serif\" font-size=\"14.00\">&#36;b, A \\rightarrow  \\varepsilon &#36;</text>\n" +
        "</g>\n" +
        "</g>\n" +
        "</svg>";

    expect(Renderer.mapToLatex(html)).toEqual(expected);
})