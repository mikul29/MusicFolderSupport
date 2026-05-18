# Music Folder — Support Portal

A modern, App Store-inspired support intake page for **Music Folder: Sheet Music**. Users submit bug reports and feature requests, and the report arrives directly in **musicfolder.app@gmail.com** via Web3Forms — no email app required, no redirect.

Free to host on GitHub Pages. No backend code to maintain.

---

## ⚠️ One-time setup before deploying

This site uses **[Web3Forms](https://web3forms.com)** (free, 250 submissions/month) to forward form submissions to your email.

1. Go to [web3forms.com](https://web3forms.com)
2. Click **Create your Access Key**
3. Enter your email: `musicfolder.app@gmail.com`
4. Check that inbox — you'll get an access key (a long string)
5. Open `index.html` and find this line:
   ```html
   <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">
   ```
6. Replace `YOUR_ACCESS_KEY_HERE` with your actual key
7. Save and upload to GitHub

That's it — submissions will start flowing into your Gmail.

**Don't worry about exposing the access key.** Web3Forms says it's safe to be public; it only forwards to the email it was created for.

---

## What's in the box

- `index.html` — the page itself
- `style.css` — the design system (Inter font, your brand orange, iOS-style rounded surfaces)
- `script.js` — form handling and submission
- `icon.png` — your app icon (used in the header and footer)
- `README.md` — this file

---

## Design

The page picks up your app's identity:

- **Brand orange** (`#FF9B69`) pulled directly from the app icon, used as accent gradient and on focused states
- **Inter** typeface — same family Apple uses in marketing, clean and modern
- **iOS-style pill buttons, rounded surfaces, soft shadows** — feels native to the platform
- **Type cards** (Bug / Feature / Question / Other) instead of a plain dropdown
- **Mobile-optimized** for iPhone and iPad with safe-area support and 44pt tap targets
- Smooth fade-in animations on load

---

## Deploy to GitHub Pages (5 minutes)

### 1. Create the repo
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `musicfolder-support` (or anything you like)
3. Set to **Public** (required for free GitHub Pages)
4. **Don't** initialize with a README
5. Click **Create repository**

### 2. Upload the files
1. On the empty repo page, click **"uploading an existing file"**
2. Drag all 5 files in: `index.html`, `style.css`, `script.js`, `icon.png`, `README.md`
3. Click **Commit changes**

### 3. Enable Pages
1. Go to **Settings** → **Pages** (left sidebar)
2. **Source**: Deploy from a branch
3. **Branch**: `main`, folder `/ (root)`
4. Click **Save**
5. Wait ~1 minute — your site goes live at:
   ```
   https://YOUR-USERNAME.github.io/musicfolder-support/
   ```

---

## Connect it to your iOS app

Add a "Report an Issue" row in your app's Settings screen. In SwiftUI:

```swift
Link(destination: URL(string: "https://YOUR-USERNAME.github.io/musicfolder-support/")!) {
    HStack {
        Image(systemName: "exclamationmark.bubble")
        Text("Report an Issue")
    }
}
```

Or open inside the app using `SFSafariViewController` so users don't leave Music Folder:

```swift
import SafariServices

let url = URL(string: "https://YOUR-USERNAME.github.io/musicfolder-support/")!
let safari = SFSafariViewController(url: url)
present(safari, animated: true)
```

---

## Customizing

| What | Where |
|------|-------|
| Recipient email | `script.js` — `const RECIPIENT` at the top |
| Brand colors | `style.css` — `:root { --orange... }` |
| Form fields | `index.html` — then add them to the email body in `script.js` |
| FAQ items | `index.html` — `<details>` blocks at the bottom |
| App icon | Replace `icon.png` (square, any size) |

---

## How the mailto approach works

When users hit Submit:
1. Form values are validated
2. JavaScript builds a nicely formatted email body and subject line
3. `window.location.href` is set to a `mailto:` link with everything URL-encoded
4. Their default email app opens (Mail on iOS, Gmail, Outlook, etc.) with all fields populated
5. They review, attach any screenshots, and hit Send
6. You receive a clean report at musicfolder.app@gmail.com — reply directly

**Pros:** Zero infrastructure, free forever, replies go straight from your inbox.
**Cons:** No automatic file uploads (users attach in their mail app). Falls back to FAQ note if no email app is configured.

If you ever outgrow this, swap `script.js` for a Formspree, Cloudflare Worker, or GitHub Issues backend — the form HTML stays the same.

---

Built with care for Music Folder: Sheet Music · musicfolder.app@gmail.com
