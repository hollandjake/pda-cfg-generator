<?php $title = 'Tool'; include $_SERVER["DOCUMENT_ROOT"] . "/components/header.php" ?>
    <script src="src/external/viz.min.js"></script>
    <script type="module" src="src/index.js"></script>
    <div class="container background">
        <div class="d-flex justify-content-center align-items-center h-100" id="spinner">
            <div class="spinner-border text-white" style="width: 3rem; height: 3rem;" role="status"
                 aria-label="loading"></div>
        </div>
    </div>
    <div class="carousel">
        <div class="carousel-button-container">
            <div class="buttons">
                <button class="carousel-button btn" id="new_question_button_harder"
                        title="New question of harder difficulty">
                    <i class="bi-plus-circle"></i>
                </button>
                <button class="carousel-button btn" id="new_question_button_same"
                        title="New question of equal difficulty">
                    <i class="bi-arrow-repeat"></i>
                </button>
                <button class="carousel-button btn" id="new_question_button_easier"
                        title="New question of easier difficulty">
                    <i class="bi-dash-circle"></i>
                </button>
            </div>
            <span id="current_difficulty">1</span>
        </div>
        <div class="content">
            <div id="question">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Write down the production rules for the following push-down
                            automaton.</h5>
                        <div id="pda" class="card-text mt-5 mb-5"></div>
                        <form id="cfg-input-form">
                            <div class="form-group">
                    <textarea class="form-control" id="cfg-input"
                              aria-label="input your context-free grammar here" rows="5"
                              placeholder="e.g. S -> aBc"></textarea>
                                <ul id="cfg-input-help" class="form-text text-muted">
                                    <li><small>Variables are represented with UPPERCASE characters</small></li>
                                    <li><small>Terminals are represented with lowercase characters</small></li>
                                    <li><small>To input an '&epsilon;' use 'e'</small></li>
                                    <li><small>Production rules must follow the format 'Variable -&gt; Sequence of
                                            terminals
                                            and Variables'</small></li>
                                    <li><small>e.g. 'S -&gt; aBc' (spaces are optional)</small></li>
                                </ul>
                            </div>
                            <button class="btn btn-primary" type="submit" id="submit">Submit</button>
                        </form>
                    </div>
                </div>
                <div class="card mt-5" id="answer-box">
                    <div class="card-body">
                        <h5 class="card-title">Correct Answer</h5>
                        <div class="card">
                            <div class="card-body">
                                <ul id="correct_answer">
                                    <li>S-&gt;AS</li>
                                    <li>A-&gt;a</li>
                                </ul>
                            </div>
                        </div>
                        <h5 class="card-title mt-2">Feedback</h5>
                        <div class="card">
                            <div class="card-body">
                                <ul id="feedback">
                                    <li>Some shit about how you did</li>
                                    <li>Like who tf is gon read this</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
<?php include $_SERVER["DOCUMENT_ROOT"] . "/components/footer.php" ?>