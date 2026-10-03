# Tehillim

Tehillim (תְּהִלִּים) is the Hebrew name for the book of Psalms. It means "praises." This is the brand kit for any worship and music team that uses Tehillim: how the website and anything the team makes should look, sound, and feel.

The brand in one line: reverent, warm, and prepared, like a good rehearsal. Nothing showy, nothing careless.

## Voice and copy

Write like a friendly team leader talking to a new volunteer: plain, warm, and clear.

- Sentence case for every heading, button, and label. "Meet the team", not "Meet The Team".
- Buttons say exactly what happens: "Send application", "Confirm I can serve", "Add song". Never "Submit" or "Click here".
- No exclamation marks in the interface. Joy comes from the music, not the punctuation.
- Errors explain the fix: "Enter an email so we can reply", not "Invalid input".
- Empty states invite action: "No songs yet. Add the first one."
- Scripture uses the King James Version (public domain). Cite as "Psalm 150:6" in the `caption` style, `ink-muted`.

| Do | Don't |
|---|---|
| Join the team | JOIN NOW!!! |
| You're serving on Sunday, October 11 | Assignment #482 confirmed |
| Rehearsal moved to 5:00 PM | Schedule change alert |

## Logo

Four files live in the Logos assets group:

- Stacked wordmark: the Hebrew word over "Tehillim" with a brass rule between. Use for the home hero image, social banners, and printed material.
- Horizontal lockup: "Tehillim", a brass rule, then the Hebrew. Use for document headers and email signatures.
- On night: the stacked wordmark reversed out of `night`, for dark backgrounds.
- Mark: the letter tav (ת), the first letter of Tehillim, on `tekhelet`. Use for the favicon, app icon, and social avatars.

Rules:

- On the website, set the header wordmark in live type (`Frank Ruhl Libre`, `ink` and `tekhelet`) so it switches with the theme. The SVG files are for favicons, social, and print.
- Clear space around any logo equals the height of the Hebrew letters.
- Minimum size: stacked 120px wide, horizontal 160px wide, mark 16px.
- Hebrew reads right to left. Never mirror, reorder, or respace the Hebrew letters, and never remove the vowel marks from the logo.
- Don't recolor the logo outside `tekhelet`, `ink`, and `surface`/`on-night`. Don't stretch, outline, or add effects.

## Color

Day is the default theme for the public site. Night watch (from Psalm 63:6, "when I meditate on thee in the night watches") is the dark theme, used for dark mode and for the stage lyrics display, where a bright screen would distract.

- `tekhelet` is the brand. It carries links, secondary buttons, chords, and the active state. Named for the blue dye of the priestly garments.
- `pomegranate` appears once per view, on the single action the page exists for. Pomegranates were embroidered on the priest's robe; here they mark the one thing to press.
- `brass` is for thin details only: the Selah divider and the rule in the logo. Never body text, never large fills.
- `olive` means confirmed, `danger` means declined or wrong. Both always come with a word or an icon, never color alone.
- Text pairings in both themes meet WCAG AA (4.5:1 for text, 3:1 for input borders and focus rings). Each color token's note says which surfaces it is legible on.

## Typography

Two families, both on Google Fonts, both with full Hebrew support:

- Frank Ruhl Libre (`--font-display`): headings, the Hebrew word, and scripture. A classic Hebrew and Latin serif.
- Assistant (`--font-sans`): everything functional. Body text, buttons, forms, the whole team portal.

Load them with:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700&family=Frank+Ruhl+Libre:wght@400;500;700&display=swap" rel="stylesheet">
```

- Any Hebrew text gets `lang="he" dir="rtl"`.
- Keep paragraphs under `reading-max` (68 characters). Serif verses get the looser 1.5 line height of the `verse` style.
- Headings are weight 500 in the serif. Don't bold them further.

## The signature: one bold moment, then calm

- The Hebrew word תְּהִלִּים set large (`wordmark-he`) is the brand's one bold moment. It appears once, in the home hero. Every other page stays quiet.
- The Selah divider separates sections on public pages. In the Psalms, Selah likely marks a musical pause. Here it is a small `brass` word between two short hairlines.
- Lines, not shadows: cards are defined by a `stroke-hair` border in `line`, never a drop shadow. No gradients.
- Left-aligned text everywhere except the home hero and the Selah divider, which are centered.

## Layout and spacing

- Mobile first. Design at 360px wide, then 768px and 1280px. Most of the team will open the portal on a phone at rehearsal.
- Spacing comes only from the `space-*` tokens (a 4px grid). Page gutters: `space-6` on phones, `space-12` on desktop.
- Content is capped at `content-max` (1120px).
- Touch targets are at least 44px tall.

## Imagery

- Real photos of your own team: rehearsals, hands on instruments, the room before service. Natural light.
- Avoid stock worship clichés (silhouetted hands raised against stage lights) and anything posed.
- Photos get `radius-lg` corners and no filters or overlays.

## Iconography

- Use Lucide icons (outline, 1.5px stroke) at 20px inline and 24px in navigation. They inherit the text color.
- Useful icons: `music`, `mic`, `guitar`, `piano`, `drum`, `calendar`, `users`, `clock`, `check`, `x`, `bell`.
- An icon never replaces a word in navigation or status; it sits beside it.

## Using this kit in code

- Copy the color tokens into CSS custom properties with the same names (`--tekhelet`, `--surface`). Put Day values on `:root` and Night watch values on `[data-theme="dark"]`.
- Copy spacing, radius, stroke, and layout tokens the same way (`--space-4`, `--radius-md`).
- `components.css` contains working CSS for every component shown here (prefix `th-`). Use it as the reference when building the site.
- In this repo: `docs/brand/tokens.css` has every token as ready-to-paste CSS, `docs/brand/components.css` is the reference CSS for each component, and `docs/brand/logos/` holds the SVG logos.
