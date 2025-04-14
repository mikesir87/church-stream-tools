<?php

require("./config/stream-data-pw.php");
require("./config/stream-url.php");

if (!defined("DATA_PASSWORD")) {
    exit("Unable to provide the data due to a system misconfiguration (missing password). Contact the site administrator for assistance");
}

if (!defined("STREAM_REDIRECT_URL")) {
    exit("Unable to provide the data due to a system misconfiguration (stream url). Contact the site administrator for assistance");
}

if (!isset($_GET["secret"]) || $_GET["secret"] != DATA_PASSWORD) {
	echo "Sorry";
	exit;
}

if (isset($_POST['stream-link'])) {
    $new_stream_link = $_POST['stream-link'];
    if (filter_var($new_stream_link, FILTER_VALIDATE_URL)) {
        file_put_contents("./config/stream-url.php", "<?php define('STREAM_REDIRECT_URL', '$new_stream_link');");
        file_put_contents("./config/data.txt", "Submission list\n");
        header("Location: /admin?secret=" . $_GET['secret']);
        exit;
    } else {
        echo "Invalid URL format.";
    }
}

$attendance = file_get_contents("./config/data.txt");

?><!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blacksburg Ward Stream Admin</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous" />
  <style type="text/css">
  body { background-color: #276b5c; font-family: "Open Sans", sans-serif; }
  .content-card { padding: 2em; background: white; border-radius: 5px; margin-bottom: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 mt-5">
      <div class="content-card">
          <h1>Blacksburg Ward Stream - Admin</h1>

          <form method="post" action="/admin?secret=<?= $_GET['secret']; ?>">

            <div class="alert alert-info">
                Current stream link: <a href="<?= STREAM_REDIRECT_URL; ?>" target="_blank"><?= STREAM_REDIRECT_URL; ?></a>.
            </div>

            <div class="mb-3">
              <label for="stream-link" class="form-label">New stream link</label>
              <input type="text" class="form-control" id="stream-link" name="stream-link" placeholder="https://youtube.com/live/..." required />
            </div>
            <p class="text-muted">Note that setting a new stream link will automatically clear the attendance list.</p>
            <button type="submit" class="btn btn-primary mb-3">Update stream link</button>
          </form>
        </div>

        <div class="content-card">
          <h1>Attendance</h1>

          <pre>
            <?php echo $attendance; ?>
          </pre>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
