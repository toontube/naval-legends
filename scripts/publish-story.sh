#!/bin/bash
# Publish next staged story to the Bravo Zulu site
# Moves one story + daily card from staging/ to src/content/

STAGING_DIR="/Users/max/MOZUMA/naval-legends/staging"
STORIES_DIR="/Users/max/MOZUMA/naval-legends/src/content/stories"
DAILY_DIR="/Users/max/MOZUMA/naval-legends/src/content/daily"

# Publishing order
SLUGS=(
  "karel-doorman-java-sea"
  "ironbottom-sound"
  "barents-sea-new-years-eve"
  "genoa-cathedral-shell"
  "scapa-flow-scuttling"
  "blucher-unlucky-name"
  "hms-invincible-fishers-folly"
  "yamamoto-isoroku"
)

published=0
for slug in "${SLUGS[@]}"; do
  story_src="$STAGING_DIR/stories/${slug}.md"
  daily_src="$STAGING_DIR/daily/${slug}.md"
  story_dst="$STORIES_DIR/${slug}.md"
  daily_dst="$DAILY_DIR/${slug}.md"

  # Skip if already published
  if [[ -f "$story_dst" ]]; then
    continue
  fi

  # Skip if staging file missing
  if [[ ! -f "$story_src" || ! -f "$daily_src" ]]; then
    echo "ERROR: Missing staging files for $slug"
    continue
  fi

  cp "$story_src" "$story_dst"
  # Staged drafts carry the date they were written; stamp the publish date
  sed -i '' "s/^date: .*/date: $(date +%Y-%m-%d)/" "$story_dst"
  cp "$daily_src" "$daily_dst"
  echo "Published: $slug"
  published=1
  break
done

if [[ $published -eq 0 ]]; then
  echo "No stories left to publish."
fi
