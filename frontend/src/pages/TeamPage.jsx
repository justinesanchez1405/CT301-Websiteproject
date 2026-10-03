import MemberCard from "../components/MemberCard.jsx";
// Placeholder members. "Member name" is deliberate: never invent real people.
// Each team replaces these in team.json (and in Phase 3 they come from the database).
import members from "../data/team.json";

// The order the sections appear on the page.
const groups = ["Vocals", "Band", "Tech"];

export default function TeamPage() {
  return (
    <div className="page container">
      <title>Meet the team · Tehillim</title>
      <h1>Meet the team</h1>
      <p>The singers, musicians, and tech crew who lead worship together each week.</p>

      {groups.map((group) => {
        // filter() keeps only the members in this group.
        const groupMembers = members.filter((member) => member.group === group);
        if (groupMembers.length === 0) return null; // returning null draws nothing

        return (
          <section className="team-group" key={group} aria-labelledby={`group-${group}`}>
            <h2 id={`group-${group}`}>{group}</h2>
            <ul className="member-grid">
              {groupMembers.map((member) => (
                // Every member is called "Member name" for now, so the name can't be the
                // key: React needs keys that are unique. That's why each member has an id.
                <MemberCard
                  key={member.id}
                  name={member.name}
                  positions={member.positions}
                  photo={member.photo}
                />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
