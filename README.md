# Hope in the Halls

Website for Hope in the Halls, a nonprofit organization. It's a plain HTML/CSS/JS site with no build step, so anyone can edit it.

## Files

| File | What it is |
| --- | --- |
| `index.html` | All page content (Mission, Projects, Get Involved, Blog, Donate, Contact) |
| `styles.css` | Styling. Brand colors and fonts are at the top under `:root` |
| `script.js` | Mobile menu and footer year |
| `assets/favicon.svg` | Logo / browser tab icon |

## Preview locally

Open `index.html` in a browser, or run:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Making it yours

Search `index.html` for `EDIT:` comments. Each marks content to replace:

- [ ] If you're a registered 501(c)(3), uncomment the EIN line in the donate section
- [ ] Logo in `assets/favicon.svg`, if you have one

### Receiving contact form messages

The form currently opens the visitor's email app. To get submissions in your inbox without that step, sign up for a free form service such as [Formspree](https://formspree.io), then change the form tag to:

```html
<form class="contact-form" action="https://formspree.io/f/YOUR_ID" method="post">
```

## Publishing for free with GitHub Pages

1. Merge this branch into `main`.
2. In the repo on GitHub: **Settings → Pages**.
3. Under "Build and deployment", choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
4. In a minute or two your site is live at `https://<your-username>.github.io/hope-in-the-halls/`.

To use a custom domain (like `hopeinthehalls.org`), enter it in the same Pages settings and follow GitHub's DNS instructions.
