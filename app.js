/* ============================================================
   app.js — rendu + filtres du portfolio.
   Lit les constantes globales de data.js (PROFILE, WRITEUPS,
   PROJETS, COMPETENCES, VEILLE, CONTACT).
   ============================================================ */
(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function diffClass(d) {
    const w = String(d).toLowerCase();
    if (w.includes("difficile")) return "difficile";
    if (w.includes("facile") && w.includes("moyen")) return "moyenne";
    if (w.includes("facile")) return "facile";
    if (w.includes("moy")) return "moyenne";
    return "";
  }

  /* ---------- HERO : typewriter + tagline + status ---------- */
  const tw = $("#typewriter");
  if (tw && PROFILE.title_roles.length) {
    const roles = PROFILE.title_roles;
    let gi = 0, ci = 0, deleting = false, paus = 0;
    function tick() {
      const word = "Purple Team Analyst | " + roles[gi];
      const cur = word.slice(0, ci);
      tw.textContent = cur + (deleting ? "_" : "|");
      if (!deleting) {
        ci++;
        if (ci > word.length) { deleting = true; paus = 40; }
      } else {
        paus-- <= 0 && (ci--, deleting = ci > 0);
      }
      if (ci <= 0 && deleting) { deleting = false; gi = (gi + 1) % roles.length; }
      setTimeout(tick, ci === word.length ? 80 : 26);
    }
    tick();
  }
  const tagline = $("#tagline");
  if (tagline && PROFILE.tagline) tagline.textContent = PROFILE.tagline;

  /* ---------- STATS ---------- */
  const st = PROFILE.comptoir_stats || {};
  const statsMap = {
    statSolved: st.solved, statWriteups: st.writeups, statCtfs: st.ctfs,
  };
  Object.keys(statsMap).forEach((id) => {
    const el = document.getElementById(id);
    if (el && statsMap[id] !== undefined) el.textContent = statsMap[id];
  });
  const statE = document.getElementById("statEcowas");
  if (statE) statE.textContent = "✓";

  /* ---------- Certifications ---------- */
  const certList = $("#certList");
  if (certList && PROFILE.certifications) {
    certList.innerHTML = PROFILE.certifications.map((c) => `
      <li>
        <span class="dot ${c.status === "obtenue" ? "has" : "in"}" aria-hidden="true"></span>
        <span><strong>${esc(c.name)}</strong>
          ${c.status === "en cours" ? '<em>(en cours)</em>' : ""}</span>
      </li>`).join("");
  }

  /* ---------- Citation (à personnaliser) ---------- */
  const quote = $("#quoteBox");
  const QUOTE_TEXT = "« L'attaquant exploite une faille, l'analyste exploite une hypothèse. »";
  const QUOTE_AUTH = "Wilfrid Agbassikakou — credo Purple Team";
  if (quote) quote.innerHTML = `<p>${QUOTE_TEXT}</p><cite>${QUOTE_AUTH}</cite>`;

  /* ---------- FILTRES ---------- */
  const filters = $("#filters");
  function categories() {
    const s = new Set(["all"]);
    WRITEUPS.forEach((w) => s.add(w.category));
    return Array.from(s);
  }
  if (filters) {
    const catLabels = { all: "Tous", web: "Web", crypto: "Crypto", stego: "Stégo", ad: "AD", osint: "OSINT", soc: "SOC / Phishing" };
    filters.innerHTML = categories().map((c) =>
      `<button type="button" class="chip${c === "all" ? " is-active" : ""}" data-filter="${c}">${catLabels[c] || c}</button>`
    ).join("");
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn || !btn.dataset) return;
      $$(".chip").forEach((c) => c.classList.remove("is-active"));
      btn.classList.add("is-active");
      renderWriteups(btn.dataset.filter);
    });
  }

  /* ---------- WRITE-UP CARD ---------- */
  function methodHTML(methods) {
    if (!methods || !methods.length) return "";
    return methods.map((m) => {
      const title = typeof m === "string" ? "Étape" : m.title;
      const text = typeof m === "string" ? m : m.text;
      return `<li><strong class="step">${esc(title)}</strong> — ${esc(text)}</li>`;
    }).join("");
  }
  function cardWriteup(w) {
    const ds = (w.methodology && w.methodology.length) ? w.methodology : w.roadmap || [];
    const methods = methodHTML(ds);
    const tools = (w.tools || []).map((t) => `<code class="tag">${esc(t)}</code>`).join("");
    const screenshot = w.screenshot
      ? `<p class="shot"><span class="m-label">Extrait</span> <code>${esc(w.screenshot)}</code></p>` : "";
    return `
    <article class="card card--ctf" data-cat="${esc(w.category)}" data-id="${esc(w.id)}">
      <header class="card__head">
        <h3 class="card__title">${esc(w.title)}</h3>
        <div class="card__meta">
          <span class="pill">${esc(w.platform)}</span>
          <span class="pill pill--${diffClass(w.difficulty)}">${esc(w.difficulty)}</span>
        </div>
        <div class="tags">${(w.tags || []).map((t) => `<span class="chip chip--mini">${esc(t)}</span>`).join("")}</div>
      </header>
      <details class="card__body">
        <summary>Méthodologie &amp; write-up ▾</summary>
        <p><strong>Contexte</strong> — ${esc(w.context)}</p>
        ${methods ? `<p class="m-label">Méthodologie</p><ol class="meth">${methods}</ol>` : ""}
        ${tools ? `<p class="m-label">Outils</p><p class="tools">${tools}</p>` : ""}
        ${screenshot}
        <p class="m-label">Leçon apprise</p>
        <p class="lesson">${esc(w.lesson)}</p>
      </details>
    </article>`;
  }
  function renderWriteups(filter) {
    const grid = $("#ctfGrid");
    if (!grid) return;
    const list = filter === "all" ? WRITEUPS : WRITEUPS.filter((w) => w.category === filter);
    grid.innerHTML = list.length
      ? list.map(cardWriteup).join("")
      : '<p class="empty">Aucun write-up dans cette catégorie pour l’instant.</p>';
  }
  renderWriteups("all");

  /* ---------- PROJETS ---------- */
  const pGrid = $("#projetsGrid");
  if (pGrid) {
    pGrid.innerHTML = PROJETS.map((p) => `
      <article class="card card--projet">
        <h3 class="card__title">${esc(p.title)}</h3>
        <p class="m-label">Objectif</p>
        <p>${esc(p.objective)}</p>
        <p class="m-label">Stack</p>
        <p class="tools">${p.stack.map((t) => `<code class="tag">${esc(t)}</code>`).join("")}</p>
        ${p.result ? `<p class="m-label">Résultat</p><p class="lesson">${esc(p.result)}</p>` : ""}
        <a class="btn btn--ghost btn--small" href="${esc(p.link)}" target="_blank" rel="noopener">GitHub ↗ · ${esc(p.repo)}</a>
      </article>`).join("");
  }

  /* ---------- PROFILS PUBLICS ---------- */
  const pl = $("#profileLinks");
  if (pl) {
    const links = [
      { lbl: "GitHub", u: PROFILE.github, icon: "octocat" },
      { lbl: "Root Me", u: PROFILE.rootme, icon: "r" },
      { lbl: "HackerLab", u: PROFILE.hackerlab, icon: "HL" },
      { lbl: "LinkedIn", u: PROFILE.linkedin, icon: "in" },
    ];
    pl.innerHTML = links.filter((l) => l.u).map((l) => `
      <a class="profil" href="${esc(l.u)}" target="_blank" rel="noopener">
        <span class="profil__badge">${esc(l.icon)}</span><span>${esc(l.lbl)}</span>
      </a>`).join("");
  }

  /* ---------- COMPÉTENCES ---------- */
  const skills = $("#skills");
  if (skills) {
    skills.innerHTML = Object.keys(COMPETENCES).map((g) => `
      <div class="skill-group">
        <h3 class="skill-group__title">${esc(g)}</h3>
        <div class="skill-group__items">${COMPETENCES[g].map((s) => `<span class="badge">${esc(s)}</span>`).join("")}</div>
      </div>`).join("");
  }

  /* ---------- VEILLE ---------- */
  const v = $("#veilleList");
  if (v && VEILLE) {
    v.innerHTML = VEILLE.map((e) => `
      <div class="veille-item">
        <span class="veille-kind">${esc(e.kind)}</span>
        <strong>${esc(e.label)}</strong><em> — ${esc(e.note)}</em>
      </div>`).join("");
  }

  /* ---------- CONTACT ---------- */
  const cl = $("#contactList");
  if (cl) {
    const items = [
      { lbl: "Email", val: CONTACT.email, href: "mailto:" + CONTACT.email },
      { lbl: "Téléphone", val: CONTACT.phone, href: "tel:" + CONTACT.phone.replace(/\s/g, "") },
      { lbl: "Localisation", val: PROFILE.location },
    ];
    const social = [
      { lbl: "GitHub", u: CONTACT.github }, { lbl: "LinkedIn", u: CONTACT.linkedin },
      { lbl: "Root Me", u: CONTACT.rootme }, { lbl: "HackerLab", u: CONTACT.hackerlab },
    ].filter((x) => x.u);
    cl.innerHTML =
      items.map((x) => `<li><span class="ico">▸</span> ${x.href ? `<a href="${esc(x.href)}">${esc(x.val)}</a>` : esc(x.val)}</li>`).join("") +
      (social.length ? `<li class="contact__social"><span class="ico">⑂</span> ${social.map((x) => `<a href="${esc(x.u)}" target="_blank" rel="noopener">${esc(x.lbl)}</a>`).join("")}</li>` : "");
  }

  /* ---------- NAV MOBILE ---------- */
  const toggle = $("#navToggle"), navLinks = $("#navLinks");
  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }
})();
