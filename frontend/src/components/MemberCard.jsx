// Used when a member has no photo yet. BASE_URL is where the site lives ("/" locally),
// so the image path still works if the site is hosted in a sub-folder (like GitHub Pages).
const placeholderPhoto = `${import.meta.env.BASE_URL}images/member-placeholder.svg`;

// One team member: square photo, name, and their position(s).
export default function MemberCard({ name, positions, photo }) {
  return (
    <li className="member-card">
      <img
        className="member-card__photo"
        src={photo || placeholderPhoto} // || means "use the placeholder if photo is empty"
        alt={`Photo of ${name}`}
        width="240"
        height="240" // width/height stop the page jumping while images load
        loading="lazy"
      />
      <h3 className="member-card__name">{name}</h3>
      {/* ["Acoustic guitar", "Vocals"] -> "Acoustic guitar, Vocals" */}
      <p className="member-card__roles">{positions.join(", ")}</p>
    </li>
  );
}
