let player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        playerVars: {
            'autoplay': 0,
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    console.log('Player is ready.');
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        console.log('Video has ended.');
    }
}

function loadVideoByUrl(url) {
    const videoId = getVideoIdFromUrl(url);
    player.loadVideoById(videoId);
}

function getVideoIdFromUrl(url) {
    const regex = /[?&]v=([^&#]*)/;
    const match = regex.exec(url);
    return match && match[1] ? match[1] : '';
}

function seekForward(seconds) {
    const currentTime = player.getCurrentTime();
    player.seekTo(currentTime + seconds, true);
}

function seekBackward(seconds) {
    const currentTime = player.getCurrentTime();
    player.seekTo(currentTime - seconds, true);
}

function loadVideo() {
    const youtubeLinkInput = document.getElementById('youtubeLink');
    const url = youtubeLinkInput.value;
    loadVideoByUrl(url);
}

const loadButton = document.getElementById('loadButton');
loadButton.addEventListener('click', loadVideo);

const youtubeLinkInput = document.getElementById('youtubeLink');
youtubeLinkInput.addEventListener('paste', function(event) {
    const pastedUrl = event.clipboardData.getData('text/plain');
    youtubeLinkInput.value = pastedUrl; // Optional: Update the input field with the pasted URL
    loadVideoByUrl(pastedUrl);
});


function seekToCustom(seconds) {
    player.seekTo(seconds, true);
}


function seekForward(seconds) {
    const currentTime = player.getCurrentTime();
    player.seekTo(currentTime + seconds, true);
}

function seekBackward(seconds) {
    const currentTime = player.getCurrentTime();
    player.seekTo(currentTime - seconds, true);
}

// Handle the button click event for forward custom seek

function forwardCustomSeek() {
    const forwardSecondsInput = document.getElementById('forwardSeconds');
    const seconds = parseFloat(forwardSecondsInput.value);
    if (!isNaN(seconds)) {
        seekForward(seconds);
    }
}

// Function to handle backward custom seek
function backwardCustomSeek() {
    const backwardSecondsInput = document.getElementById('backwardSeconds');
    const seconds = parseFloat(backwardSecondsInput.value);
    if (!isNaN(seconds)) {
        seekBackward(seconds);
    }
}

// Handle the button click event for forward custom seek
const forwardButton = document.getElementById('forwardButton');
forwardButton.addEventListener('click', forwardCustomSeek);

// Handle the button click event for backward custom seek
const backwardButton = document.getElementById('backwardButton');
backwardButton.addEventListener('click', backwardCustomSeek);

// ... (existing code for the "Chuyển tới" (Seek) button)

// Optional: Keep the value in the forward and backward input fields
const forwardSecondsInput = document.getElementById('forwardSeconds');
forwardSecondsInput.addEventListener('input', function() {
    forwardSecondsInput.setAttribute('value', forwardSecondsInput.value);
});

const backwardSecondsInput = document.getElementById('backwardSeconds');
backwardSecondsInput.addEventListener('input', function() {
    backwardSecondsInput.setAttribute('value', backwardSecondsInput.value);
});

let seekTimestamp = ''; // Variable to store the "Chuyển tới" timestamp

function parseTimestampToSeconds(timestamp) {
    const parts = timestamp.split(':');
    if (parts.length !== 3) {
        return NaN;
    }
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const seconds = parseInt(parts[2]);

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
        return NaN;
    }

    return hours * 3600 + minutes * 60 + seconds;
}

function seekToTimestamp(timestamp) {
    const seconds = parseTimestampToSeconds(timestamp);
    if (!isNaN(seconds)) {
        player.seekTo(seconds, true);
    }
}

const seekButton = document.getElementById('seekButton');
seekButton.addEventListener('click', function() {
    const seekTimeInput = document.getElementById('seekTime');
    const timestamp = seekTimeInput.value;
    seekToTimestamp(timestamp);
    seekTimestamp = timestamp; // Store the timestamp value
    seekTimeInput.value = ''; // Clear the input field after seeking
});

// Keep the value in the "Chuyển tới" input field after it loses focus
const seekTimeInput = document.getElementById('seekTime');
seekTimeInput.addEventListener('input', function() {
    seekTimestamp = seekTimeInput.value;
});


// Handle the keyboard event for the left arrow key
document.addEventListener('keydown', function(event) {
    if (event.keyCode === 37) { // Left arrow key
        backwardCustomSeek();
    }
});

// Handle the keyboard event for the right arrow key
document.addEventListener('keydown', function(event) {
    if (event.keyCode === 39) { // Right arrow key
        forwardCustomSeek();
    }
});
