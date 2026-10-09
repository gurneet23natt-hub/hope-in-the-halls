"""Fetch the latest Hope in the Halls Substack posts into _data/newsletter_posts.json.

Run by .github/workflows/substack.yml every few hours. Uses only the Python
standard library. The output file is only rewritten when the posts change.

Substack sometimes refuses requests from cloud servers, so several sources
are tried in order: the RSS feed, Substack's own post list, then a public
RSS-to-JSON service. If all fail, the current posts are left as they are.

Usage: python scripts/fetch_substack.py [FEED_FILE]   (a file is for testing)
"""
import html
import json
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime
from email.utils import parsedate_to_datetime
from pathlib import Path

SITE = "https://hopeinthehalls.substack.com"
FEED_URL = SITE + "/feed"
ARCHIVE_URL = SITE + "/api/v1/archive?sort=new&limit=12"
RSS2JSON_URL = "https://api.rss2json.com/v1/api.json?rss_url=" + urllib.parse.quote(FEED_URL, safe="")
SITE_PREFIX = SITE + "/"
BROWSER_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    "Accept": "application/rss+xml, application/xml, application/json;q=0.9, */*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}
OUT = Path(__file__).resolve().parent.parent / "_data" / "newsletter_posts.json"
MAX_POSTS = 12
NS = {"content": "http://purl.org/rss/1.0/modules/content/"}


def clean_text(value, limit=None):
    """Strip tags and collapse whitespace; Jekyll escapes it again when rendering."""
    text = html.unescape(re.sub(r"<[^>]+>", " ", value or ""))
    text = re.sub(r"\s+", " ", text).strip()
    if limit and len(text) > limit:
        text = text[:limit].rsplit(" ", 1)[0].rstrip(",.;:") + "…"
    return text


def first_image(item):
    enclosure = item.find("enclosure")
    if enclosure is not None and (enclosure.get("type") or "").startswith("image/"):
        return enclosure.get("url")
    body = item.findtext("content:encoded", default="", namespaces=NS)
    match = re.search(r'<img[^>]+src="(https://[^"]+)"', body)
    return html.unescape(match.group(1)) if match else None


def make_post(title, link, date, summary, image):
    title = clean_text(title)
    link = (link or "").strip()
    # Only keep real posts from our own Substack.
    if not title or not link.startswith(SITE_PREFIX):
        return None
    return {
        "title": title,
        "url": link,
        "date": date.strftime("%Y-%m-%d"),
        "summary": clean_text(summary, 200),
        "image": image if image and image.startswith("https://") else None,
    }


def parse(feed_xml):
    root = ET.fromstring(feed_xml)
    posts = []
    for item in root.iter("item"):
        summary = item.findtext("description") or item.findtext("content:encoded", namespaces=NS)
        post = make_post(item.findtext("title"), item.findtext("link"),
                         parsedate_to_datetime(item.findtext("pubDate")), summary, first_image(item))
        if post:
            posts.append(post)
    posts.sort(key=lambda p: p["date"], reverse=True)
    return posts[:MAX_POSTS]


def parse_archive(data):
    """Substack's /api/v1/archive JSON list."""
    posts = []
    for p in json.loads(data):
        date = datetime.fromisoformat((p.get("post_date") or "").replace("Z", "+00:00"))
        post = make_post(p.get("title"), p.get("canonical_url"), date,
                         p.get("subtitle") or p.get("description") or p.get("truncated_body_text"),
                         p.get("cover_image"))
        if post:
            posts.append(post)
    posts.sort(key=lambda p: p["date"], reverse=True)
    return posts[:MAX_POSTS]


def parse_rss2json(data):
    """api.rss2json.com response."""
    body = json.loads(data)
    if body.get("status") != "ok":
        raise ValueError(body.get("message", "rss2json error"))
    posts = []
    for item in body.get("items", []):
        date = datetime.strptime(item["pubDate"], "%Y-%m-%d %H:%M:%S")
        image = (item.get("enclosure") or {}).get("link") or item.get("thumbnail")
        post = make_post(item.get("title"), item.get("link"), date,
                         item.get("description") or item.get("content"), image)
        if post:
            posts.append(post)
    posts.sort(key=lambda p: p["date"], reverse=True)
    return posts[:MAX_POSTS]


def fetch(url):
    req = urllib.request.Request(url, headers=BROWSER_HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read()


def fetch_posts():
    errors = []
    for name, url, parser in [
        ("RSS feed", FEED_URL, parse),
        ("Substack archive", ARCHIVE_URL, parse_archive),
        ("rss2json", RSS2JSON_URL, parse_rss2json),
    ]:
        try:
            posts = parser(fetch(url))
            print(f"Got {len(posts)} posts from {name}.")
            return posts
        except Exception as exc:  # try the next source
            errors.append(f"{name}: {exc}")
            print(f"{name} failed: {exc}")
    raise RuntimeError("; ".join(errors))


def main():
    if len(sys.argv) > 1:
        posts = parse(Path(sys.argv[1]).read_bytes())
    else:
        try:
            posts = fetch_posts()
        except RuntimeError as exc:
            # Leave the site as it is; show a warning in the Actions log instead of failing.
            print(f"::warning::Could not reach Substack, keeping current posts ({exc})")
            return

    new = json.dumps(posts, indent=2, ensure_ascii=False) + "\n"
    old = OUT.read_text(encoding="utf-8") if OUT.exists() else ""
    if new == old:
        print(f"No changes ({len(posts)} posts).")
        return
    OUT.write_text(new, encoding="utf-8")
    print(f"Updated {OUT.name} with {len(posts)} posts.")


if __name__ == "__main__":
    main()
