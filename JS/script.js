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
    playlistContainer.innerHTML =
      playlistContainer.innerHTML +
      `<div class="playlist flex flex-col align-center justify-center">
    <img src="Images/INOHA.png" alt="Playlist" height="170" width="170">
    <h3>${a[i].href.replace("http://127.0.0.1:5500/songs/", "")}</h1>
    <p>Lorem ipsum dolor sit.</p>
    <div class="btn-play">
        <img src="Images/green-play-btn.svg" alt="Play" height="50">
    </div>
</div>`;
  }
};

displayAlbums();