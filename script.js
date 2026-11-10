/*
  Add your stuff here! Each category is a list of items:

  {
    title: "My Cool Thing",
    description: "One short sentence about it.",
    tags: ["free", "v1.0"],          // optional
    link: "https://github.com/...",  // where the Download button goes
    linkLabel: "View on GitHub",     // optional: changes the button text (default is "Download")

    // all of these are optional:
    featured: true,                  // makes the card span the full width
    includes: [                      // a "what's inside" list
      { name: "Thing", text: "What it does." }
    ],
    note: "A disclaimer shown in a box on the card.",
    extraLinks: [                    // more text buttons next to the main one
      { label: "GitHub", href: "https://github.com/..." }
    ]
  }
*/
const CATALOG = {
  programs: [],
  vst: [
    {
      title: "Kiru Creative Audio Suite",
      featured: true,
      description: "One installer for the whole suite: a sampler, a sample-instrument builder and a node-based FX plugin.",
      tags: ["Windows", "installer"],
      includes: [
        {
          name: "VisuPlayer + Visumaker",
          text: "The Kontakt alternative that is easier to use and faster to load.",
        },
        {
          name: "NodeFX",
          text: "An FX plugin where you build your FX out of Node Modules.",
        },
      ],
      note: "This software was coded with AI, but it is human directed and tested.",
      link: "https://github.com/KiruTheProot-Creative/VisuSampler/releases/download/build-20261110-0211/KiruCAS-Setup.exe",
      extraLinks: [
        { label: "GitHub", href: "https://github.com/KiruTheProot-Creative/VisuSampler" },
        { label: "Discord support", href: "https://discord.gg/hwqa9rxQEb" },
      ],
    },
  ],
  samples: [],
  ui: [],
};

const EMPTY_TEXT = {
  programs: "Open source programs are on their way~",
  vst: "VST plugins are on their way~",
  samples: "Sample packs are being cooked up~",
  ui: "UI packs are coming soon~",
};

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === "text") node.textContent = value;
    else node.setAttribute(key, value);
  }
  for (const child of children) node.append(child);
  return node;
}

// one catalog item = one Win98 group box
function renderCard(item) {
  const box = el("fieldset", item.featured ? { class: "featured" } : {}, [el("legend", { text: item.title })]);
  if (item.description) box.append(el("p", { text: item.description }));

  if (item.includes && item.includes.length) {
    box.append(
      el(
        "ul",
        { class: "includes" },
        item.includes.map((inc) => el("li", {}, [el("b", { text: inc.name }), document.createTextNode(": " + inc.text)]))
      )
    );
  }

  if (item.tags && item.tags.length) {
    box.append(el("div", { class: "tags" }, item.tags.map((t) => el("span", { text: t }))));
  }

  if (item.note) {
    box.append(el("p", { class: "note" }, [el("b", { text: "Disclaimer: " }), document.createTextNode(item.note)]));
  }

  const actions = el("div", { class: "actions" });
  if (item.link) {
    const props = { class: "button98", href: item.link, target: "_blank", rel: "noopener", text: item.linkLabel || "Download" };
    // screen readers get the full name when the button just says "Download"
    if (!item.linkLabel) props["aria-label"] = "Download " + item.title;
    actions.append(el("a", props));
  }
  (item.extraLinks || []).forEach((l) =>
    actions.append(el("a", { class: "button98", href: l.href, target: "_blank", rel: "noopener", text: l.label }))
  );
  if (actions.children.length) box.append(actions);
  return box;
}

function renderCatalog() {
  document.querySelectorAll(".grid[data-category]").forEach((grid) => {
    const key = grid.dataset.category;
    const items = CATALOG[key] || [];
    if (!items.length) {
      grid.append(
        el("p", { class: "empty" }, [
          el("b", { text: "This folder is empty." }),
          document.createTextNode(EMPTY_TEXT[key] || "Coming soon~"),
        ])
      );
    } else {
      items.forEach((item) => grid.append(renderCard(item)));
    }
    const counter = document.querySelector('[data-count-for="' + key + '"]');
    if (counter) counter.textContent = items.length + " object(s)";
  });
}

// minimize button collapses/expands its window
function setCollapsed(win, collapsed) {
  win.classList.toggle("collapsed", collapsed);
  const btn = win.querySelector('.title-bar-controls button[aria-label="Minimize"]');
  if (btn) btn.setAttribute("aria-expanded", String(!collapsed));
}

function setupWindows() {
  document.querySelectorAll(".win").forEach((win) => {
    const btn = win.querySelector('.title-bar-controls button[aria-label="Minimize"]');
    if (btn) btn.addEventListener("click", () => setCollapsed(win, !win.classList.contains("collapsed")));
  });

  // jumping to a minimized window (from the taskbar, Start menu or a button) restores it
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.getElementById(link.getAttribute("href").slice(1));
    if (target && target.classList.contains("win")) setCollapsed(target, false);
  });
}

// Start menu
function setupStartMenu() {
  const button = document.getElementById("start-btn");
  const menu = document.getElementById("start-menu");

  function setOpen(open) {
    menu.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
  }

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(menu.hidden);
    if (!menu.hidden) menu.querySelector("a").focus();
  });
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("click", (event) => {
    if (!menu.hidden && !menu.contains(event.target)) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) {
      setOpen(false);
      button.focus();
    }
  });
}

// taskbar clock
function setupClock() {
  const clock = document.getElementById("clock");
  const tick = () => {
    clock.textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };
  tick();
  setInterval(tick, 15000);
}

// press the taskbar button of the window you're looking at
function setupTaskbarHighlight() {
  const tasks = [...document.querySelectorAll(".task")];
  const byId = new Map(tasks.map((a) => [a.getAttribute("href").slice(1), a]));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const task = byId.get(entry.target.id);
        if (task && entry.isIntersecting) {
          tasks.forEach((a) => {
            a.classList.remove("active");
            a.removeAttribute("aria-current");
          });
          task.classList.add("active");
          task.setAttribute("aria-current", "true");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  byId.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
renderCatalog();
setupWindows();
setupStartMenu();
setupClock();
setupTaskbarHighlight();
