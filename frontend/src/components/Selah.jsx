// The Selah divider: a musical pause between sections (brass word between two hairlines).
// A component because it repeats on several pages. Write <Selah /> instead of the markup each time.
// aria-hidden because it's decoration, not content.
export default function Selah() {
  return (
    <div className="th-selah" aria-hidden="true">
      <span>Selah</span>
    </div>
  );
}
