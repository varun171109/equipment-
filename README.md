# Silambam Equipment website

Plain HTML, CSS and JavaScript. No build step. Products and prices come from **Supabase** (Phase 2). The cart stays in the visitor's browser (localStorage).

## One-time setup (about 10 minutes)

1. **Create a Supabase project** at https://supabase.com (free plan is fine).
2. **Create the products table.** In Supabase open **SQL Editor > New query**, paste the whole of `supabase/phase2_products.sql`, and press **Run**. You can run it again safely: it never duplicates products or overwrites prices you changed.
3. **Paste your two public values into `js/supabase-config.js`:**
   - `SUPABASE_URL`: your Project URL, like `https://abcdefghijkl.supabase.co`
   - `SUPABASE_ANON_KEY`: your **publishable** key (starts `sb_publishable_`), or the older **anon public** key
   - Find both in the Supabase dashboard under **Project Settings > API Keys** (older projects: **Settings > API**).
   - **Never** paste a *secret* key, *service_role* key or database password. The site refuses to start if it sees one.
4. **Open `index.html`** in a browser (or run `python3 -m http.server 8000` in this folder and visit http://localhost:8000).

## Changing products and prices

Open Supabase **Table Editor > products**. Changes appear on the website straight away; no files to edit.

| Column | Meaning |
|---|---|
| `retail_price`, `bulk_20_price`, `bulk_50_price` | price per piece for 1-19, 20-49 and 50+ pieces |
| `material`, `length`, `weight` | leave empty if unknown; the site shows "To be confirmed" |
| `is_active` | untick to hide a product from the website without deleting it |
| `sort_order` | order on the home page, lowest first |
| `image_url` | web address of a picture; empty = placeholder picture |
| `extra_specs` | extra spec rows, like `[{"label":"Intended use","value":"Training and practice"}]` |
| `stock_quantity` | not used by the website yet |
| `slug` | the product's web address name; changing it removes that product from carts people already saved |

The prices inserted by the SQL are **placeholders** from Phase 1. Replace them with your real prices.

## Other things you can change in files

| To change | Edit |
|---|---|
| Business name, logo, colours, tier limits (20 / 50), contact details | `js/config.js` |
| Gallery photos | `js/data/gallery.js` |
| Supabase URL and public key | `js/supabase-config.js` |

Set `showPlaceholderNotice: false` in `js/config.js` once real content is in.

## If products do not appear

Customers only see "Unable to load products right now". The real reason is written to the browser console: press **F12**, open **Console**, and look for a line starting `[productService]`. The usual causes are the two values in `js/supabase-config.js` not pasted yet, or the SQL not run.

## Structure
```
supabase/phase2_products.sql   table, security rules, the 8 products
js/supabase-config.js          your Supabase URL + public key (only place)
js/config.js                   site settings
js/vendor/                     Supabase browser library (v2.117.3, MIT licence), kept local
js/services/                   supabaseClient, productService, cartService
js/lib/                        pricing (getPriceForQuantity), formatting, DOM and image helpers
js/components/                 header, footer, product card, quantity selector, price tiers, status messages, toast
js/pages/                      home, product, cart, about, gallery, contact
js/router.js                   hash routing (#/, #/product/<slug>, #/cart ...)
css/                           base, layout, components, pages
```

## Security notes
- The browser only ever holds the **public** key. Row Level Security on `products` lets visitors **read active products only**; they cannot insert, update or delete anything, change prices or see hidden products.
- Orders, accounts, payments and admin are not built yet (later phases).
