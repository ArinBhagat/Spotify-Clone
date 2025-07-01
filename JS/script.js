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
  songs.forEach((item) => {
    item.addEventListener("click", () => {
      const song = item.dataset.song;
      let audioPlayBtn = item
        .getElementsByClassName("song-play")[0]
        .getElementsByTagName("img")[0];
      audio.src = song;
      if (audioPlayBtn.src.includes("pause.svg")) {
        audioPlayBtn.src = "Images/play.svg";
        audio.pause()
      } else {
        audioPlayBtn.src = "Images/pause.svg";
        audio.play()
      }
    });
  });
};
