(() => {
  "use strict";
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
  };

  /* ---------- year ---------- */
  const yearEl = $("#year"); if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- toasts ---------- */
  const toastRegion = $("#toastRegion");
  function toast(message) {
    if (!toastRegion) return;
    const el = document.createElement("div"); el.className = "toast"; el.setAttribute("role", "status");
    el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m5 12 5 5L20 7"/></svg><span></span>';
    el.lastChild.textContent = message; toastRegion.appendChild(el);
    setTimeout(() => { el.classList.add("is-leaving"); setTimeout(() => el.remove(), 260); }, 3000);
  }
  $$("[data-toast]").forEach((el) => el.addEventListener("click", () => toast(el.getAttribute("data-toast"))));

  /* ---------- copy ---------- */
  $$("[data-copy]").forEach((btn) => btn.addEventListener("click", async (ev) => {
    ev.preventDefault();
    const text = btn.getAttribute("data-copy");
    try { await navigator.clipboard.writeText(text); }
    catch { const ta = document.createElement("textarea"); ta.value = text; ta.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch { /* ignore */ } ta.remove(); }
  }, { capture: true }));

  /* ---------- Who's watching? profiles ---------- */
  const DEFAULT_ORDER = ["hero", "streaming", "story", "skills", "how", "cases", "seasons", "feature", "awards", "contact"];
  const PROFILES = {
    recruiter: { name: "Recruiter", av: "av-accent", note: "Resume · 2 pages · PDF", rowTitle: "Top Picks for Recruiters",
      cta: { text: "Download Resume", href: "assets/Aman_Parate_Resume.pdf", download: true },
      order: ["hero", "streaming", "awards", "seasons", "story", "cases", "how", "skills", "feature", "contact"] },
    manager: { name: "Hiring Manager", av: "av-violet", note: "3 case files · architecture included", rowTitle: "Top Picks for Hiring Managers",
      cta: { text: "View Case Files", href: "#cases" },
      order: ["hero", "streaming", "cases", "how", "seasons", "story", "skills", "feature", "awards", "contact"] },
    developer: { name: "Developer", av: "av-green", note: "Open source · MIT · 2,000+ downloads", rowTitle: "Top Picks for Developers",
      cta: { text: "Apex Doctor on GitHub", href: "https://github.com/amanparate/apex-doctor", external: true },
      order: ["hero", "streaming", "feature", "skills", "cases", "how", "story", "seasons", "awards", "contact"] },
    guest: { name: "Just browsing", av: "av-grey", note: "13× Certified · Triple Star Ranger", rowTitle: "Start Here",
      cta: { text: "Read My Story", href: "#story" }, order: DEFAULT_ORDER },
  };
  const PROFILE_KEY = "portfolio-profile";
  const overlay = $("#profiles");

  function applyProfile(key) {
    const p = PROFILES[key] || PROFILES.guest;
    document.body.dataset.profile = key;
    // order episodes
    p.order.forEach((id, i) => { const el = $(`[data-ep="${id}"]`); if (el) el.style.order = String(i); });
    const footer = $(".site-footer"); if (footer) footer.style.order = "99";
    // hero CTA + match + row title
    const cta = $("#heroPrimary");
    if (cta) {
      cta.innerHTML = `<span class="ico">▶</span> ${p.cta.text}`;
      cta.setAttribute("href", p.cta.href);
      if (p.cta.download) cta.setAttribute("download", ""); else cta.removeAttribute("download");
      if (p.cta.external) { cta.setAttribute("target", "_blank"); cta.setAttribute("rel", "noopener"); } else { cta.removeAttribute("target"); cta.removeAttribute("rel"); }
    }
    const note = $("#posterNote"); if (note) note.textContent = p.note;
    const rt = $("#rowTitle"); if (rt) rt.textContent = p.rowTitle;
    // chip
    const chipAv = $("#chipAvatar"), chipName = $("#chipName");
    if (chipAv) {
      chipAv.className = `profile-avatar ${p.av}`;
      const src = $(`.profile[data-profile="${key}"] .profile-avatar svg`);
      chipAv.innerHTML = src ? src.outerHTML : "";
    }
    if (chipName) chipName.textContent = p.name;
  }
  function showOverlay() { if (!overlay) return; overlay.hidden = false; overlay.classList.remove("is-leaving"); document.body.classList.add("locked"); $(".profile", overlay)?.focus(); }
  function hideOverlay() { if (!overlay) return; overlay.classList.add("is-leaving"); document.body.classList.remove("locked"); setTimeout(() => { overlay.hidden = true; }, 450); }

  $$(".profile", overlay || document).forEach((btn) => btn.addEventListener("click", () => {
    const key = btn.dataset.profile; store.set(PROFILE_KEY, key); applyProfile(key); hideOverlay();
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }));
  $("#switchProfile")?.addEventListener("click", showOverlay);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && overlay && !overlay.hidden && store.get(PROFILE_KEY)) hideOverlay(); });

  const saved = store.get(PROFILE_KEY);
  if (saved && PROFILES[saved]) { applyProfile(saved); if (overlay) overlay.hidden = true; }
  else { applyProfile("guest"); showOverlay(); }

  /* ---------- top bar ---------- */
  const topbar = $("#topbar");
  const onScroll = () => topbar?.classList.toggle("scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const navToggle = $("#navToggle"), topnav = $("#topnav");
  navToggle?.addEventListener("click", () => { const open = topnav.classList.toggle("open"); navToggle.setAttribute("aria-expanded", String(open)); });
  $$("a", topnav || document.createElement("div")).forEach((a) => a.addEventListener("click", () => { topnav.classList.remove("open"); navToggle?.setAttribute("aria-expanded", "false"); }));

  /* ---------- scroll-spy ---------- */
  const navLinks = $$("#topnav a");
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const link = navLinks.find((a) => a.getAttribute("href") === `#${e.target.id}`);
        if (!link) return;
        navLinks.forEach((a) => a.classList.remove("active")); link.classList.add("active");
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    $$("main section[id]").forEach((s) => spy.observe(s));
  }

  /* ---------- reveal on scroll ---------- */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const ro = new IntersectionObserver((entries, obs) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in-view"); obs.unobserve(e.target); } }), { threshold: 0.08 });
    reveals.forEach((el) => ro.observe(el));
  } else reveals.forEach((el) => el.classList.add("in-view"));

  /* ---------- streaming row ---------- */
  const scroller = $("#rowScroller");
  $$(".row-nav button").forEach((b) => b.addEventListener("click", () => {
    const card = $(".ep-card", scroller); const step = card ? card.getBoundingClientRect().width + 14 : 300;
    scroller?.scrollBy({ left: Number(b.dataset.dir) * step * 2, behavior: "smooth" });
  }));
  $$(".ep-card[data-tab]").forEach((card) => card.addEventListener("click", () => {
    const tab = document.getElementById(card.dataset.tab); if (tab) setTimeout(() => tab.click(), 50);
  }));

  /* ---------- case-study tabs ---------- */
  $$(".tabs").forEach((tablist) => {
    const tabs = $$('[role="tab"]', tablist);
    const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));
    const activate = (i) => tabs.forEach((t, k) => {
      const on = k === i; t.classList.toggle("is-active", on); t.setAttribute("aria-selected", String(on)); t.setAttribute("tabindex", on ? "0" : "-1");
      if (panels[k]) { panels[k].hidden = !on; panels[k].classList.toggle("is-active", on); }
    });
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => activate(i));
      t.addEventListener("keydown", (e) => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); const n = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length; activate(n); tabs[n].focus(); } });
    });
  });

  /* ---------- 3D skills carousel ---------- */
  const stage = $("#carouselStage");
  if (stage) {
    const cards = $$(".car-card", stage); const n = cards.length; const step = 360 / n;
    let radius = 440;
    const setRadius = () => { radius = window.innerWidth <= 860 ? 210 : 440; render(); };

    const dots = $("#carouselDots");
    cards.forEach((_, i) => { const d = document.createElement("span"); d.dataset.i = String(i); dots?.appendChild(d); });
    let rot = 0, idx = 0, timer = null, paused = false;
    // Each card sits on a ring (rotateY(a) translateZ(r)) and is counter-rotated (rotateY(-a))
    // so it always faces the viewer; perspective makes the front card large and the back cards small.
    const render = () => {
      cards.forEach((c, i) => {
        const a = i * step + rot;
        const norm = ((a % 360) + 360) % 360; const dist = Math.min(norm, 360 - norm); // 0 = front, 180 = back
        c.style.transform = `rotateY(${a}deg) translateZ(${radius}px) rotateY(${-a}deg)`;
        c.style.setProperty("--dim", (dist / 180 * 0.72).toFixed(3));
        c.classList.toggle("is-front", i === idx);
        c.setAttribute("aria-hidden", i === idx ? "false" : "true");
      });
      $$("span", dots).forEach((d, i) => d.classList.toggle("is-active", i === idx));
    };
    setRadius(); window.addEventListener("resize", setRadius);
    const go = (dir) => { rot -= dir * step; idx = (idx + dir + n) % n; render(); };
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = () => { stop(); if (reduceMotion) return; timer = setInterval(() => { if (!paused && !document.hidden) go(1); }, 3800); };
    const stop = () => { if (timer) clearInterval(timer); timer = null; };
    $("#carNext")?.addEventListener("click", () => { go(1); start(); });
    $("#carPrev")?.addEventListener("click", () => { go(-1); start(); });
    $$("span", dots).forEach((d) => d.addEventListener("click", () => { const target = Number(d.dataset.i); const diff = (target - idx + n) % n; for (let k = 0; k < diff; k++) go(1); start(); }));
    const wrap = $("#carousel");
    wrap?.addEventListener("mouseenter", () => { paused = true; });
    wrap?.addEventListener("mouseleave", () => { paused = false; });
    // drag / swipe
    let dragX = null, dragged = false;
    wrap?.addEventListener("pointerdown", (e) => { dragX = e.clientX; dragged = false; paused = true; });
    wrap?.addEventListener("pointerup", (e) => { if (dragX === null) return; const dx = e.clientX - dragX; if (Math.abs(dx) > 40) { dragged = true; go(dx < 0 ? 1 : -1); } dragX = null; paused = false; start(); });
    wrap?.addEventListener("pointercancel", () => { dragX = null; paused = false; });
    // click a side card to bring it to the front
    cards.forEach((c, i) => c.addEventListener("click", () => {
      if (dragged || i === idx) return;
      const fwd = (i - idx + n) % n, back = (idx - i + n) % n;
      if (fwd <= back) for (let k = 0; k < fwd; k++) go(1); else for (let k = 0; k < back; k++) go(-1);
      start();
    }));
    render(); start();
  }

  /* ---------- optional images: load if present ---------- */
  function probeImage(base, onFound, exts) {
    let i = 0; const tryNext = () => { if (i >= exts.length) return; const probe = new Image(); probe.onload = () => onFound(probe.src); probe.onerror = () => { i += 1; tryNext(); }; probe.src = `${base}.${exts[i]}`; }; tryNext();
  }
  (function loadAppLogo() {
    const img = $("#appLogo"), box = $("#appIcon"); if (!img || !box) return;
    probeImage("assets/ApexDoctorLogo", (src) => { img.src = src; img.hidden = false; box.classList.add("has-logo"); }, ["jpg", "png", "svg", "jpeg", "webp"]);
  })();

  /* ---------- gallery + lightbox ---------- */
  const gMain = $("#galleryMain"), gCap = $("#galleryCaption");
  $$(".thumb").forEach((btn) => btn.addEventListener("click", () => {
    if (!gMain) return; gMain.src = btn.dataset.src; gMain.alt = btn.dataset.alt || ""; if (gCap) gCap.innerHTML = btn.dataset.caption || "";
    $$(".thumb").forEach((b) => b.classList.toggle("is-active", b === btn));
  }));
  const lb = $("#lightbox"), lbImg = $("#lightboxImg"), lbCap = $("#lightboxCap");
  const openLightbox = () => { if (!lb || !gMain) return; lbImg.src = gMain.src; lbImg.alt = gMain.alt; lbCap.textContent = gCap ? gCap.textContent : ""; lb.hidden = false; document.body.classList.add("locked"); $("#lightboxClose")?.focus(); };
  const closeLightbox = () => { if (!lb) return; lb.hidden = true; document.body.classList.remove("locked"); $("#shotOpen")?.focus(); };
  $("#shotOpen")?.addEventListener("click", openLightbox);
  $("#lightboxClose")?.addEventListener("click", (e) => { e.stopPropagation(); closeLightbox(); });
  lb?.addEventListener("click", (e) => { if (e.target !== lbImg) closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && lb && !lb.hidden) closeLightbox(); });

  /* ---------- live GitHub data ---------- */
  const REPO = "amanparate/apex-doctor";
  const relTime = (iso) => { if (!iso) return "—"; const d = (Date.now() - new Date(iso).getTime()) / 864e5; if (d < 1) return "today"; if (d < 2) return "yesterday"; if (d < 30) return `${Math.floor(d)} days ago`; if (d < 365) return `${Math.floor(d / 30)} mo ago`; return `${(d / 365).toFixed(1)} yrs ago`; };
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "—";
  const setText = (id, v) => { const el = document.getElementById(id); if (el && v !== undefined && v !== null) el.textContent = v; };
  (async function loadGitHub() {
    if (!$("#ghRelease")) return;
    const get = (u) => fetch(u, { headers: { Accept: "application/vnd.github+json" } }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    const [repo, releases] = await Promise.all([get(`https://api.github.com/repos/${REPO}`), get(`https://api.github.com/repos/${REPO}/releases?per_page=100`)]);
    if (!repo && !releases) { setText("ghNote", "Adopted internally at Tarana before public release · live GitHub stats unavailable right now."); return; }
    if (repo) { setText("ghPushed", relTime(repo.pushed_at)); setText("ghIssues", String(repo.open_issues_count ?? "—")); }
    if (Array.isArray(releases) && releases.length) { const latest = releases.find((r) => !r.prerelease && !r.draft) || releases[0]; setText("ghRelease", latest.tag_name); setText("ghReleaseDate", fmtDate(latest.published_at)); setText("ghReleases", String(releases.length)); setText("nowRelease", `(${latest.tag_name})`); }
    setText("ghNote", `Adopted internally at Tarana before public release · live stats from the GitHub API, updated ${new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`);
  })();

  /* ---------- Trailhead & community ---------- */
  const TRAILHEAD = {
    profileUrl: "https://www.salesforce.com/trailblazer/amanparate",
    rank: "Triple Star Ranger", badges: 423, points: 194000, trails: 43, agentblazer: "Champion 2026",
    superbadges: ["Apex Specialist", "Lightning Web Components Specialist", "Data Integration Specialist", "Process Automation Specialist", "Object Relationships", "Access Governance", "User Access Specialist", "User Access Fundamentals", "User Access Troubleshooting", "Extended User Access and Restriction"],
  };
  const COMMUNITY = []; // { type: "Talk", title: "...", meta: "...", url: "https://..." }
  (function renderTrailhead() {
    const card = $("#trailhead"); if (!card) return;
    if (!TRAILHEAD.profileUrl && !COMMUNITY.length) return;
    card.hidden = false;
    const link = $("#thProfileLink"); if (TRAILHEAD.profileUrl) link.href = TRAILHEAD.profileUrl; else link.hidden = true;
    const stats = $("#thStats");
    const stat = (k, v) => { if (v === null || v === undefined || v === "") return; const d = document.createElement("div"); const dt = document.createElement("dt"); const dd = document.createElement("dd"); dt.textContent = k; dd.textContent = typeof v === "number" ? v.toLocaleString() : v; d.append(dt, dd); stats.appendChild(d); };
    stat("Rank", TRAILHEAD.rank); stat("Badges", TRAILHEAD.badges); stat("Points", TRAILHEAD.points); stat("Trails", TRAILHEAD.trails); stat("Superbadges", TRAILHEAD.superbadges.length || null); stat("Agentblazer", TRAILHEAD.agentblazer);
    const sb = $("#thSuperbadges"); TRAILHEAD.superbadges.forEach((name) => { const s = document.createElement("span"); s.className = "badge badge-brand"; s.textContent = name; sb.appendChild(s); });
    const list = $("#communityList"); COMMUNITY.forEach((c) => { const li = document.createElement("li"); const type = document.createElement("span"); type.className = "c-type"; type.textContent = c.type; const title = document.createElement(c.url ? "a" : "span"); title.textContent = c.title; if (c.url) { title.href = c.url; title.target = "_blank"; title.rel = "noopener"; } const meta = document.createElement("span"); meta.className = "c-meta"; meta.textContent = c.meta || ""; li.append(type, title, meta); list.appendChild(li); });
  })();
})();
