/*
  Add your stuff here! Each category is a list of items:

  {
    title: "My Cool Thing",
    description: "One short sentence about it.",
    tags: ["free", "v1.0"],          // optional
    link: "https://github.com/...",  // where the DOWNLOAD button goes
    linkLabel: "View on GitHub"      // optional: replaces the DOWNLOAD image with a text button
  }
*/
const CATALOG = {
  programs: [],
  vst: [],
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

function renderCard(item) {
  const card = el("article", { class: "card" }, [el("h3", { text: item.title })]);
  if (item.description) card.append(el("p", { text: item.description }));
  if (item.tags && item.tags.length) {
    card.append(el("div", { class: "tags" }, item.tags.map((t) => el("span", { text: t }))));
  }
  if (item.link) {
    if (item.linkLabel) {
      // custom label -> plain text button
      card.append(
        el("a", { class: "btn", href: item.link, target: "_blank", rel: "noopener", text: item.linkLabel })
      );
    } else {
      // default -> the DOWNLOAD image button
      card.append(
        el("a", { class: "dl", href: item.link, target: "_blank", rel: "noopener", "aria-label": "Download " + item.title }, [
          el("img", { src: "assets/btn-download.png", alt: "Download", width: "800", height: "116" }),
        ])
      );
    }
  }
  return card;
}

function renderCatalog() {
  document.querySelectorAll(".grid[data-category]").forEach((grid) => {
    const key = grid.dataset.category;
    const items = CATALOG[key] || [];
    if (!items.length) {
      grid.append(
        el("div", { class: "empty" }, [
          el("strong", { text: "Nothing here yet" }),
          el("span", { text: EMPTY_TEXT[key] || "Coming soon~" }),
        ])
      );
      return;
    }
    items.forEach((item) => grid.append(renderCard(item)));
  });
}

// highlight the nav link of the section you're looking at
function setupNavHighlight() {
  const links = [...document.querySelectorAll(".topbar nav a")];
  const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = byId.get(entry.target.id);
        if (link && entry.isIntersecting) {
          links.forEach((a) => a.classList.remove("active"));
          link.classList.add("active");
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
setupNavHighlight();
