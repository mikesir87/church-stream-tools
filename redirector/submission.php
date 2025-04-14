<?php

date_default_timezone_set('America/New_York');

// If they didn't submit the form, redirect them back to the main page
if (!isset($_POST["name"])) {
	Header("Location: /");
	exit;
}

require("./config/stream-url.php");

if (!defined("STREAM_REDIRECT_URL")) {
    exit("No stream is currently available, due to a configuration issue. Contact the site administrator for assistance");
}

// Make a record of the submission
$date = date("Y-m-d H:i:s");
$person = $_POST["name"];
file_put_contents("./config/data.txt", "$date $person\n", FILE_APPEND | LOCK_EX);

// Redirect the user
Header("Location: " . STREAM_REDIRECT_URL);