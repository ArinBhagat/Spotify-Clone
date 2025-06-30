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
    playlistContainer.innerHTML =
      playlistContainer.innerHTML +
      `<div class="playlist flex flex-col align-center justify-center" data-folder=${albumName}>
    <img src="Images/INOHA.png" alt="Playlist" height="170" width="170">
    <h3>${albumName}</h3>
    <p>Lorem ipsum dolor sit.</p>
    <div class="btn-play">
        <img src="Images/green-play-btn.svg" alt="Play" height="50">
    </div>
</div>`;
  }

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
  console.log(a)
  for (let i = 5; i< a.length; i++) {
    let songName = a[i].href.replace(`http://127.0.0.1:5500/Songs/${folderName}/`, "").replaceAll("_"," ").split("-")[0];
    let songArtist = a[i].href.replace(`http://127.0.0.1:5500/Songs/${folderName}/`, "").replaceAll("_"," ").split("-")[1].replace(".mp3","")
    songContainer.innerHTML =
      songContainer.innerHTML +
      `                    <div class="song flex">
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
  }
};

displaySongs();
