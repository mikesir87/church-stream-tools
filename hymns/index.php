<?php

function findHymnById($hymnData, $id) {
	foreach ($hymnData as $hymn) {
		if ($hymn->number == $id)
			return $hymn;
	}
	return null;
}

if (is_numeric($_GET['hymn']))
  $hymnData = json_decode( file_get_contents("hymns.json") );
else
  $hymnData = json_decode( file_get_contents("extras.json") );

$number = $_GET["hymn"];
$hymn = findHymnById($hymnData, $number);
foreach ($hymn->verses as $verse) {
	$verse->splitText = explode("\n", $verse->text);
}

?><!DOCTYPE html>
<html>
<head>
    <style type="text/css">
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500&display=swap');
        body { background: rgb(106, 168, 79); color: white; font-family: "Open Sans", sans-serif; }
        .hide { display: none; }
        h1 { text-align: center; font-size: 40px; }
        #display { position: absolute; left: 50%; width: 49%; }
        .verse { padding-left: 30px ; text-indent: -30px; line-height: 1.5em;  }
        .verse p { margin: 0 0 8px; }
    </style>
</head>
<body>
    <div id="display">
	<h1 id="output">
           <?php if (is_numeric($hymn->number)): ?>#<?= $hymn->number ?> - <?php endif; ?><?= $hymn->title ?></h1>

        <?php foreach ($hymn->verses as $index => $verse): ?>
            <div id="verse-<?= $index + 1?>" class="verse">
                <p><span class="verse-number"><?= $index + 1 ?>.</span> <?= $verse->splitText[0] ?></p>
                <?php for ($i = 1; $i < count($verse->splitText); $i++) : ?>
                    <p><?= $verse->splitText[$i] ?></p>
                <?php endfor ?>
            </div>
        <?php endforeach ?>
        <script type="text/javascript" src="display.js"></script>
        </div>
</body>
</html>
