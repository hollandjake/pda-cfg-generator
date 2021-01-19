<!DOCTYPE html>
<html lang="en" class="h-100">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="Jake Holland">
    <title>PDA to CFG Question Generator - About</title>

    <!-- Bootstrap core CSS -->
    <link href="/css/bootstrap.min.css" rel="stylesheet">

    <!-- Favicons -->
    <!--    <link rel="apple-touch-icon" href="https://getbootstrap.com/docs/5.0/assets/img/favicons/apple-touch-icon.png"-->
    <!--          sizes="180x180">-->
    <!--    <link rel="icon" href="https://getbootstrap.com/docs/5.0/assets/img/favicons/favicon-32x32.png" sizes="32x32"-->
    <!--          type="image/png">-->
    <!--    <link rel="icon" href="https://getbootstrap.com/docs/5.0/assets/img/favicons/favicon-16x16.png" sizes="16x16"-->
    <!--          type="image/png">-->
    <!--    <link rel="manifest" href="https://getbootstrap.com/docs/5.0/assets/img/favicons/manifest.json">-->
    <!--    <link rel="mask-icon" href="https://getbootstrap.com/docs/5.0/assets/img/favicons/safari-pinned-tab.svg"-->
    <!--          color="#7952b3">-->
    <!--    <link rel="icon" href="https://getbootstrap.com/docs/5.0/assets/img/favicons/favicon.ico">-->
    <meta name="theme-color" content="#7952b3">


    <!-- Custom styles for this template -->
    <link href="/css/cover.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css">
</head>

<body class="d-flex h-100 bg-dark">

<div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
    <header class="mb-5 text-white text-center">
        <div>
            <h3 class="float-md-start mb-0">Cover</h3>
            <nav class="nav nav-masthead justify-content-center float-md-end">
                <a class="nav-link <?php if (strtok($_SERVER['REQUEST_URI'], '?') === '/') {
					echo 'active';
				} ?>" href="/">Tool</a>
                <a class="nav-link <?php if (strtok($_SERVER['REQUEST_URI'], '?') === '/about/') {
					echo 'active';
				} ?>" href="/about">About</a>
            </nav>
        </div>
    </header>

    <main class="px-3">