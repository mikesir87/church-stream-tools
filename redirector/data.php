<?php

require("./config/stream-data-pw.php");

if (!defined("DATA_PASSWORD")) {
    exit("Unable to provide the data due to a system misconfiguration. Contact the site administrator for assistance");
}

if (!isset($_GET["secret"]) || $_GET["secret"] != DATA_PASSWORD) {
	echo "Sorry";
	exit;
}

echo "<pre>";
echo file_get_contents("./config/data.txt");