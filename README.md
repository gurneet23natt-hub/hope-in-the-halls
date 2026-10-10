# Hope in the Halls

Website for **Hope in the Halls**, a Sacramento nonprofit bringing comfort, joy, and hope to pediatric patients through toy drives and care packages.

Built with [Jekyll](https://jekyllrb.com), which GitHub Pages runs automatically, so there is nothing to build by hand. Edit a file on GitHub and the site updates.

## Common edits

| To change… | Edit this |
| --- | --- |
| Email, Instagram, GoFundMe link, location, visit counter (GoatCounter) | `_config.yml` |
| Homepage text (mission, projects, donate, contact) | `index.html` |
| Our Team tabs (Founders, Core Team, Leadership Committee, Ambassadors): names, bios, photos, LinkedIn | `_data/team.yml` (photos go in `assets/team/`) |
| Events (fundraisers, drives) | `_data/events.yml`; flyers go in `assets/events/`. Past events hide automatically |
| Toy drive photo gallery on the homepage | `_data/gallery.yml` (photos go in `assets/toy-drive/`) |
| Newsletter | Written and sent on Substack (hopeinthehalls.substack.com). The signup form is embedded on the Newsletter page, and the latest issues are copied to `_data/newsletter_posts.json` every 3 hours by `.github/workflows/substack.yml` (run it now from **Actions → Sync Substack newsletter → Run workflow**) |
| Menu and footer | `_includes/header.html`, `_includes/footer.html` |
| Colors and fonts | Top of `styles.css` |

### Adding team photos

1. Upload a photo (square works best) to `assets/team/`, e.g. `assets/team/jane-doe.jpg`.
2. In `_data/team.yml`, set that person's `photo: /assets/team/jane-doe.jpg`.
3. Paste their LinkedIn profile URL into `linkedin:`. Leave it blank to hide the button.

People are grouped by tab: `founders`, `core_team`, `leadership_committee`, `ambassadors`. Each tab has its own shareable link, e.g. `/team/#ambassadors`. A tab with nobody in it shows "Coming soon".

## Publishing with GitHub Pages

The site lives at **https://hopeinthehalls.org**. The domain is registered at Namecheap; the `CNAME` file in this repo tells GitHub Pages to use it.

1. Merge this branch into `main`.
2. On GitHub: **Settings → Pages → Build and deployment → Deploy from a branch**, branch `main`, folder `/ (root)`, then Save.
3. Under **Custom domain**, make sure it says `hopeinthehalls.org`, then tick **Enforce HTTPS** once it becomes available.

### Namecheap DNS settings (Domain List → Manage → Advanced DNS)

Delete the default parking-page records, then add:

| Type | Host | Value |
| --- | --- | --- |
| A Record | `@` | `185.199.108.153` |
| A Record | `@` | `185.199.109.153` |
| A Record | `@` | `185.199.110.153` |
| A Record | `@` | `185.199.111.153` |
| CNAME Record | `www` | `gurneet23natt-hub.github.io.` |

## Previewing locally (optional)

```sh
bundle install
bundle exec jekyll serve
# visit http://localhost:4000/
```

## Contact form

The form opens the visitor's email app. To receive messages directly, sign up for a free service like [Formspree](https://formspree.io) and set the form's `action` in `index.html` to the URL it gives you.
