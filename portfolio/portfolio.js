"use strict";

document.documentElement.classList.add("js");

const viewer = document.querySelector("#scan-stage");
const caption = document.querySelector("#view-caption");
const viewOptions = document.querySelectorAll("[data-view]");

function changeView(mode) {
  viewer.dataset.mode = mode;
  caption.textContent = mode === "scan" ? "Original scan detail" : "Illustrative overlay";
  for (const option of viewOptions) {
    option.setAttribute("aria-pressed", String(option.dataset.view === mode));
  }
}

for (const option of viewOptions) {
  option.addEventListener("click", () => changeView(option.dataset.view));
}

const filters = document.querySelectorAll("[data-filter]");
const papers = document.querySelectorAll(".papers li");
const resultStatus = document.querySelector("#filter-status");

for (const filter of filters) {
  filter.addEventListener("click", () => {
    const kind = filter.dataset.filter;
    let count = 0;
    for (const paper of papers) {
      paper.hidden = kind !== "all" && paper.dataset.kind !== kind;
      if (!paper.hidden) count++;
    }
    for (const option of filters) {
      option.setAttribute("aria-pressed", String(option === filter));
    }
    resultStatus.textContent = count + (count === 1 ? " publication shown." : " publications shown.");
  });
}

const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
const navAnchors = Array.from(nav.querySelectorAll('a[href^="#"]'));

function setMenu(open) {
  menu.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
}

menu.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("is-open")) {
    setMenu(false);
    menu.focus();
  }
});

const sections = navAnchors.map((anchor) => document.querySelector(anchor.hash));
const header = document.querySelector(".site-header");
function markCurrentSection() {
  const threshold = header.offsetHeight + Math.min(170, window.innerHeight * 0.2);
  let active = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= threshold) active = section;
  }
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
    active = sections[sections.length - 1];
  }
  for (const anchor of navAnchors) {
    if (anchor.hash === "#" + active.id) anchor.setAttribute("aria-current", "location");
    else anchor.removeAttribute("aria-current");
  }
}
let frameRequested = false;
function scheduleSectionUpdate() {
  if (frameRequested) return;
  frameRequested = true;
  requestAnimationFrame(() => {
    markCurrentSection();
    frameRequested = false;
  });
}
window.addEventListener("scroll", scheduleSectionUpdate, { passive: true });
window.addEventListener("resize", scheduleSectionUpdate);
window.addEventListener("hashchange", scheduleSectionUpdate);
markCurrentSection();
