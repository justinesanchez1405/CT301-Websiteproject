// One song card. Props are the component's inputs, like a function's arguments:
// <SongCard title="Amazing Grace" artist="John Newton" />
// In the HTML prototype, songs.js built this with five createElement/append calls.
export default function SongCard({ title, artist }) {
  return (
    <li className="th-song-card">
      <h3 className="th-song-card__title">{title}</h3>
      <p className="th-song-card__author">{artist}</p>
    </li>
  );
}
