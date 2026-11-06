# Kiru's Creative Studio

The website for Kiru's Creative Studio: open source programs, VST plugins, sample packs and UI packs.

Plain HTML, CSS and JavaScript, no build step.

## Run it locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Adding programs, VST plugins, sample packs or UI packs

Open `script.js` and add entries to the `CATALOG` object at the top
(categories: `programs`, `vst`, `samples`, `ui`):

```js
programs: [
  {
    title: "My Cool Thing",
    description: "One short sentence about it.",
    tags: ["free", "v1.0"],
    link: "https://github.com/KiruTheProot-Creative/...",
    linkLabel: "Get it"
  }
],
```

Empty categories show a "coming soon" card automatically.

## Hosting

Works on GitHub Pages as-is: Settings → Pages → deploy from the `main` branch, root folder.

## Layout

- `index.html`: page structure
- `styles.css`: styling
- `script.js`: the catalog and small interactions
- `assets/`: logo, title images, frame and background
