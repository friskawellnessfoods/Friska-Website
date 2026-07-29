# blog/ — how to publish a post

Every post is one plain HTML file in this folder. No build step, no CMS.
Publishing a post is 4 edits and a push.

---

## Adding a post — the 4 steps

### 1. Copy the template
Duplicate `post-template.html` and rename it to your **slug** — lowercase,
hyphens, no spaces, no dates:

    blog/meal-prep-for-busy-professionals.html

The slug becomes the URL, so make it readable and keyword-bearing:

    https://friskawellness.com/blog/meal-prep-for-busy-professionals.html

Once a post is live **never rename the file** — the old URL 404s and any
shares or search rankings pointing at it die. If you must, keep the old file
with a redirect.

### 2. Find-and-replace the placeholders
Open the file and replace every ALL-CAPS placeholder:

| Placeholder | What goes there |
|---|---|
| `POST-SLUG` | the filename slug, no `.html` (appears in canonical, OG tags, image paths) |
| `POST TITLE` | the headline — under 60 characters or Google truncates it |
| `SHORT SOCIAL DESCRIPTION` | one sentence for WhatsApp/Facebook previews |
| the `meta name="description"` text | 140–160 characters, written to earn a click |
| `YYYY-MM-DD` | publish date, machine format |
| `DD Month YYYY` | publish date, human format |
| `CATEGORY` | Nutrition / Guides / Behind the scenes |
| `AUTHOR NAME` and `XX` | author, plus their two initials for the avatar |
| `N min read` | roughly words ÷ 200 |

Then write the body between the `<div class="post-body">` tags. Available
elements: `<p>`, `<h2>`, `<h3>`, `<ul>`, `<ol>`, `<figure>` with `<figcaption>`,
`<blockquote>`. Structure matters — use `<h2>` for sections and `<h3>` for
sub-points, never skip a level.

### 3. Add the images
Hero image goes in `assets/` named after the slug:

    assets/meal-prep-for-busy-professionals.jpg      16:9, ~1200x675

Inline images use `-a`, `-b` suffixes:

    assets/meal-prep-for-busy-professionals-a.jpg

Always write a real `alt` description. "image1" helps nobody; "Glass containers
of prepped quinoa salad on a kitchen counter" helps both search and screen readers.

### 4. Link it from two places

**`blog.html`** — copy an existing `<article class="post-card">` block and edit
it. Newest post goes first.

**`sitemap.xml`** — add a `<url>` block in the blog posts section:

    <url>
      <loc>https://friskawellness.com/blog/YOUR-SLUG.html</loc>
      <lastmod>YYYY-MM-DD</lastmod>
      <changefreq>yearly</changefreq>
      <priority>0.6</priority>
    </url>

Forgetting the sitemap means Google finds the post slowly or not at all.

---

## Share buttons
Already wired — WhatsApp, Facebook, X, LinkedIn, copy-link, and the native
share sheet on mobile. They read the canonical URL from the page head, so as
long as you set the canonical correctly in step 2 they work with no extra edits.

---

## SEO — what's already done

- Unique `<title>` and meta description on every page
- Canonical URLs (tells Google which URL is authoritative)
- Open Graph + Twitter Card tags, so links unfurl with an image on WhatsApp,
  Instagram DMs, Facebook and X
- JSON-LD structured data: `FoodEstablishment` on the homepage (feeds the Google
  business panel), `BlogPosting` on each post, `Blog` on the listing
- `sitemap.xml` and `robots.txt`
- Semantic HTML, one `<h1>` per page, proper heading hierarchy
- Static files, no framework — already fast, which is a ranking factor

## SEO — what you still have to do

These cannot be done from the code. In rough priority order:

**1. Cut over the domain first.** Everything below depends on the site being
live at `friskawellness.com`. Search Console verification, sitemap submission
and backlinks all attach to the domain. Doing SEO work while the content sits
on `github.io` wastes it.

**2. Google Search Console** — `search.google.com/search-console`
Add `friskawellness.com`, verify by DNS TXT record, then submit
`https://friskawellness.com/sitemap.xml`. This is how you find out which
searches you appear for, and which pages Google can't index. Check it monthly.

**3. Google Business Profile** — the single highest-impact item for a local
food business. When someone searches "healthy tiffin Hyderabad", the map pack
appears above the normal results. You already have the listing (that's where
your reviews come from) — make sure the website field points to
`friskawellness.com`, hours are right, and you post photos regularly.

**4. Bing Webmaster Tools** — five minutes, imports from Search Console.
Small traffic share but it also feeds ChatGPT search.

**5. Write posts targeting what people actually type.** Not "Nutrition Tips"
but "high protein tiffin service in Hyderabad" or "how many calories in a
weight loss meal plan". Search your own phrases in an incognito window — if
you see forums and thin content ranking, you can beat them. If you see
HealthifyMe and big publishers, pick something narrower and more local.

**6. Get a few real backlinks.** Local food blogs, Hyderabad business
directories, a gym or clinic you supply. Ten genuine local links beat a
hundred bought ones, and bought links carry a penalty risk.

**7. Internal links.** From each post, link to the plan builder and to one
other post. This is free and most people skip it.

## Realistic expectations

Nothing here moves rankings this week. A new domain takes roughly 3–6 months
of consistent posting to compete on anything but the least contested phrases.
The Business Profile is the exception — that can drive calls almost immediately.
One genuinely useful post a month beats four thin ones.
