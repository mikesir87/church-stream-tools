<!DOCTYPE html>
<html>
<head>
    <style type="text/css">
        body { margin: 0; padding: 0; }
        #slide { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; }
        #slide img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
        #shimmer { 
            position: absolute; 
            top: 0; left: 0; 
            width: 100%; height: 100%; 
            background: linear-gradient(-45deg, rgba(0,0,255,0) 30%, rgba(240, 240, 240, 0.3) 50%, rgba(0,0,255,0) 70%);
            background-size: 300%;
            background-position-x: 100%;
            animation: shimmer 10s infinite; 
            animation-timing-function: cubic-bezier(.59,.74,0,.99);
        }

        @keyframes shimmer {
            to {
                background-position-x: -50%
            }
            /* 90%, 100% {
                background-position-x: 100%
            } */
        }
    </style>
</head>
<body>
    <div id="slide">
        <img src="/assets/img/slide-background.png" />
    </div>
    <div id="shimmer"></div>
</body>
</html>