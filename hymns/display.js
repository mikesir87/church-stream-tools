(function() {
    let currentVerse = 1;
    const verseCount = document.querySelectorAll(".verse").length;

    window.addEventListener('obs-websocket-hymn-event', function(event) {
        const { direction } = event.detail;
        if (direction >= 0) goToNext();
        else goToPrev();
    });

    function goToNext() {
        currentVerse = Math.min(verseCount, currentVerse + 1);
        updateVerseDisplay();
    }

    function goToPrev() {
        currentVerse = Math.max(1, currentVerse - 1);
        updateVerseDisplay();
    }

    function updateVerseDisplay() {
        document.querySelectorAll(".verse").forEach(e => e.classList.add("hide"));

        const currentVerseNode = document.getElementById("verse-" + currentVerse);

        const clonedNode = currentVerseNode.cloneNode(true);
        clonedNode.id = "text-display";
        clonedNode.classList.remove("hide");
        currentVerseNode.parentElement.appendChild(clonedNode);
        
        const maxHeight = window.innerHeight;
        
        let fontSize = 20;
        clonedNode.style.fontSize = fontSize + "px";

        while (document.documentElement.scrollHeight <= maxHeight && fontSize < 60) {
            clonedNode.style.fontSize = ++fontSize + "px";
        }

        if (fontSize > 20) fontSize--;
        
        currentVerseNode.classList.remove("hide");
        currentVerseNode.parentElement.removeChild(clonedNode);

        currentVerseNode.style.fontSize = fontSize + "px";
    }

    document.addEventListener("keyup", (e) => {
        if (e.key === "ArrowRight")
            goToNext();
        if (e.key === "ArrowLeft")
            goToPrev();
    });

    updateVerseDisplay();
})();
