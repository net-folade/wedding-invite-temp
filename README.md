# Wedding Invitation Template

A single-page wedding invitation: an envelope you tap to open, a live countdown,
a photo gallery, and an RSVP form that writes to a Google Sheet. No build step,
no dependencies — plain HTML, CSS, and JavaScript.

## Use it

1. Click **Use this template** on GitHub (or clone the repo).
2. Fill in your details — every placeholder is listed below.
3. Add your photos to `photos/` (see `photos/README.md`).
4. Wire up the RSVP form (optional, see below).
5. Publish with GitHub Pages: **Settings → Pages → Deploy from branch → `main` / root**.

## What to replace

**`index.html`**

- `Partner One` / `Partner Two` — the couple's names (hero heading and footer)
- `A &amp; B` and `A♥B` — initials on the envelope card and seal
- `Saturday, January 1, 2030` and `2:00 PM` — date and time
- `Venue Name`, `City`, `Country` — the venue
- `href="#"` on the map link — your venue's map URL
- `Kindly respond by December 1, 2029` — the RSVP deadline
- The commented-out `.rsvp-phones` block — add your own contact numbers, or leave it out
- `<title>` and the `description` meta tag

**`script.js`**

- `WEDDING_DATE` — must match the date in `index.html` for the countdown to be right
- `RSVP_ENDPOINT` — see below

**`style.css`**

- `--` color variables at the top, if you want a different palette

## RSVP form

The form posts to a Google Apps Script web app, which appends each response as a
row in a Google Sheet.

1. Create a Google Sheet with these header columns:
   `timestamp`, `name`, `attending`, `plus_one`, `message`
2. **Extensions → Apps Script**, then paste:

   ```js
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     const p = e.parameter;
     sheet.appendRow([new Date(), p.name, p.attending, p.plus_one, p.message]);
     return ContentService.createTextOutput('ok');
   }
   ```

3. **Deploy → New deployment → Web app**. Set *Execute as* to yourself and
   *Who has access* to **Anyone**. Copy the URL that ends in `/exec`.
4. Paste it into `RSVP_ENDPOINT` in `script.js`.

The browser posts with `mode: "no-cors"` because Apps Script doesn't send CORS
headers. The response is therefore unreadable, so the page thanks the guest
optimistically without being able to confirm the write succeeded. Check the
sheet directly to see real responses.

Your deployment URL is effectively a public write endpoint. Anyone who views the
page source can find it and post to it, so don't put anything sensitive in the
sheet, and keep the URL out of any repo you make public.

## Notes

- Animations (confetti, petals, fade-ins) are skipped when the visitor has
  `prefers-reduced-motion` enabled.
- Everything is static, so it also works over `file://` — just open `index.html`.

## License

MIT
