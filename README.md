# Vitaly Kurin's paper notes to arXiv.wiki

Links to notes are here:
https://www.notion.so/Paper-Notes-by-Vitaly-Kurin-97827e14e5cd4183815cfe3a5ecf2f4c

This builds a list of arxiv urls paired with Kurin's notes page.

## How to run

The last time this was run was on 2021-04-22 (there were 61 papers). How many links have appeared since? Add this number to the last line of index.js: (if it is N, do `parse(url, N)`)

Then, run `npm start` (may have to run `npm install` beforehand). The pairs should generate in new_pairs.txt.

Compare this list with pairs.txt, and copy it over (for now, it's manual). pairs.txt should have a list of every paper from Kurin's paper notes.

Then, copy `pairs.txt` to `pairs.txt` in arxivwiki/arxivwiki. And you can run `kurin_import.py` locally. TBD: rig it up with a GitHub action.