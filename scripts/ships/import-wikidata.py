"""Fetch warships from Wikidata (CC0) into data/ships.json.

Usage: python3 scripts/ships/import-wikidata.py [out.json]
Read-only against Wikidata. Writes only the output file. Loading into
Supabase is a separate step after the JSON is reviewed.
"""
import json
import re
import sys
import time
import urllib.parse
import urllib.request

UA = "BravoZulu/0.1 (brvzulu.com; ship index)"
ENDPOINT = "https://query.wikidata.org/sparql"
BATCH = 300

# Step 1: every ship with a class (P289) whose operator (P137) is a navy (Q4508).
IDS_QUERY = """
SELECT DISTINCT ?s WHERE { ?s wdt:P289 ?c ; wdt:P137 ?navy . ?navy wdt:P31 wd:Q4508 . }
"""

# Step 2: details for one batch of ships.
DETAIL_QUERY = """
SELECT ?s ?name ?navyLabel ?classLabel ?typeLabel ?hull ?comm ?decomm ?img ?wiki
       (GROUP_CONCAT(DISTINCT ?conflictLabel; separator="|") AS ?conflicts)
WHERE {
  VALUES ?s { %s }
  ?s rdfs:label ?name . FILTER(LANG(?name) = "en")
  OPTIONAL { ?s wdt:P137 ?navy . ?navy wdt:P31 wd:Q4508 . ?navy rdfs:label ?navyLabel . FILTER(LANG(?navyLabel) = "en") }
  OPTIONAL { ?s wdt:P289 ?class . ?class rdfs:label ?classLabel . FILTER(LANG(?classLabel) = "en") }
  OPTIONAL { ?s wdt:P31 ?type . ?type rdfs:label ?typeLabel . FILTER(LANG(?typeLabel) = "en") }
  OPTIONAL { ?s wdt:P879 ?hull }
  OPTIONAL { ?s wdt:P729 ?comm }
  OPTIONAL { ?s wdt:P730 ?decomm }
  OPTIONAL { ?s wdt:P18 ?img }
  OPTIONAL { ?s wdt:P607 ?conflict . ?conflict rdfs:label ?conflictLabel . FILTER(LANG(?conflictLabel) = "en") }
  OPTIONAL { ?wiki schema:about ?s ; schema:isPartOf <https://en.wikipedia.org/> }
}
GROUP BY ?s ?name ?navyLabel ?classLabel ?typeLabel ?hull ?comm ?decomm ?img ?wiki
"""


def sparql(q):
    url = ENDPOINT + "?" + urllib.parse.urlencode({"query": q, "format": "json"})
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for attempt in range(4):
        try:
            return json.load(urllib.request.urlopen(req, timeout=180))["results"]["bindings"]
        except Exception as e:  # rate limit or timeout: back off
            print(f"  attempt {attempt + 1} failed: {e}", file=sys.stderr)
            time.sleep(10 * (attempt + 1))
    raise SystemExit("giving up")


def slugify(name, hull):
    base = f"{name} {hull}" if hull and hull.lower() not in name.lower() else name
    return re.sub(r"[^a-z0-9]+", "-", base.lower()).strip("-")


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else "data/ships.json"
    ids = [r["s"]["value"].rsplit("/", 1)[1] for r in sparql(IDS_QUERY)]
    print(f"{len(ids)} ship ids", file=sys.stderr)
    ships = {}
    for i in range(0, len(ids), BATCH):
        chunk = ids[i:i + BATCH]
        rows = sparql(DETAIL_QUERY % " ".join("wd:" + q for q in chunk))
        print(f"batch {i // BATCH + 1}: {len(rows)} rows", file=sys.stderr)
        for r in rows:
            v = lambda k: r[k]["value"] if k in r else None
            qid = v("s").rsplit("/", 1)[1]
            if qid in ships:  # one row per extra navy/class/type: keep the first
                continue
            ships[qid] = {
                "id": qid,
                "name": v("name"),
                "hull_number": v("hull"),
                "navy": v("navyLabel"),
                "class": v("classLabel"),
                "ship_type": v("typeLabel"),
                "commissioned": (v("comm") or "")[:10] or None,
                "decommissioned": (v("decomm") or "")[:10] or None,
                "conflicts": [c for c in (v("conflicts") or "").split("|") if c],
                "image_url": v("img"),
                "wikipedia_url": v("wiki"),
            }
        time.sleep(1)
    # Unique slugs: add the QID when two ships share a name and hull
    seen = {}
    for s in ships.values():
        slug = slugify(s["name"], s["hull_number"])
        s["slug"] = slug if slug not in seen else f"{slug}-{s['id'].lower()}"
        seen[s["slug"]] = True
    import os
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    json.dump(sorted(ships.values(), key=lambda s: s["name"]), open(out, "w"), indent=0)
    print(f"{len(ships)} ships -> {out}", file=sys.stderr)


if __name__ == "__main__":
    main()
