# photos

Drop your own images in this folder. The site expects these filenames:

| File             | Used for                                      |
| ---------------- | --------------------------------------------- |
| `bg-web.jpg`     | Fixed page background (behind the cream wash)  |
| `photo1.jpg`     | Gallery                                        |
| `photo2.jpeg`    | Gallery                                        |
| `photo3.jpeg`    | Gallery                                        |
| `photo4-web.jpg` | Gallery                                        |
| `photo6.jpg`     | Gallery                                        |

Rename them here or edit the `<img src="...">` tags in `index.html` and the
`url("photos/bg-web.jpg")` rule in `style.css` to match your own filenames.

Until you add them, the gallery shows an "Add your photo" placeholder and the
page falls back to a plain gradient background — nothing renders broken.

Keep web copies small (roughly 200 KB or less) so the page loads quickly on
phones. Image files in this folder are gitignored so full-resolution originals
never end up in the repo.
