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
youtubeLinkInput.addEventListener('paste', function (event) {
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
forwardSecondsInput.addEventListener('input', function () {
    forwardSecondsInput.setAttribute('value', forwardSecondsInput.value);
});

const backwardSecondsInput = document.getElementById('backwardSeconds');
backwardSecondsInput.addEventListener('input', function () {
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

const seekTimeInput = document.getElementById('seekTime');
const seekButton = document.getElementById('seekButton');

seekButton.addEventListener('click', function() {
    const timestamp = seekTimeInput.value;
    seekToTimestamp(timestamp);
    seekTimestamp = timestamp; // Store the timestamp value
});


const videoTime = document.getElementById('video-time');
const videoVolume = document.getElementById('video-volume'); // Add this line


setInterval(() => {
    const currentTime = player.getCurrentTime();
    const formattedTime = formatTime(currentTime);
    videoTime.innerHTML = formattedTime;

    const currentVolume = player.getVolume(); // Get current volume
    videoVolume.innerHTML = `Volume: ${currentVolume}%`; // Display current volume

}, 100);

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    seconds = seconds % 60;
    return `${hours}:${minutes}:${seconds.toFixed(0)}`;
}

const customVolumeInput = document.getElementById('customVolumeInput');

function increaseVolume() {
    const currentVolume = player.getVolume();
    const newVolume = Math.min(100, currentVolume + parseInt(customVolumeInput.value)); // Increase by 10

    player.setVolume(newVolume);
}

function decreaseVolume() {
    const currentVolume = player.getVolume();
    const newVolume = Math.max(0, currentVolume - customVolumeInput.value); // Decrease by 10
    player.setVolume(newVolume);
}



window.addEventListener('keydown', event => {
    if (event.keyCode === 32) { // space key
        if (player.getPlayerState() == 2) {
            player.playVideo();
        } else {
            player.pauseVideo();
        }
    }
});

// Handle the keyboard event for the arrow down and arrow up keys
// Handle the keyboard event for the left arrow key
document.addEventListener('keydown', function (event) {
    if (event.keyCode === 37) { // Left arrow key
        backwardCustomSeek();
    }
    else if (event.keyCode === 39) { // Right arrow key
        forwardCustomSeek();
    }
    else if (event.keyCode === 38) { // Up arrow key
        increaseVolume();
    } 
    else if (event.keyCode === 40) { // Down arrow key
        decreaseVolume();
    }
});
