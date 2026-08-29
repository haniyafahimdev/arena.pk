# Arena Admin Panel — Setup Guide

Files added for this system:
- `admin.html` — password-protected dashboard: **Menu Items**, **Meal Pricing**, **Bookings**, **Gallery**, **Settings** tabs
- `firebase-config.js` — shared config, **edit this first**
- `arena-data.js` — shared read/write helpers the public pages use
- `rangoli-buffet.html` — updated to load its pricing cards and dish cards from Firestore, falling back to the existing static content if Firestore has nothing yet
- every other page — the "Plan Your Visit" form now submits into Firestore (with an email fallback if that fails) so entries show up in the Bookings tab

**Nothing above works yet.** `firebase-config.js` currently has placeholder values, which is deliberate — I can't create a live Google Cloud project on your behalf. Follow the steps below (about 15 minutes) to make it real.

## What you'll be able to change yourself in `/admin.html` — no code, no calling anyone

- **Menu Items** — add, edit (hide/show), or delete the dish cards shown in "What's on each spread" on the Rangoli Buffet page. First visit shows a "Load Starter Menu" button that seeds it with what's already on the live page today.
- **Meal Pricing** — the 4 pricing cards (Dinner, Lunch cum Hi-Tea, Sunday Hi-Tea, Brunch): timing, price per head, child pricing, and perks. Same starter-seed pattern.
- **Bookings** — every "Plan Your Visit" submission from any page, newest first, with Confirm/Decline status.
- **Gallery** — add photos by pasting an image URL (see note below on why it's a URL, not a file upload).
- **Settings** — opening hours and contact info (phone, WhatsApp number, email, address).

Everything above lives in Firestore and is read live by the public pages — once set up, editing text or prices never requires touching a file again.

## 1. Firebase setup (database + login)

1. Go to https://console.firebase.google.com → **Create a project** (e.g. "arena-karachi").
2. In the project, go to **Build → Firestore Database** → Create database → start in **production mode**.
3. Go to **Build → Authentication** → **Get started** → enable the **Email/Password** sign-in method.
4. Still in Authentication, go to the **Users** tab → **Add user** → create your admin login (an email + a password). This is the only account that can log into `admin.html`.
5. Go to **Project settings** (gear icon, top-left) → scroll to **Your apps** → click the `</>` (web) icon → register an app (nickname anything) → copy the `firebaseConfig` object it gives you.
6. Paste those values into `firebase-config.js`, replacing every `REPLACE_WITH_...` placeholder.

### Firestore security rules

In Firestore → **Rules** tab, replace the default rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bookings/{bookingId} {
      // anyone can submit a new enquiry
      allow create: if request.resource.data.status == 'pending';
      // only the logged-in admin can read the list or change status
      allow read, update: if request.auth != null;
      allow delete: if false;
    }
    match /menuItems/{itemId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /mealPricing/{itemId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /gallery/{photoId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /settings/{settingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

This means: the public can submit a new pending booking through any page's "Plan Your Visit" form, and can read (but not change) the menu, pricing, gallery, and settings. Only whoever is logged into `admin.html` can write to any of those, or see/confirm/decline bookings.

## 2. Why gallery photos are a pasted URL, not a file upload

Firebase now requires its paid Blaze plan for Cloud Storage (a card on file, even for free-tier usage), and a proper no-card upload pipeline (e.g. Cloudinary, the pattern used on the nail-tech reference site) is a separate signup and a chunk of extra code. To keep this version working with zero extra accounts or cost, the Gallery tab takes an image URL instead — paste a link to a photo already hosted somewhere (e.g. a public Google Drive/Photos link, or a photo already on the live site under `assets/img/`). If you want real drag-and-drop file uploads later, that's a well-defined next step, not a rebuild.

## 3. Deploying this site

This is still a static site (HTML/CSS/JS, no server needed) — Firebase only powers the parts described above. Host it anywhere that serves static files (Netlify, Vercel, GitHub Pages, or your existing host). No build step, no environment variables required for the site itself; `firebase-config.js` ships its values directly (this is normal and safe for Firebase — see the comment at the top of that file for why).

## 4. Try it out

1. Open `admin.html` in a browser, log in with the account from step 1.4.
2. **Menu Items** tab → click **Load Starter Menu**.
3. **Meal Pricing** tab → click **Load Starter Pricing**.
4. **Settings** tab → confirm the hours/contact info are right, click **Save Settings** at least once.
5. Open `rangoli-buffet.html` in another tab — the pricing cards and dish cards should now be coming from what you just loaded, not the old static HTML.
6. Go to any page, submit the "Plan Your Visit" form as a test → back in `admin.html`'s **Bookings** tab, it should appear with status "pending".

## Notes

- Until you complete step 1, every public page keeps working exactly as it did before (static content) — nothing is broken by this being unconfigured.
- `admin.html` has `<meta name="robots" content="noindex, nofollow">` so it won't get indexed by search engines, but it isn't otherwise hidden — anyone with the URL can reach the login screen (they just can't get past it without a valid account). If you want it fully unlisted, keep the URL out of any sitemap or nav link, which is already the case here.
