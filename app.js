let player;
autoScroll = false;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "360",
    width: "640",
    playerVars: {
      autoplay: 0,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerReady(event) {
  console.log("Player is ready.");
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    console.log("Video has ended.");
  }
}

function loadVideoByUrl(url) {
  const videoId = getVideoIdFromUrl(url);
  player.loadVideoById(videoId);
  return videoId;
}

function getVideoIdFromUrl(url) {
  const regex = /[?&]v=([^&#]*)/;
  const match = regex.exec(url);
  return match && match[1] ? match[1] : "";
}

function loadVideo() {
  const youtubeLinkInput = document.getElementById("youtubeLink");
  const url = youtubeLinkInput.value;
  videoId = loadVideoByUrl(url);
  return videoId;
}

scriptData = [];
function binarySearch(time) {
  target = time * 1000
  let left = 0;
  let right = scriptData.length - 1;

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);

    if (
      target >= scriptData[middle]["time"] &&
      target <= scriptData[middle + 1]["time"]
    ) {
      return middle; // Target found, return its index
    } else if (scriptData[middle]["time"] < target) {
      left = middle + 1; // Search in the right half
    } else {
      right = middle - 1; // Search in the left half
    }
  }
  return -1;  // Target not found
}

const loadTranScripts = (videoId) => {
  playing = false;
  fetch("https://heroic-narwhal-27f1e5.netlify.app/.netlify/functions/api?videoId=" + videoId)
  // fetch("http://localhost:3000?videoId=" + videoId)

    .then((response) => response.json())
    .then((data) => {
      scripts = data;
      console.log(data);
      scriptData = [];
      const container = document.getElementById("transcriptContainer"); // Replace with your container element ID
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }

      scripts.forEach((item) => {
        timeMs = item.start * 1000;
        scriptData.push({
          time: timeMs,
          id: item.text,
        });
        const transcriptItem = document.createElement("div");
        transcriptItem.classList.add("transcript-item");
        transcriptItem.id = item.text;

        const textElement = document.createElement("div");
        textElement.textContent = item.text;
        textElement.classList.add("transcript-item-text");
        transcriptItem.appendChild(textElement);

        const timeEle = document.createElement("div");
        timeEle.textContent = formatTimeMs(timeMs);
        timeEle.classList.add("transcript-time");
        transcriptItem.appendChild(timeEle);

        transcriptItem.addEventListener("click", (event) => {
          console.log(timeEle.textContent);
          seekToTimestamp(timeEle.textContent, 1);
        });
        container.appendChild(transcriptItem);
      });

      playing = true;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const loadButton = document.getElementById("loadButton");
loadButton.addEventListener("click", (event) => {
  videoId = loadVideo();
  loadTranScripts(videoId);
});

// const youtubeLinkInput = document.getElementById('youtubeLink');
// youtubeLinkInput.addEventListener('paste', function (event) {
//     const pastedUrl = event.clipboardData.getData('text/plain');
//     youtubeLinkInput.value = pastedUrl; // Optional: Update the input field with the pasted URL
//     loadVideoByUrl(pastedUrl);
// });

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
  const forwardSecondsInput = document.getElementById("forwardSeconds");
  const seconds = parseFloat(forwardSecondsInput.value);
  if (!isNaN(seconds)) {
    seekForward(seconds);
  }
}

// Function to handle backward custom seek
function backwardCustomSeek() {
  const backwardSecondsInput = document.getElementById("backwardSeconds");
  const seconds = parseFloat(backwardSecondsInput.value);
  if (!isNaN(seconds)) {
    seekBackward(seconds);
  }
}

// Handle the button click event for forward custom seek
const forwardButton = document.getElementById("forwardButton");
forwardButton.addEventListener("click", forwardCustomSeek);

// Handle the button click event for backward custom seek
const backwardButton = document.getElementById("backwardButton");
backwardButton.addEventListener("click", backwardCustomSeek);

// ... (existing code for the "Chuyển tới" (Seek) button)

// Optional: Keep the value in the forward and backward input fields
const forwardSecondsInput = document.getElementById("forwardSeconds");
forwardSecondsInput.addEventListener("input", function () {
  forwardSecondsInput.setAttribute("value", forwardSecondsInput.value);
});

const backwardSecondsInput = document.getElementById("backwardSeconds");
backwardSecondsInput.addEventListener("input", function () {
  backwardSecondsInput.setAttribute("value", backwardSecondsInput.value);
});

let seekTimestamp = ""; // Variable to store the "Chuyển tới" timestamp

function parseTimestampToSeconds(timestamp) {
  const parts = timestamp.split(":");
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
  seeking = true;
  const seconds = parseTimestampToSeconds(timestamp);
  if (!isNaN(seconds)) {
    player.seekTo(seconds, true);
  }
}

const seekTimeInput = document.getElementById("seekTime");
const seekButton = document.getElementById("seekButton");

seekButton.addEventListener("click", function () {
  const timestamp = seekTimeInput.value;
  seekToTimestamp(timestamp);
  seekTimestamp = timestamp; // Store the timestamp value
});

const videoTime = document.getElementById("video-time");
const videoVolume = document.getElementById("video-volume"); // Add this line

playing = true;
seeking = false;
clearPoint = 0;
curItemGlobal = null;

setInterval(() => {
  const currentTime = player.getCurrentTime();
  const formattedTime = formatTime(currentTime);
  videoTime.innerHTML = formattedTime;
  autoScroll = false;

  const currentVolume = player.getVolume(); // Get current volume
  videoVolume.innerHTML = `Volume: ${currentVolume}%`; // Display current volume

  if (playing) {
    curIndex = binarySearch(currentTime);
    if (seeking) {
      curIndex = curIndex + 1;
      seeking = false;
    }
    // console.log(scriptData[curIndex]);
    if (clearPoint == 10) {
      removeItems = document.querySelectorAll(".playing");
      if (removeItems.length > 1) {
        removeItems.forEach((data) => {
          clearItem = document.getElementById(data.id);
          clearItem.classList.remove("playing");    
        })
      } 
      clearPoint = 0;  
    }
    transcriptItem = document.getElementById(scriptData[curIndex].id);
    curItemGlobal = transcriptItem;

    transcriptItem.classList.add("playing");

    if (autoScroll) {
      transcriptItem.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }

    prevTranscriptItem = document.getElementById(scriptData[curIndex - 1].id);
    prevTranscriptItem.classList.remove("playing");

    caption = document.getElementById("cap");
    caption.innerHTML = scriptData[curIndex].id;
    clearPoint++;
  }
}, 300);

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  seconds = seconds % 60;
  return `${hours}:${minutes}:${seconds.toFixed(0)}`;
}

