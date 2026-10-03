// Moved unchanged from the HTML prototype (site/js/songs.js). Plain JavaScript with
// no React in it, so it works anywhere. Keeping logic like this out of components
// makes it easy to reuse and to test on its own.

// People copy a playlist link like  https://open.spotify.com/playlist/37i9dQ...?si=abc
// but Spotify's player needs       https://open.spotify.com/embed/playlist/37i9dQ...
// Returns null if the link isn't a Spotify playlist, so a typo in settings shows
// "coming soon" instead of a broken box.
export function toSpotifyEmbedUrl(link) {
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
