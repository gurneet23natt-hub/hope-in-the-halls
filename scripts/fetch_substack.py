"""Fetch the latest Hope in the Halls Substack posts into _data/newsletter_posts.json.

Run by .github/workflows/substack.yml every few hours. Uses only the Python
standard library. The output file is only rewritten when the posts change.

Usage: python scripts/fetch_substack.py [FEED_URL_OR_FILE]
"""
import html
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from pathlib import Path

FEED_URL = "https://hopeinthehalls.substack.com/feed"
SITE_PREFIX = "https://hopeinthehalls.substack.com/"
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


def parse(feed_xml):
    root = ET.fromstring(feed_xml)
    posts = []
    for item in root.iter("item"):
        link = (item.findtext("link") or "").strip()
        title = clean_text(item.findtext("title"))
        # Only keep real posts from our own Substack.
        if not title or not link.startswith(SITE_PREFIX):
            continue
        date = parsedate_to_datetime(item.findtext("pubDate"))
        summary = clean_text(item.findtext("description"), 200)
        if not summary:
            summary = clean_text(item.findtext("content:encoded", namespaces=NS), 200)
        image = first_image(item)
        posts.append({
            "title": title,
            "url": link,
            "date": date.strftime("%Y-%m-%d"),
            "summary": summary,
            "image": image if image and image.startswith("https://") else None,
        })
    posts.sort(key=lambda p: p["date"], reverse=True)
    return posts[:MAX_POSTS]


def main():
    source = sys.argv[1] if len(sys.argv) > 1 else FEED_URL
    if source.startswith("http"):
        req = urllib.request.Request(source, headers={"User-Agent": "hopeinthehalls.org newsletter sync"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            feed_xml = resp.read()
    else:
        feed_xml = Path(source).read_bytes()

    posts = parse(feed_xml)
    new = json.dumps(posts, indent=2, ensure_ascii=False) + "\n"
    old = OUT.read_text(encoding="utf-8") if OUT.exists() else ""
    if new == old:
        print(f"No changes ({len(posts)} posts).")
        return
    OUT.write_text(new, encoding="utf-8")
    print(f"Updated {OUT.name} with {len(posts)} posts.")


if __name__ == "__main__":
    main()
