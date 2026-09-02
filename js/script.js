(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- footer year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- theme toggle ---------- */
  const THEME_KEY = "portfolio-theme";
  const root = document.documentElement;

  const applyTheme = (t) => (t === "dark" || t === "light") ? root.setAttribute("data-theme", t) : root.removeAttribute("data-theme");
  const readTheme = () => { try { return localStorage.getItem(THEME_KEY); } catch { return null; } };
  const saveTheme = (t) => { try { localStorage.setItem(THEME_KEY, t); } catch { /* ignore */ } };

  applyTheme(readTheme());
  $("#themeToggle")?.addEventListener("click", () => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const current = root.getAttribute("data-theme") || (prefersDark ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next); saveTheme(next);
  });

  /* ---------- mobile nav ---------- */
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    $$("a", navLinks).forEach((a) => a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }));
  }

  /* ---------- scroll-spy for app tabs ---------- */
  const sections = $$("main section[id]");
  const tabs = $$(".nav-link");
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const link = tabs.find((a) => a.getAttribute("href") === `#${e.target.id}`);
        if (!link) return;
        tabs.forEach((a) => a.classList.remove("active"));
        link.classList.add("active");
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- toasts ---------- */
  const toastRegion = $("#toastRegion");
  function toast(message) {
    if (!toastRegion) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m5 12 5 5L20 7"/></svg>' +
      "<span></span>";
    el.lastChild.textContent = message;
    toastRegion.appendChild(el);
    setTimeout(() => {
      el.classList.add("is-leaving");
      setTimeout(() => el.remove(), 260);
    }, 3200);
  }

  $$("[data-toast]").forEach((el) => {
    el.addEventListener("click", () => toast(el.getAttribute("data-toast")));
  });

  /* ---------- copy-to-clipboard ---------- */
  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async (ev) => {
      ev.preventDefault();
      const text = btn.getAttribute("data-copy");
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Fallback for older browsers
        const ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch { /* ignore */ }
        ta.remove();
      }
    }, { capture: true });
  });

  /* ---------- career path ---------- */
  const monthsBetween = (from, to) =>
    (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth()) + 1;
  const fmtDuration = (months) => {
    const y = Math.floor(months / 12), m = months % 12;
    const parts = [];
    if (y) parts.push(`${y} yr${y > 1 ? "s" : ""}`);
    if (m) parts.push(`${m} mo${m > 1 ? "s" : ""}`);
    return parts.join(" ") || "< 1 mo";
  };
  const now = new Date();

  const STAGES = [
    {
      fields: {
        Role: "Programmer Analyst",
        Company: "Cognizant Technology Solutions",
        Duration: `Nov 2021 – Feb 2023 · ${fmtDuration(16)}`,
        Location: "Pune, India",
      },
      guidance: "Built Salesforce solutions for US retail clients — a Case Management System in LWC and Apex, core admin configuration, automation with Flows and Process Builder, IVR and batch Apex, and metadata migrations with Change Sets and Workbench.",
      link: "#experience", linkText: "View Details",
    },
    {
      fields: {
        Role: "Service Cloud Engineer",
        Company: "Salesforce",
        Duration: `Mar 2023 – Dec 2024 · ${fmtDuration(22)}`,
        Location: "Hyderabad, India",
      },
      guidance: "Delivered Service Cloud solutions for UK and US clients — SSO and MFA, Flows, Apex and async Apex, LWC for communities, and integrations across REST, SOAP, Bulk API, Platform Events and Change Data Capture.",
      link: "#experience", linkText: "View Details",
    },
    {
      fields: {
        Role: "Senior Salesforce Developer",
        Company: "Tarana Wireless",
        Duration: `Jan 2025 – Present · ${fmtDuration(monthsBetween(new Date(2025, 0, 1), now))}`,
        Location: "Pune, India",
      },
      guidance: "Owning the Experience Cloud customer journey end to end — onboarding, a rebuilt Case dashboard in LWC, SSO with LearnUpon — plus usage-based US billing on Chargent (~$3M last quarter), Kafka and EDI integrations, and the Boomi → NetSuite ERP integration now in progress.",
      link: "#experience", linkText: "View Details",
    },
    {
      fields: {
        Role: "Tech Lead / Salesforce Architect",
        Company: "Your team",
        Availability: "Open to conversations",
        Location: "Pune · open to international relocation & visa sponsorship",
      },
      guidance: "Looking for a team building serious things on the platform — Experience Cloud, complex integrations, or developer tooling. If that sounds like you, let's talk.",
      link: "#contact", linkText: "Get in Touch",
    },
  ];

  const pathEl = $("#careerPath");
  const pathFields = $("#pathFields");
  const pathGuidance = $("#pathGuidance");
  const pathLink = $("#pathLink");

  function renderStage(i) {
    const s = STAGES[i];
    if (!s || !pathFields) return;
    pathFields.innerHTML = "";
    Object.entries(s.fields).forEach(([k, v]) => {
      const dt = document.createElement("dt"); dt.textContent = k;
      const dd = document.createElement("dd"); dd.textContent = v;
      pathFields.append(dt, dd);
    });
    pathGuidance.textContent = s.guidance;
    pathLink.setAttribute("href", s.link);
    pathLink.textContent = s.linkText;
    $$(".path-stage", pathEl).forEach((li) => {
      const active = Number(li.dataset.stage) === i;
      li.classList.toggle("is-active", active);
      li.setAttribute("aria-selected", String(active));
    });
  }

  if (pathEl) {
    $$(".path-stage", pathEl).forEach((li) => {
      li.addEventListener("click", () => renderStage(Number(li.dataset.stage)));
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); renderStage(Number(li.dataset.stage)); }
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          const dir = e.key === "ArrowRight" ? 1 : -1;
          const next = (Number(li.dataset.stage) + dir + STAGES.length) % STAGES.length;
          $(`.path-stage[data-stage="${next}"]`, pathEl)?.focus();
          renderStage(next);
        }
      });
    });
    renderStage(2); // current role by default
  }

  /* ---------- experience timeline ---------- */
  const tlItems = $$(".tl-item");
  const toggleAll = $("#toggleAllExp");

  function setItem(item, open) {
    item.classList.toggle("is-open", open);
    $(".tl-toggle", item)?.setAttribute("aria-expanded", String(open));
  }
  function refreshToggleAllLabel() {
    if (!toggleAll) return;
    const allOpen = tlItems.every((i) => i.classList.contains("is-open"));
    toggleAll.textContent = allOpen ? "Collapse All" : "Expand All";
  }
  tlItems.forEach((item) => {
    $(".tl-toggle", item)?.addEventListener("click", () => {
      setItem(item, !item.classList.contains("is-open"));
      refreshToggleAllLabel();
    });
  });
  toggleAll?.addEventListener("click", () => {
    const allOpen = tlItems.every((i) => i.classList.contains("is-open"));
    tlItems.forEach((i) => setItem(i, !allOpen));
    refreshToggleAllLabel();
  });

  /* ---------- global search ---------- */
  const input = $("#searchInput");
  const results = $("#searchResults");

  function buildIndex() {
    const idx = [];
    const push = (type, label, target, extra = "") => idx.push({ type, label, target, hay: `${label} ${extra}`.toLowerCase() });

    // Sections
    [["about", "My Story"], ["how-i-work", "How I Work"], ["case-studies", "Case Studies"], ["skills", "Skills"],
     ["certifications", "Certifications"], ["experience", "Work Experience"], ["projects", "Projects"], ["contact", "Contact"]]
      .forEach(([id, label]) => { const el = document.getElementById(id); if (el) push("Section", label, el); });

    // Case studies (selecting one activates its tab)
    $$("#case-studies .tab").forEach((tab) => {
      const panel = document.getElementById(tab.getAttribute("aria-controls"));
      const title = panel ? $(".cs-title", panel)?.textContent.trim() : tab.textContent.trim();
      push("Case Study", title, tab, $(".cs-meta", panel)?.textContent);
    });

    // Skills (pills inside skills card)
    $$('[data-search-group="Skill"] .pill').forEach((p) => push("Skill", p.textContent.trim(), p));
    // Certifications
    $$('[data-search-group="Certification"] .cert').forEach((c) => push("Certification", $(".cert-name", c).textContent.trim(), c, $(".hex", c)?.textContent));
    // Roles
    $$(".tl-item").forEach((t) => push("Role", $(".tl-role", t).textContent.trim(), t, $(".tl-org", t)?.textContent));
    // Project
    const proj = $("#projects .project-title"); if (proj) push("Project", proj.textContent.trim(), $("#projects"), "apex doctor vs code extension debug log");
    // Handy actions
    const resumeBtn = $(".record-actions .btn-brand"); if (resumeBtn) push("Action", "Download Resume (PDF)", resumeBtn, "cv resume pdf");
    const email = $("#emailLink"); if (email) push("Action", "Email Aman", email, "mail contact reach");
    return idx;
  }

  const INDEX = buildIndex();
  let focused = -1;
  let current = [];

  function closeResults() {
    if (!results) return;
    results.hidden = true; results.innerHTML = ""; focused = -1; current = [];
    input?.setAttribute("aria-expanded", "false");
  }

  function renderResults(items) {
    results.innerHTML = "";
    current = items;
    if (!items.length) {
      const li = document.createElement("li"); li.className = "sr-empty"; li.textContent = "No results. Try “Apex”, “Boomi”, or “Data Cloud”.";
      results.appendChild(li);
    } else {
      items.forEach((it, i) => {
        const li = document.createElement("li");
        li.setAttribute("role", "option"); li.dataset.i = String(i);
        const type = document.createElement("span"); type.className = "sr-type"; type.textContent = it.type;
        const label = document.createElement("span"); label.textContent = it.label;
        li.append(type, label);
        li.addEventListener("mousedown", (e) => { e.preventDefault(); go(it); });
        results.appendChild(li);
      });
    }
    results.hidden = false;
    input.setAttribute("aria-expanded", "true");
  }

  function go(item) {
    closeResults();
    input.blur();
    const t = item.target;
    // Open the timeline item if it's a role; activate the tab if it's a case study
    if (t.classList.contains("tl-item")) setItem(t, true), refreshToggleAllLabel();
    if (t.classList.contains("tab")) t.click();
    const headerOffset = 50 + 44 + 16;
    const y = t.getBoundingClientRect().top + window.scrollY - headerOffset - (item.type === "Section" ? 0 : 80);
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    if (item.type !== "Section") {
      const flashTarget = t.classList.contains("pill") ? t : t;
      flashTarget.classList.add("flash");
      setTimeout(() => flashTarget.classList.remove("flash"), 1300);
    }
    if (item.type === "Action") setTimeout(() => t.focus(), 400);
  }

  if (input && results) {
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      if (!q) return closeResults();
      const hits = INDEX.filter((it) => it.hay.includes(q))
        .sort((a, b) => a.hay.indexOf(q) - b.hay.indexOf(q))
        .slice(0, 8);
      renderResults(hits);
    });
    input.addEventListener("keydown", (e) => {
      if (results.hidden) return;
      const opts = $$("li[role=option]", results);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        focused = (focused + (e.key === "ArrowDown" ? 1 : -1) + opts.length) % opts.length;
        opts.forEach((o, i) => o.classList.toggle("is-focused", i === focused));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const pick = current[focused >= 0 ? focused : 0];
        if (pick) go(pick);
      } else if (e.key === "Escape") {
        closeResults();
      }
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#globalSearch")) closeResults();
    });
    // "/" focuses search, like many apps
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && !/input|textarea/i.test(document.activeElement?.tagName || "")) {
        e.preventDefault(); input.focus();
      }
    });
  }

  /* ---------- case-study tabs (SLDS tabs) ---------- */
  $$(".tabs").forEach((tablist) => {
    const tabs = $$('[role="tab"]', tablist);
    const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));
    function activate(i) {
      tabs.forEach((t, k) => {
        const on = k === i;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", String(on));
        t.setAttribute("tabindex", on ? "0" : "-1");
        if (panels[k]) { panels[k].hidden = !on; panels[k].classList.toggle("is-active", on); }
      });
    }
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => activate(i));
      t.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          const n = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
          activate(n); tabs[n].focus();
        }
      });
    });
  });

  /* ---------- project gallery ---------- */
  const gMain = $("#galleryMain"), gCap = $("#galleryCaption");
  $$(".thumb").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!gMain) return;
      gMain.src = btn.dataset.src;
      gMain.alt = btn.dataset.alt || "";
      if (gCap) gCap.innerHTML = btn.dataset.caption || "";
      $$(".thumb").forEach((b) => b.classList.toggle("is-active", b === btn));
    });
  });

  /* ---------- Apex Doctor logo (assets/ApexDoctorLogo.<ext>, falls back to drawn icon) ---------- */
  (function loadAppLogo() {
    const img = $("#appLogo"), box = $("#appIcon");
    if (!img || !box) return;
    const candidates = ["png", "svg", "jpg", "jpeg", "webp", "PNG", "JPG"].map((e) => `assets/ApexDoctorLogo.${e}`);
    let i = 0;
    const tryNext = () => {
      if (i >= candidates.length) return;                 // none found → keep fallback icon
      const probe = new Image();
      probe.onload = () => { img.src = probe.src; img.hidden = false; box.classList.add("has-logo"); };
      probe.onerror = () => { i += 1; tryNext(); };
      probe.src = candidates[i];
    };
    tryNext();
  })();

  /* ---------- screenshot lightbox ---------- */
  const lb = $("#lightbox"), lbImg = $("#lightboxImg"), lbCap = $("#lightboxCap");
  function openLightbox() {
    if (!lb || !gMain) return;
    lbImg.src = gMain.src; lbImg.alt = gMain.alt; lbCap.textContent = gCap ? gCap.textContent : "";
    lb.hidden = false; document.body.style.overflow = "hidden";
    $("#lightboxClose")?.focus();
  }
  function closeLightbox() { if (!lb) return; lb.hidden = true; document.body.style.overflow = ""; $("#shotOpen")?.focus(); }
  $("#shotOpen")?.addEventListener("click", openLightbox);
  $("#lightboxClose")?.addEventListener("click", (e) => { e.stopPropagation(); closeLightbox(); });
  lb?.addEventListener("click", (e) => { if (e.target !== lbImg) closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && lb && !lb.hidden) closeLightbox(); });

  /* ---------- live GitHub data (public API, no auth) ---------- */
  const REPO = "amanparate/apex-doctor";
  const relTime = (iso) => {
    if (!iso) return "—";
    const d = (Date.now() - new Date(iso).getTime()) / 864e5;
    if (d < 1) return "today";
    if (d < 2) return "yesterday";
    if (d < 30) return `${Math.floor(d)} days ago`;
    if (d < 365) return `${Math.floor(d / 30)} mo ago`;
    return `${(d / 365).toFixed(1)} yrs ago`;
  };
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "—";
  const setText = (id, v) => { const el = document.getElementById(id); if (el && v !== undefined && v !== null) el.textContent = v; };

  async function loadGitHub() {
    if (!$("#ghRelease")) return;
    const get = (u) => fetch(u, { headers: { Accept: "application/vnd.github+json" } }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    const [repo, releases] = await Promise.all([
      get(`https://api.github.com/repos/${REPO}`),
      get(`https://api.github.com/repos/${REPO}/releases?per_page=100`),
    ]);
    if (!repo && !releases) { setText("ghNote", "Adopted internally at Tarana before public release · live GitHub stats unavailable right now (offline or rate-limited)."); return; }
    if (repo) {
      setText("ghPushed", relTime(repo.pushed_at));
      setText("ghIssues", String(repo.open_issues_count ?? "—"));
      if (repo.license?.spdx_id) setText("ghLicense", repo.license.spdx_id);
    }
    if (Array.isArray(releases) && releases.length) {
      const latest = releases.find((r) => !r.prerelease && !r.draft) || releases[0];
      setText("ghRelease", latest.tag_name);
      setText("ghReleaseDate", fmtDate(latest.published_at));
      setText("ghReleases", String(releases.length));
      setText("nowRelease", `(${latest.tag_name})`);
    }
    setText("ghNote", `Adopted internally at Tarana before public release · live stats from the GitHub API, updated ${new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`);
  }
  loadGitHub();

  /* ---------- Trailhead & community (fill these in; card stays hidden until profileUrl is set) ---------- */
  const TRAILHEAD = {
    profileUrl: "https://www.salesforce.com/trailblazer/amanparate",
    rank: "Triple Star Ranger",
    badges: 423,
    points: 194000,
    trails: 43,
    agentblazer: "Champion 2026",
    superbadges: [
      "Apex Specialist",
      "Lightning Web Components Specialist",
      "Data Integration Specialist",
      "Process Automation Specialist",
      "Object Relationships",
      "Access Governance",
      "User Access Specialist",
      "User Access Fundamentals",
      "User Access Troubleshooting",
      "Extended User Access and Restriction",
    ],
  };
  const COMMUNITY = [
    // { type: "Talk", title: "Debugging Apex at scale", meta: "Pune Salesforce Developer Group · 2026", url: "https://..." },
    // { type: "Blog", title: "Why I built Apex Doctor", meta: "Medium · 2026", url: "https://..." },
  ];

  (function renderTrailhead() {
    const card = $("#trailhead");
    if (!card) return;
    const hasTH = !!TRAILHEAD.profileUrl;
    const hasCommunity = COMMUNITY.length > 0;
    if (!hasTH && !hasCommunity) return;               // stay hidden
    card.hidden = false;
    const link = $("#thProfileLink");
    if (hasTH) link.href = TRAILHEAD.profileUrl; else link.hidden = true;

    const stats = $("#thStats");
    const stat = (k, v) => { if (v === null || v === undefined || v === "") return;
      const d = document.createElement("div"); const dt = document.createElement("dt"); const dd = document.createElement("dd");
      dt.textContent = k; dd.textContent = typeof v === "number" ? v.toLocaleString() : v; d.append(dt, dd); stats.appendChild(d); };
    if (hasTH) { stat("Rank", TRAILHEAD.rank); stat("Badges", TRAILHEAD.badges); stat("Points", TRAILHEAD.points); stat("Trails", TRAILHEAD.trails); stat("Superbadges", TRAILHEAD.superbadges.length || null); stat("Agentblazer", TRAILHEAD.agentblazer); }

    const sb = $("#thSuperbadges");
    TRAILHEAD.superbadges.forEach((name) => { const s = document.createElement("span"); s.className = "badge badge-brand"; s.textContent = name; sb.appendChild(s); });

    const list = $("#communityList");
    COMMUNITY.forEach((c) => {
      const li = document.createElement("li");
      const type = document.createElement("span"); type.className = "c-type"; type.textContent = c.type;
      const title = document.createElement(c.url ? "a" : "span"); title.textContent = c.title;
      if (c.url) { title.href = c.url; title.target = "_blank"; title.rel = "noopener"; }
      const meta = document.createElement("span"); meta.className = "c-meta"; meta.textContent = c.meta || "";
      li.append(type, title, meta); list.appendChild(li);
    });
  })();
})();
