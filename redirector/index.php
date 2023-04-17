<?php

?><!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blacksburg Ward Stream Link</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous" />
  <style type="text/css">
  body { background-color: #27396b; font-family: "Open Sans", sans-serif; }
  #content { padding: 2em; background: white; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6 mt-5">
        <div id="content">
	  <h1>Blacksburg Ward Stream</h1>
	  <p>Before sending you to the stream, we'd like to know... who are you?</p>

          <form method="post" action="/submission">
            <div class="mb-3">
              <label for="name" class="form-label">Your last name</label>
              <input type="text" class="form-control" id="name" name="name" required />
	    </div>
            <button type="submit" class="btn btn-primary mb-3">Submit</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</body>
</html>