"""Build src/data/ships.json from the Wikidata export.

Usage: python3 scripts/ships/build-ships.py <wikidata-ships.json>
Applies src/data/ship-overrides.json and links our stories to ships by the
`ship` field of each daily card. Prints daily-card ships it could not match.
"""
import glob
import json
import re
import sys

src = json.load(open(sys.argv[1]))
overrides = json.load(open("src/data/ship-overrides.json"))
by_name = {}
for s in src:
    s["image_url"] = (s.get("image_url") or "").replace("http://", "https://") or None
    s.update({k: v for k, v in overrides.get(s["id"], {}).items() if not k.startswith("_")})
    by_name.setdefault(s["name"].lower(), []).append(s)

# Link stories: daily card "ship" name -> ship(s) with that exact name.
# Ambiguous names (several ships called "USS Wichita") go to the best-known one:
# the ship with a Wikipedia article and the most conflicts.
unmatched = []
for f in glob.glob("src/content/daily/*.md"):
    text = open(f).read()
    ship = re.search(r"^ship:\s*(.+)$", text, re.M)
    story = re.search(r"^linkedStory:\s*(.+)$", text, re.M)
    if not ship or not story or story.group(1).strip() == "placeholder":
        continue
    name, slug = ship.group(1).strip().strip("\"'"), story.group(1).strip()
    cands = by_name.get(name.lower()) or by_name.get(("uss " + name).lower()) or by_name.get(("hms " + name).lower())
    if not cands:
        unmatched.append(name)
        continue
    best = max(cands, key=lambda s: (bool(s.get("wikipedia_url")), len(s.get("conflicts") or [])))
    best.setdefault("stories", [])
    if slug not in best["stories"]:
        best["stories"].append(slug)

# Hand links from the overrides file are already on the ship (applied above)

json.dump(src, open("src/data/ships.json", "w"), separators=(",", ":"))
linked = sum(1 for s in src if s.get("stories"))
print(f"{len(src)} ships, {linked} linked to stories. Unmatched: {sorted(set(unmatched))}")
