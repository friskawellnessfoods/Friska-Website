# plan/ — quote generator

This is now the LIVE copy of the quote generator. Edit here, not in the old repo.
URL: https://friskawellnessfoods.github.io/Friska-Website/plan/

index.html is already here. Copy these 6 files across from the old quote generator repo,
keeping the exact filenames:

- config.js            (holds API_URL — without it the page loads but shows no prices)
- logo.png
- nutri_balance.webp
- high_protein.webp
- low_carb.webp
- high_carb.webp
- no_carb.webp

That's it. All paths inside index.html are relative, so once these sit alongside it,
it works unchanged.

## Do NOT copy
- CNAME, cname       — would hijack the whole site's domain (this already caused the
                       "github link opens the Wix site" bug once)
- leads.html         — stays in the old repo, runs independently off the same Sheet
- script.js          — not needed, this index.html has everything inline
- Distance.html      — utility/leftover

## What changed vs the old index.html
- title is now "Choose Your Plan | Friska Wellness"
- added a back arrow in the header (top-left) linking to ../index.html
- added "Back to Website" as the first item in the hamburger menu
Nothing else — all pricing, validation and submission logic is untouched.

## Open item (deferred, not forgotten)
API_URL is public in config.js, and ?action=leads currently returns the full customer
list to anyone who calls it. Add the Apps Script token gate before the site goes live.
