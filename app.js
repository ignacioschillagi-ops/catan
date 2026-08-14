// ============================================================
// ESTADO: reglas seleccionadas para "Catanazo" (en memoria, por sesión)
// ============================================================
const selectedRuleIds = new Set();
const impactOrder = ["bajo", "medio", "alto"];
const impactLabels = { bajo: "Impacto bajo", medio: "Impacto medio", alto: "Impacto alto" };

function getRule(id) {
  return RULES.find(r => r.id === id);
}

// una regla esta bloqueada si alguna de sus incompatibles ya esta en el carrito
function isBlocked(rule) {
  if (selectedRuleIds.has(rule.id)) return false;
  return rule.incompatible.some(id => selectedRuleIds.has(id));
}

function addRule(id) {
  const rule = getRule(id);
  if (!rule || isBlocked(rule)) return;
  selectedRuleIds.add(id);
  refreshAll();
}

function removeRule(id) {
  selectedRuleIds.delete(id);
  refreshAll();
}

// ============================================================
// TABS (Reglas / Catanazo / Configuración) + paginas de detalle
// ============================================================
const allPages = document.querySelectorAll(".page");
const bottomTabs = document.querySelectorAll(".bottom-tab");
const topbarTitle = document.getElementById("topbarTitle");
const tabTitles = { "tab-reglas": "Reglas", "tab-partida": "Catanazo", "tab-config": "Configuración" };

