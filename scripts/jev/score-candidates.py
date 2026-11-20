"""Score Bravo Zulu story candidates with TypeSafe Jev.

Usage: python3 scripts/jev/score-candidates.py <candidates.json> <out.json> [campaign ship]
Candidates: [{id, ship, summary, ...}]. Reads TYPESAFE_API_KEY from .env.local.
Read-only: calls the TypeSafe API, writes only <out.json>.
"""
import json
import os
import sys
import urllib.request

API = "https://api.typesafe.ai/v1/systemone"
BATCH = 10


def load_key():
    if os.environ.get("TYPESAFE_API_KEY"):
        return os.environ["TYPESAFE_API_KEY"]
    for line in open(os.path.join(os.path.dirname(__file__), "../../.env.local")):
        if line.startswith("TYPESAFE_API_KEY="):
            return line.split("=", 1)[1].strip()
    sys.exit("TYPESAFE_API_KEY missing")


def questions(cid, ship):
    ref = f"`candidates.{cid}.summary`"
    return {
        f"{cid}.barbecue": {
            "type": "score",
            "instructions": f"Barbecue test: would a reader retell this true naval story to friends? Story: {ref}",
            "criteria": [
                "Dry facts or specs, nobody would retell it",
                "Mildly interesting, forgotten the next day",
                "A good story with one surprising, concrete detail",
                "A jaw-dropping true story people retell for years",
            ],
        },
        f"{cid}.specific": {
            "type": "score",
            "instructions": f"How specific is the story {ref}: named people, exact moments, objects, numbers?",
            "criteria": [
                "General statements only",
                "Some specifics but mostly general",
                "Named people or exact moments drive the story",
            ],
        },
        f"{cid}.human": {
            "type": "noul",
            "instructions": f"Does the story {ref} center on what a person or crew did or felt, not only on the ship's hardware?",
            "criteria": {"true": "A person or crew is at the center", "false": "Mainly hardware, dates or specs"},
        },
        f"{cid}.campaign": {
            "type": "noul",
            "instructions": f"Is the story {ref} mainly about {ship}?",
            "criteria": {"true": f"Mainly about {ship}", "false": "About another ship or no specific ship"},
        },
    }


def call(key, state, qs):
    body = json.dumps({"model": "jev-latest", "state": state, "questions": qs}).encode()
    req = urllib.request.Request(API, data=body, headers={
        "Authorization": "Bearer " + key, "Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, timeout=60))


def main():
    src, out = sys.argv[1], sys.argv[2]
    ship = sys.argv[3] if len(sys.argv) > 3 else "the battleship USS Texas (BB-35)"
    cands = json.load(open(src))
    key = load_key()
    results, tokens = [], 0
    for i in range(0, len(cands), BATCH):
        chunk = cands[i:i + BATCH]
        state = {"candidates": {c["id"]: {"ship": c.get("ship", ""), "summary": c["summary"]} for c in chunk}}
        qs = {}
        for c in chunk:
            qs.update(questions(c["id"], ship))
        r = call(key, state, qs)
        tokens += r.get("usage", {}).get("input_tokens", 0)
        a = r["answers"]
        for c in chunk:
            cid = c["id"]
            bbq, spec = a[f"{cid}.barbecue"], a[f"{cid}.specific"]
            results.append({
                **c,
                "barbecue": bbq["score"], "barbecue_conf": bbq["confidence"],
                "specific": spec["score"],
                "human": a[f"{cid}.human"]["noul"],
                "campaign": a[f"{cid}.campaign"]["noul"],
                # Weights live in code so they can change without rerunning Jev.
                "rank": round(bbq["score"] / 3 * 0.6 + spec["score"] / 2 * 0.25 + a[f"{cid}.human"]["noul"] * 0.15, 3),
            })
    results.sort(key=lambda x: -x["rank"])
    json.dump(results, open(out, "w"), indent=1)
    print(f"scored {len(results)} candidates, {tokens} input tokens -> {out}")


if __name__ == "__main__":
    main()
