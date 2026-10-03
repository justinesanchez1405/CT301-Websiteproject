import Selah from "../components/Selah.jsx";
import SongCard from "../components/SongCard.jsx";
import settings from "../data/settings.json";
import { toSpotifyEmbedUrl } from "../utils/spotify.js";

export default function SongsPage() {
  const embedUrl = toSpotifyEmbedUrl(settings.spotifyPlaylistUrl);
  const songs = settings.learningSongs ?? [];

  return (
    <div className="page container">
      <title>Songs · Tehillim</title>
      <h1>Songs</h1>
      <p>The songs we sing together on Sundays. Listen along, learn them, and sing with us.</p>

      <section className="songs-section" aria-labelledby="playlist-title">
        <h2 id="playlist-title">Our playlist</h2>
        {/* Show the player OR the note. In the prototype this was an if/else that
            created different elements; in JSX, a ? b : c picks what to draw. */}
        {embedUrl ? (
          <iframe
            className="playlist-frame"
            src={embedUrl}
            // Screen readers announce an iframe by its title, so it must say what's inside.
            title={`${settings.churchName} worship playlist on Spotify`}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
        ) : (
          <p className="page-note">
            Playlist coming soon. In the meantime, see the songs we’re learning below.
          </p>
        )}
      </section>

      <Selah />

      <section className="songs-section" aria-labelledby="learning-title">
        <h2 id="learning-title">Songs we’re learning this month</h2>
        {songs.length === 0 ? (
          <p className="page-note">No songs on the list yet. Check back soon.</p>
        ) : (
          <ul className="song-grid">
            {/* array -> map -> one <SongCard> each. Same idea as the prototype's
                forEach + createElement loop, in one line. */}
            {songs.map((song) => (
              <SongCard key={song.title} title={song.title} artist={song.artist} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