function showPage(id) {
  allPages.forEach(p => p.classList.toggle("is-active", p.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goToTab(tabId) {
  showPage(tabId);
  bottomTabs.forEach(t => t.classList.toggle("is-active", t.dataset.tab === tabId));
  topbarTitle.textContent = tabTitles[tabId] || "Reglas";
}

function goToRule(ruleId) {
  const rule = getRule(ruleId);
  if (!rule) return;
  showPage(ruleId);
  topbarTitle.textContent = rule.title;
  refreshRuleActions(ruleId);
}

bottomTabs.forEach(tab => {
  tab.addEventListener("click", () => goToTab(tab.dataset.tab));
});

// ============================================================
// RENDER: lista de Reglas (agrupada por impacto, con boton +)
// ============================================================
const reglasList = document.getElementById("reglasList");

function renderReglasList() {
  reglasList.innerHTML = "";
  impactOrder.forEach(level => {
    const rulesInLevel = RULES.filter(r => r.impact === level);
    if (!rulesInLevel.length) return;

    const group = document.createElement("div");
    group.className = "rule-group";
    group.innerHTML = `<h3 class="rule-group-title rule-group-title--${level}">${impactLabels[level]}</h3>`;

    rulesInLevel.forEach(rule => {
      const added = selectedRuleIds.has(rule.id);
      const blocked = isBlocked(rule);

      const row = document.createElement("div");
      row.className = "rule-row" + (blocked ? " is-disabled" : "");
      row.innerHTML = `
        <button class="rule-row-body" data-open="${rule.id}">
          <span class="rule-row-seal">${rule.seal}</span>
          <span class="rule-row-text">
            <h4>${rule.title}</h4>
            <p>${rule.desc}</p>
            ${blocked ? `<span class="rule-row-note">No compatible</span>` : ""}
          </span>
        </button>
        <button class="rule-row-add${added ? " is-added" : ""}" data-add="${rule.id}" ${blocked ? "disabled" : ""}>
          ${added ? "✓" : "+"}
        </button>
      `;
      group.appendChild(row);
    });

    reglasList.appendChild(group);
  });

  reglasList.querySelectorAll("[data-open]").forEach(el => {
    el.addEventListener("click", () => goToRule(el.dataset.open));
  });
  reglasList.querySelectorAll("[data-add]").forEach(el => {
    el.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const id = el.dataset.add;
      if (selectedRuleIds.has(id)) {
        removeRule(id);
      } else {
        addRule(id);
      }
    });
  });
}

// ============================================================
// RENDER: lista de Catanazo (tu partida) - checklist prolijo
// ============================================================
const partidaList = document.getElementById("partidaList");

function renderPartidaList() {
  partidaList.innerHTML = "";

  if (selectedRuleIds.size === 0) {
    partidaList.innerHTML = `
      <div class="partida-empty">
        <span class="icon">⚔</span>
        <p>Todavía no armaste tu Catanazo.<br>Andá a Reglas y sumá las que quieras jugar.</p>
        <button class="btn-seal" data-goto-reglas>Ver reglas</button>
      </div>
    `;
    partidaList.querySelector("[data-goto-reglas]").addEventListener("click", () => goToTab("tab-reglas"));
    return;
  }

  impactOrder.forEach(level => {
    const rulesInLevel = RULES.filter(r => r.impact === level && selectedRuleIds.has(r.id));
    if (!rulesInLevel.length) return;

    const group = document.createElement("div");
    group.className = "rule-group";
    group.innerHTML = `<h3 class="rule-group-title rule-group-title--${level}">${impactLabels[level]}</h3>`;

    rulesInLevel.forEach(rule => {
      const row = document.createElement("div");
      row.className = "partida-row";
      row.dataset.open = rule.id;
      row.innerHTML = `
        <span class="partida-row-seal">${rule.seal}</span>
        <span class="partida-row-title">${rule.title}</span>
        <span class="partida-row-impact partida-row-impact--${level}">${level}</span>
        <button class="partida-row-remove" data-remove="${rule.id}" title="Quitar">✕</button>
      `;
      group.appendChild(row);
    });

    partidaList.appendChild(group);
  });

  partidaList.querySelectorAll("[data-open]").forEach(el => {
    el.addEventListener("click", (ev) => {
      if (ev.target.closest("[data-remove]")) return;
      goToRule(el.dataset.open);
    });
  });
  partidaList.querySelectorAll("[data-remove]").forEach(el => {
    el.addEventListener("click", (ev) => {
      ev.stopPropagation();
      removeRule(el.dataset.remove);
    });
  });
}

// ============================================================
// RENDER: badge del carrito en la pestaña Catanazo
// ============================================================
const cartBadge = document.getElementById("cartBadge");
function updateCartBadge() {
  const count = selectedRuleIds.size;
  cartBadge.textContent = count;
  cartBadge.classList.toggle("is-visible", count > 0);
}

// ============================================================
// RENDER: aviso de compatibilidad + botones de accion en cada
// pagina de detalle de regla (Jugar regla / Volver / Quitar)
// ============================================================
RULES.forEach(rule => {
  const section = document.getElementById(rule.id);
  if (!section) return;

  // aviso de compatibilidad, insertado una vez despues del header
  if (rule.incompatible.length) {
    const notice = document.createElement("div");
    notice.className = "compat-notice";
    notice.dataset.rule = rule.id;
    const header = section.querySelector(".page-hero");
    if (header) header.insertAdjacentElement("afterend", notice);
  }

  // botones de accion, al final de la seccion
  const actions = document.createElement("div");
  actions.className = "rule-actions";
  actions.dataset.ruleId = rule.id;
  actions.innerHTML = `
    <button class="btn-play-rule" data-play="${rule.id}"></button>
    <button class="btn-back-rules" data-back>← Volver a todas las reglas</button>
  `;
  section.appendChild(actions);

  actions.querySelector("[data-back]").addEventListener("click", () => goToTab("tab-reglas"));
  actions.querySelector("[data-play]").addEventListener("click", () => {
    if (selectedRuleIds.has(rule.id)) {
      removeRule(rule.id);
    } else {
      if (isBlocked(rule)) return;
      addRule(rule.id);
      goToTab("tab-reglas");
    }
  });
});

function refreshRuleActions(ruleId) {
  const rule = getRule(ruleId);
  if (!rule) return;
  const section = document.getElementById(ruleId);
  if (!section) return;

  // aviso de compatibilidad
  const notice = section.querySelector(".compat-notice");
  if (notice) {
    const names = rule.incompatible.map(id => getRule(id).title).join(", ");
    const conflict = rule.incompatible.some(id => selectedRuleIds.has(id));
    notice.classList.toggle("is-conflict", conflict);
    notice.innerHTML = `
      <span class="compat-notice-tag">${conflict ? "Conflicto" : "Incompatible"}</span>
      <p>Esta regla no es compatible con <strong>${names}</strong>. Se juega una de las dos, no ambas en la misma partida.${conflict ? " Ya tenés esa regla en tu Catanazo — quitala primero si querés sumar esta." : ""}</p>
    `;
  }

  // botones
  const playBtn = section.querySelector("[data-play]");
  const added = selectedRuleIds.has(ruleId);
  const blocked = !added && isBlocked(rule);

  playBtn.classList.toggle("is-added", added);
  playBtn.disabled = blocked;
  playBtn.textContent = added ? "✕ Quitar regla" : (blocked ? "No compatible con tu Catanazo" : "+ Jugar regla");
}

// ============================================================
// refreshAll: se llama cada vez que cambia la seleccion
// ============================================================
function refreshAll() {
  renderReglasList();
  renderPartidaList();
  updateCartBadge();
  const activeRulePage = document.querySelector(".page.is-active");
  if (activeRulePage && RULES.some(r => r.id === activeRulePage.id)) {
    refreshRuleActions(activeRulePage.id);
  }
}

// ============================================================
// CONFIGURACIÓN: vaciar el Catanazo
// ============================================================
const resetSelectionBtn = document.getElementById("resetSelection");
if (resetSelectionBtn) {
  resetSelectionBtn.addEventListener("click", () => {
    if (selectedRuleIds.size === 0) return;
    if (confirm("¿Vaciar todas las reglas de tu Catanazo?")) {
      selectedRuleIds.clear();
      refreshAll();
    }
  });
}

refreshAll();
// ============================================================
// MODAL - como instalar la app
// ============================================================
const installModal = document.getElementById("installModal");
const installOpen = document.getElementById("installOpen");
const installClose = document.getElementById("installClose");

function openInstallModal() {
  installModal.classList.add("is-open");
}
function closeInstallModal() {
  installModal.classList.remove("is-open");
}

if (installOpen) installOpen.addEventListener("click", openInstallModal);
if (installClose) installClose.addEventListener("click", closeInstallModal);
if (installModal) {
  installModal.addEventListener("click", (ev) => {
    if (ev.target === installModal) closeInstallModal();
  });
}
document.addEventListener("keydown", (ev) => {
  if (ev.key === "Escape") closeInstallModal();
});

// ============================================================
// CIVILIZACIONES - render con costos en iconos e imagen estatica
// ============================================================
const civGrid = document.getElementById("civGrid");

function renderCostRow(icons) {
  return icons.map(icon => `<span class="cost-icon">${icon}</span>`).join("");
}

CIVILIZATIONS.forEach(civ => {
  const card = document.createElement("article");
  card.className = "civ-card";
  card.style.setProperty("--civ-color", civ.color);

  card.innerHTML = `
    <div class="civ-image">
      <div class="civ-image-placeholder" data-role="placeholder">
        <span class="icon">&#9733;</span>
        <span class="label">${civ.name}</span>
      </div>
      <img data-role="preview" src="${civ.image}" alt="Ilustración de ${civ.name}">
    </div>
    <div class="civ-body">
      <div class="civ-head">
        <h3 class="civ-name">${civ.name}</h3>
        <span class="civ-number">N.&deg; ${civ.number}</span>
      </div>
      <div class="civ-costs">
        <div class="civ-cost"><span class="civ-cost-label">Camino</span><span class="civ-cost-val">${renderCostRow(civ.costs.camino)}</span></div>
        <div class="civ-cost"><span class="civ-cost-label">Poblado</span><span class="civ-cost-val">${renderCostRow(civ.costs.poblado)}</span></div>
        <div class="civ-cost"><span class="civ-cost-label">Ciudad</span><span class="civ-cost-val">${renderCostRow(civ.costs.ciudad)}</span></div>
        <div class="civ-cost"><span class="civ-cost-label">CDD</span><span class="civ-cost-val">${renderCostRow(civ.costs.cdd)}</span></div>
      </div>
      <div class="civ-ability">
        <span class="civ-ability-tag">Pasiva</span>
        <p>${civ.passive}</p>
      </div>
      <div class="civ-ability">
        <span class="civ-ability-tag active">Con 7</span>
        <p>${civ.active}</p>
      </div>
    </div>
  `;

  // si la imagen todavia no fue subida a /images/civs/, se muestra el placeholder con el sello
  const img = card.querySelector('[data-role="preview"]');
  const placeholder = card.querySelector('[data-role="placeholder"]');
  img.addEventListener("error", () => {
    img.style.display = "none";
    placeholder.style.display = "flex";
  });
  img.addEventListener("load", () => {
    placeholder.style.display = "none";
  });

  civGrid.appendChild(card);
});

// ============================================================
// ASEDIO - imagen de ejemplo de la carta de Caballero
// ============================================================
(function knightImage() {
  const img = document.getElementById("knightPreview");
  const placeholder = document.getElementById("knightPlaceholder");
  if (!img) return;
  img.addEventListener("error", () => {
    img.style.display = "none";
    placeholder.style.display = "flex";
  });
  img.addEventListener("load", () => {
    placeholder.style.display = "none";
  });
})();

// ============================================================
// CATASTROFES - imagenes de cada carta (con fallback a placeholder)
// ============================================================
document.querySelectorAll(".disaster-image").forEach(box => {
  const img = box.querySelector("img");
  const placeholder = box.querySelector(".disaster-placeholder");
  if (!img) return;
  let loaded = false;
  img.addEventListener("error", () => {
    loaded = false;
    img.style.display = "none";
    placeholder.style.display = "flex";
  });
  img.addEventListener("load", () => {
    loaded = true;
    placeholder.style.display = "none";
  });
  box.addEventListener("click", () => {
    if (loaded) openLightbox(img.src, img.alt);
  });
});

// ============================================================
// LIGHTBOX - amplia una imagen en un popup
// ============================================================
const lightboxModal = document.getElementById("lightboxModal");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || "";
  lightboxModal.classList.add("is-open");
}
function closeLightbox() {
  lightboxModal.classList.remove("is-open");
}

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightboxModal) {
  lightboxModal.addEventListener("click", (ev) => {
    if (ev.target === lightboxModal) closeLightbox();
  });
}
document.addEventListener("keydown", (ev) => {
  if (ev.key === "Escape") closeLightbox();
});