function formatTimeMs(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  return formattedTime;
}

const customVolumeInput = document.getElementById("customVolumeInput");

function increaseVolume() {
  const currentVolume = player.getVolume();
  const newVolume = Math.min(
    100,
    currentVolume + parseInt(customVolumeInput.value)
  ); // Increase by 10

  player.setVolume(newVolume);
}

function decreaseVolume() {
  const currentVolume = player.getVolume();
  const newVolume = Math.max(0, currentVolume - customVolumeInput.value); // Decrease by 10
  player.setVolume(newVolume);
}

window.addEventListener("keydown", (event) => {
  if (event.keyCode === 32) {
    // space key
    if (player.getPlayerState() == 2) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }
});

// Handle the keyboard event for the arrow down and arrow up keys
// Handle the keyboard event for the left arrow key
document.addEventListener("keydown", function (event) {
  if (event.keyCode === 37) {
    // Left arrow key
    backwardCustomSeek();
  } else if (event.keyCode === 39) {
    // Right arrow key
    forwardCustomSeek();
  } else if (event.keyCode === 38) {
    // Up arrow key
    increaseVolume();
  } else if (event.keyCode === 40) {
    // Down arrow key
    decreaseVolume();
  } else if (event.keyCode === 27) {
    // Escape arrow key
    reduce();
  } else if (event.keyCode === 65) {
    // A key
    stwichAutoScroll();
  } else if (event.keyCode === 78) {
    // N key
    scrollNow(event);
  } 
});


document.addEventListener("keydown", (e) => {
  if (event.keyCode === 32) {
    e.preventDefault()
  }
});


function reduce() {
  const videoContainer = document.getElementById("section-one");
  if (videoContainer.style.display != "initial") {
    videoContainer.style.display = "initial";
  }
  else {
    videoContainer.style.display = "none";
  }
  
}

function stwichAutoScroll() {
  if (autoScroll) {
    autoScroll = false;
  }
  else{
    autoScroll = true;
  }
}

function scrollNow(e) {
  curItemGlobal.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
}

var playbackRateSelector = document.getElementById("playbackRates");
playbackRateSelector.addEventListener("change", function() {
  options = playbackRateSelector.querySelectorAll("option");
  v = 1;
  for (option of options.values()) {
    if (option.value === playbackRateSelector.value) {
      v = option.value;
    }
  }
  console.log(typeof v)
  player.setPlaybackRate(Number(v))
});
