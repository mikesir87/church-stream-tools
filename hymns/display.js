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
        currentVerseNode.classList.remove("hide");
        currentVerseNode.parentElement.appendChild(clonedNode);

        let height = clonedNode.getBoundingClientRect().y + clonedNode.getBoundingClientRect().height;
        let fontSize = 40;
        while (height < 1080 && fontSize < 60) {
            clonedNode.style.fontSize = fontSize++ + "px";
            height = clonedNode.getBoundingClientRect().y + clonedNode.getBoundingClientRect().height;
        }

        currentVerseNode.parentElement.removeChild(clonedNode);

        currentVerseNode.style.fontSize = fontSize + "px";
    }

    document.addEventListener("keyup", (e) => {
        if (e.keyCode === 39)
            goToNext();
        if (e.keyCode === 37)
            goToPrev();
    });

    updateVerseDisplay();
})();
