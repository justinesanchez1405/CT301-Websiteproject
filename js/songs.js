/*
  songs.js: only loaded on songs.html
  -----------------------------------
  1. Show the team's Spotify playlist, or a "coming soon" note if there isn't one
  2. Build a card for each song in siteConfig.learningSongs

  Both read from config.js, so a team changes songs there and never edits this file.
*/

// ---------------------------------------------------------------------------
// 1. Playlist
// ---------------------------------------------------------------------------

// People copy a playlist link like  https://open.spotify.com/playlist/37i9dQ...?si=abc
// but Spotify's player needs       https://open.spotify.com/embed/playlist/37i9dQ...
// This function turns the first into the second. It returns null if the link isn't
// a Spotify playlist, so a typo in config.js shows "coming soon" instead of a broken box.
function toSpotifyEmbedUrl(link) {
  try {
    const url = new URL(link); // throws an error if `link` isn't a real web address
    const isPlaylist = url.hostname === "open.spotify.com" && url.pathname.startsWith("/playlist/");
    if (!isPlaylist) return null;
    // Rebuild the address without the "?si=..." tracking part.
    return `https://open.spotify.com/embed${url.pathname}`;
  } catch {
    return null; // empty string or not a URL at all
  }
}

function renderPlaylist() {
  const container = document.getElementById("playlist");
  if (!container) return;

  const embedUrl = toSpotifyEmbedUrl(siteConfig.spotifyPlaylistUrl);

  if (!embedUrl) {
    // Empty state: invite, don't apologize (brand voice).
    const note = document.createElement("p");
    note.className = "page-note";
    note.textContent = "Playlist coming soon. In the meantime, see the songs we’re learning below.";
    container.append(note);
    return;
  }

  const player = document.createElement("iframe");
  player.className = "playlist-frame";
  player.src = embedUrl;
  // Screen readers announce an iframe by its title, so it must say what's inside.
  player.title = `${siteConfig.churchName} worship playlist on Spotify`;
  // lazy: don't load the player until it's about to scroll into view (faster page).
  player.loading = "lazy";
  // Permissions Spotify's player needs to play audio and go fullscreen.
  player.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
  container.append(player);
}

// ---------------------------------------------------------------------------
// 2. Songs we're learning
// ---------------------------------------------------------------------------
// The core pattern you'll reuse on the Team and Events pages:
//   array of data  ->  loop  ->  create elements  ->  add them to the page
function renderLearningSongs() {
  const list = document.getElementById("learning-songs");
  if (!list) return;

  const songs = siteConfig.learningSongs ?? [];

  if (songs.length === 0) {
    const note = document.createElement("p");
    note.className = "page-note";
    note.textContent = "No songs on the list yet. Check back soon.";
    list.replaceWith(note); // swap the empty <ul> for the note
    return;
  }

  songs.forEach((song) => {
    // Builds:  <li class="th-song-card">
    //            <h3 class="th-song-card__title">Amazing Grace</h3>
    //            <p class="th-song-card__author">John Newton</p>
    //          </li>
    const card = document.createElement("li");
    card.className = "th-song-card";

    const title = document.createElement("h3");
    title.className = "th-song-card__title";
    title.textContent = song.title;

    const artist = document.createElement("p");
    artist.className = "th-song-card__author";
    artist.textContent = song.artist;

    card.append(title, artist);
    list.append(card);
  });
}

renderPlaylist();
renderLearningSongs();
