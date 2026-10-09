# Hope in the Halls

Website for **Hope in the Halls**, a Sacramento nonprofit bringing comfort, joy, and hope to pediatric patients through toy drives and care packages.

Built with [Jekyll](https://jekyllrb.com), which GitHub Pages runs automatically, so there is nothing to build by hand. Edit a file on GitHub and the site updates.

## Common edits

| To change… | Edit this |
| --- | --- |
| Email, Instagram, GoFundMe link, EIN, location | `_config.yml` |
| Homepage text (mission, projects, donate, contact) | `index.html` |
| Our Team tabs (Founders, Core Team, Leadership Committee, Ambassadors): names, bios, photos, LinkedIn | `_data/team.yml` (photos go in `assets/team/`) |
| Blog posts and newsletters | Add a file to `_posts/`. See **[WRITING.md](WRITING.md)** |
| Menu and footer | `_includes/header.html`, `_includes/footer.html` |
| Colors and fonts | Top of `styles.css` |

### Adding team photos

1. Upload a photo (square works best) to `assets/team/`, e.g. `assets/team/jane-doe.jpg`.
2. In `_data/team.yml`, set that person's `photo: /assets/team/jane-doe.jpg`.
3. Paste their LinkedIn profile URL into `linkedin:`. Leave it blank to hide the button.

People are grouped by tab: `founders`, `core_team`, `leadership_committee`, `ambassadors`. Each tab has its own shareable link, e.g. `/team/#ambassadors`. A tab with nobody in it shows "Coming soon".

## Publishing with GitHub Pages

1. Merge this branch into `main`.
2. On GitHub: **Settings → Pages → Build and deployment → Deploy from a branch**, branch `main`, folder `/ (root)`, then Save.
3. The site goes live at `https://gurneet23natt-hub.github.io/hope-in-the-halls/` within a couple of minutes.

**Custom domain:** if you buy a domain like `hopeinthehalls.org`, enter it in the Pages settings, then change `baseurl` in `_config.yml` to `""` and `url` to your domain.

## Previewing locally (optional)

```sh
bundle install
bundle exec jekyll serve
# visit http://localhost:4000/hope-in-the-halls/
```

## Contact form

The form opens the visitor's email app. To receive messages directly, sign up for a free service like [Formspree](https://formspree.io) and set the form's `action` in `index.html` to the URL it gives you.
