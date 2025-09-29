//Fetching Albums from the songs folder and rendering it in the UI using an async function.
const displayAlbums = async () => {
  let playlistContainer =
    document.getElementsByClassName("playlist-container")[0];
  let fetching = await fetch("/songs/");
  let response = await fetching.text();
  let storeData = document.createElement("div");
  storeData.innerHTML = response;
  let a = storeData.getElementsByTagName("a");
  for (let i = 3; i < a.length; i++) {
    let albumName = a[i].href.replace("http://127.0.0.1:5500/songs/", "");
    let info = await fetch(`Songs/${albumName}/details/info.json`);
    let infoResponse = await info.json();
    playlistContainer.innerHTML =
      playlistContainer.innerHTML +
      `<div class="playlist flex flex-col align-center justify-center" data-folder=${infoResponse.title}>
    <img src="/Songs/${albumName}/details/cover_page.jpeg" alt="Playlist" height="170" width="170" onerror='this.onerror=null; this.src="/Songs/${albumName}/details/cover_page.jpg"'>
    <h3>${infoResponse.title}</h3>
    <p>${infoResponse.desc}</p>
    <div class="btn-play">
        <img src="Images/green-play-btn.svg" alt="Play" height="50">
    </div>
</div>`;
  }

  displaySongs(a[3].href.replace("http://127.0.0.1:5500/songs/", ""));

  handleAlbumClick();
};

displayAlbums();

//Added handleAlbumClick function which supplies the folder name to the displaySongs function
const handleAlbumClick = () => {
  let playlists = document.querySelectorAll(".playlist");
  playlists.forEach((playlist) => {
    playlist.addEventListener("click", async () => {
      const folder = playlist.dataset.folder;
      await displaySongs(folder);
    });
  });
};

//Added the displaySongs function which takes the folderName dynamically from the handleAlbumClick function and displays the songs name.
const displaySongs = async (folderName) => {
  let songContainer = document.getElementsByClassName("song-container")[0];
  let response = await fetch(`/Songs/${folderName}`);
  let html = await response.text();
  let storeData = document.createElement("div");
  storeData.innerHTML = html;
  let a = storeData.getElementsByTagName("a");
  songContainer.innerHTML = "";
  for (let i = 5; i < a.length; i++) {
    let songName = a[i].href
      .replace(`http://127.0.0.1:5500/Songs/${folderName}/`, "")
      .replaceAll("_", " ")
      .replaceAll("%", " ")
      .split("-")[0];
    let songArtist = a[i].href
      .replace(`http://127.0.0.1:5500/Songs/${folderName}/`, "")
      .replaceAll("_", " ")
      .replaceAll("%", " ")
      .split("-")[1]
      .replace(".mp3", "");
    songContainer.innerHTML =
      songContainer.innerHTML +
      `                    <div class="song flex" data-song="${a[i]}">
                        <img src="Images/music.svg" alt="Music" height="24" class="music">
                        <div class="song-details">
                            <p>${songName}</p>
                            <p>${songArtist}</p>
                        </div>
                        <div class="song-play flex align-center justify-center">
                            <p>Play Now</p>
                            <img src="Images/play.svg" alt="Play" height="24" class="pointer"> 
                        </div>
                    </div>`;
    playSong();
  }
};

displaySongs();

//Added the playSong function which plays or pauses a song and changes the imgs accordingly.
const playSong = () => {
  let songs = document.querySelectorAll(".song");
  let audio = new Audio();
  let playbarSongDetails = document
    .getElementsByClassName("playbar-song-details")[0]
    .getElementsByTagName("p");
  const curr = document.getElementById("curr");
  songs.forEach((item) => {
    item.addEventListener("click", () => {
      let songDetails = item
        .getElementsByClassName("song-details")[0]
        .getElementsByTagName("p");
      const song = item.dataset.song;
      let audioPlayBtn = item
        .getElementsByClassName("song-play")[0]
        .getElementsByTagName("img")[0];
      document.querySelectorAll(".song-play img").forEach((btn) => {
        btn.src = "Images/play.svg";
      });
      if (audio.src !== song) {
        audio.src = song;
        audioPlayBtn.src = "Images/pause.svg";
        audio.play();
        curr.src = "Images/pause.svg";
      } else {
        if (!audio.paused) {
          audio.pause();
          audioPlayBtn.src = "Images/play.svg";
          curr.src = "Images/playbar-play.svg";
        } else {
          audio.play();
          audioPlayBtn.src = "Images/pause.svg";
          curr.src = "Images/pause.svg";
        }
      }
      playbarSongDetails[0].innerHTML = songDetails[0].innerHTML;
      playbarSongDetails[1].innerHTML = songDetails[1].innerHTML;
      volumeSet(audio);
      setTime(audio);
      songControls(songs, song, audio, audioPlayBtn);
    });
  });
};

// This function sets the volume of the audio
const volumeSet = (song) => {
  const sound = document.getElementById("sound");
  const soundBtn = document
    .getElementsByClassName("volume")[0]
    .getElementsByTagName("img")[0];
  val = sound.value / 100;
  sound.onclick = () => {
    val = sound.value / 100;
    song.volume = val;
    if (val == 0) {
      soundBtn.src = "Images/mute.svg";
    } else {
      soundBtn.src = "Images/sound.svg";
    }
  };
  soundBtn.onclick = () => {
    if (
      soundBtn.src.replace("http://127.0.0.1:5500/", "") === "Images/mute.svg"
    ) {
      if (val == 0) {
        val = 0.5;
        sound.value = 50;
      }
      song.volume = val;
      soundBtn.src = "Images/sound.svg";
    } else {
      song.volume = 0;
      soundBtn.src = "Images/mute.svg";
    }
  };
};

const setTime = (audio) => {
  const seekbar = document.getElementsByClassName("seekbar")[0];
  const circle = document.getElementsByClassName("circle")[1];
  let endTime = document.getElementsByClassName("end-time")[0];
  let startTime = document.getElementsByClassName("start-time")[0];
  let songTime = 0;
  let currentSongTime = 0;
  audio.addEventListener("loadedmetadata", () => {
    songTime = audio.duration;
    endTime.innerHTML = conversion(songTime);
  });
  setInterval(() => {
    currentSongTime = audio.currentTime;
    startTime.innerHTML = conversion(currentSongTime);
    circle.style.left = `${(currentSongTime / songTime) * 900 + 30}px`;
  }, 1000);
  seekbar.onclick = (e) => {
    const rect = seekbar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    circle.style.left = offsetX;
    audio.currentTime = (offsetX / width) * songTime;
  };
};

// Converts seconds into minutes and seconds
const conversion = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
};

const songControls = (songs, song, audio, audioPlayBtn) => {
  const prev = document.getElementById("prev");
  const curr = document.getElementById("curr");
  const next = document.getElementById("next");
  let currAudioIndex = 0;
  prev.onclick = () => {
    if (songs[0].dataset.song == song) {
      audio.currentTime = 0;
    }
  };
  next.onclick = () => {
    if (songs[songs.length - 1].dataset.song == song) {
      audio.currentTime = 0;
    }
  };
  curr.onclick = () => {
    if (!audio.paused) {
      audio.pause();
      curr.src = "Images/playbar-play.svg";
      audioPlayBtn.src = "Images/play.svg";
    } else {
      audio.play();
      curr.src = "Images/pause.svg";
      audioPlayBtn.src = "Images/pause.svg";
    }
  };
};