// ============================================================
// CONSECUENCIAS DEL 7 - mazo con contador y sin repeticion
// ============================================================
const tagLabels = {
  good: "favorable",
  neutral: "neutro",
  risk: "riesgo",
  bad: "desfavorable"
};

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let pile = shuffle(FATE_DECK.map((_, i) => i));
let drawn = 0;
const total = FATE_DECK.length;

const drawBtn = document.getElementById("drawBtn");
const deckCounter = document.getElementById("deckCounter");
const fateCard = document.getElementById("fateCard");
const fateQuote = document.getElementById("fateQuote");
const fateEffect = document.getElementById("fateEffect");
const fateEffectText = document.getElementById("fateEffectText");
const fateTag = document.getElementById("fateTag");
const reshuffleNote = document.getElementById("reshuffleNote");
const deckReset = document.getElementById("deckReset");

function resetDeck() {
  pile = shuffle(FATE_DECK.map((_, i) => i));
  drawn = 0;
  deckCounter.textContent = `Carta 0 de ${total}`;
  fateQuote.textContent = "Tocá el sello para tirar el 7.";
  fateEffect.style.display = "none";
  reshuffleNote.classList.remove("is-visible");
}

drawBtn.addEventListener("click", () => {
  reshuffleNote.classList.remove("is-visible");

  if (pile.length === 0) {
    pile = shuffle(FATE_DECK.map((_, i) => i));
    drawn = 0;
    reshuffleNote.classList.add("is-visible");
  }

  const idx = pile.pop();
  const card = FATE_DECK[idx];
  drawn++;

  deckCounter.textContent = `Carta ${drawn} de ${total}`;

  fateCard.style.opacity = "0";
  setTimeout(() => {
    fateQuote.textContent = card.q;
    fateEffectText.textContent = card.e;
    fateTag.className = `fate-tag ${card.w}`;
    fateTag.textContent = tagLabels[card.w];
    fateEffect.style.display = "block";
    fateCard.style.opacity = "1";
  }, 150);
});

deckReset.addEventListener("click", resetDeck);
