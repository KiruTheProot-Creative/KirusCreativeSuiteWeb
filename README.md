# Kiru's Creative Studio

The website for Kiru's Creative Studio: open source programs, VST plugins, sample packs and UI packs.

Plain HTML, CSS and JavaScript, no build step. The look is a Windows 98 desktop built with
[98.css](https://github.com/jdan/98.css): every section is a window, with a taskbar, a working
Start menu and a clock. The minimize button on a window collapses it.

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
    linkLabel: "View on GitHub"  // optional, swaps the DOWNLOAD image for a text button
  }
],
```

Each entry shows up as a group box inside its folder window. Empty folders show
"This folder is empty." and the status bar counts the objects.

## Colors

98.css normally has navy title bars. This site swaps them for crimson with two variables at the
top of `styles.css` (`--dialog-blue` and `--dialog-blue-light`). Delete those two lines for the
classic navy look.

## Hosting

Works on GitHub Pages as-is: Settings → Pages → deploy from the `main` branch, root folder.

## Layout

- `index.html`: page structure (windows, taskbar, Start menu)
- `styles.css`: desktop, taskbar and layout on top of 98.css
- `script.js`: the catalog, window minimize, Start menu, clock
- `vendor/98css/`: 98.css v0.1.21 (MIT, see its `LICENSE`), with its icons inlined
- `assets/`: logo, title images, banner and wallpaper
