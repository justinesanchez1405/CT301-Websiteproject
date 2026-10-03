/*
  team.js: only loaded on team.html
  ---------------------------------
  Builds the member cards from the `teamMembers` array below, grouped into
  Vocals, Band, and Tech. Same pattern as songs.js:
    array of data  ->  loop  ->  create elements  ->  add them to the page

  Each team replaces these placeholders with its own members.
  (In Phase 3 this list comes from the database instead.)
*/

// Placeholder members. "Member name" is deliberate: never invent real people.
// group decides which section the card appears in. positions can hold more than one role.
const teamMembers = [
  { name: "Member name", positions: ["Worship leader", "Vocals"], group: "Vocals", photo: "" },
  { name: "Member name", positions: ["Vocals"], group: "Vocals", photo: "" },
  { name: "Member name", positions: ["Vocals"], group: "Vocals", photo: "" },
  { name: "Member name", positions: ["Keys"], group: "Band", photo: "" },
  { name: "Member name", positions: ["Acoustic guitar", "Vocals"], group: "Band", photo: "" },
  { name: "Member name", positions: ["Bass"], group: "Band", photo: "" },
  { name: "Member name", positions: ["Drums"], group: "Band", photo: "" },
  { name: "Member name", positions: ["Sound"], group: "Tech", photo: "" },
  { name: "Member name", positions: ["Lyrics/Projection"], group: "Tech", photo: "" },
];

// The order the sections appear on the page.
const teamGroups = ["Vocals", "Band", "Tech"];

// Used when a member has no photo yet.
const placeholderPhoto = "assets/images/member-placeholder.svg";

function createMemberCard(member) {
  // Builds:  <li class="member-card">
  //            <img src="..." alt="Photo of Member name">
  //            <h3 class="member-card__name">Member name</h3>
  //            <p class="member-card__roles">Keys</p>
  //          </li>
  const card = document.createElement("li");
  card.className = "member-card";

  const photo = document.createElement("img");
  photo.className = "member-card__photo";
  photo.src = member.photo || placeholderPhoto; // || means "use the placeholder if photo is empty"
  photo.alt = `Photo of ${member.name}`;
  photo.width = 240;
  photo.height = 240; // width/height stop the page jumping while images load
  photo.loading = "lazy";

  const name = document.createElement("h3");
  name.className = "member-card__name";
  name.textContent = member.name;

  const roles = document.createElement("p");
  roles.className = "member-card__roles";
  roles.textContent = member.positions.join(", "); // ["Acoustic guitar", "Vocals"] -> "Acoustic guitar, Vocals"

  card.append(photo, name, roles);
  return card;
}

function renderTeam() {
  const container = document.getElementById("team-groups");
  if (!container) return;

  teamGroups.forEach((group) => {
    // filter() keeps only the members whose group matches this section.
    const members = teamMembers.filter((member) => member.group === group);
    if (members.length === 0) return; // skip empty sections entirely

    const section = document.createElement("section");
    section.className = "team-group";

    const heading = document.createElement("h2");
    heading.textContent = group;

    const list = document.createElement("ul");
    list.className = "member-grid";
    members.forEach((member) => list.append(createMemberCard(member)));

    section.append(heading, list);
    container.append(section);
  });
}

renderTeam();
