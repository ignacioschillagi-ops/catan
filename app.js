// ============================================================
// ESTADO: idioma activo (es / en)
// ============================================================
const LANG_STORAGE_KEY = "catanazo-lang";

function loadLang() {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    return saved === "en" ? "en" : "es";
  } catch (e) {
    return "es";
  }
}
function saveLang() {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, currentLang);
  } catch (e) {
    // sin localStorage disponible, la app sigue funcionando sin persistencia
  }
}
let currentLang = loadLang();

// helper de traduccion: I18N[currentLang][key], con reemplazo simple de {vars}
function t(key, vars) {
  const dict = I18N[currentLang] || I18N.es;
  let text = dict[key] !== undefined ? dict[key] : key;
  if (vars) {
    Object.keys(vars).forEach(k => {
      text = text.replace(`{${k}}`, vars[k]);
    });
  }
  return text;
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// accesores de contenido bilingue de los datos (RULES / CIVILIZATIONS / FATE_DECK)
function ruleTitle(rule) { return currentLang === "en" ? rule.titleEn : rule.title; }
function ruleDesc(rule) { return currentLang === "en" ? rule.descEn : rule.desc; }
function civName(civ) { return currentLang === "en" ? civ.nameEn : civ.name; }
function civPassive(civ) { return currentLang === "en" ? civ.passiveEn : civ.passive; }
function civActive(civ) { return currentLang === "en" ? civ.activeEn : civ.active; }
function cardQuote(card) { return currentLang === "en" ? card.qEn : card.q; }
function cardEffect(card) { return currentLang === "en" ? card.eEn : card.e; }
function resName(res) { return currentLang === "en" ? res.nameEn : res.name; }

// ============================================================
// ESTADO: set de recursos activo (Catan Clásico vs Age of Catan by Joe)
// ============================================================
const RULESET_STORAGE_KEY = "catanazo-ruleset";

function loadRuleset() {
  try {
    const saved = localStorage.getItem(RULESET_STORAGE_KEY);
    return saved === "joe" ? "joe" : "clasico";
  } catch (e) {
    return "clasico";
  }
}

function saveRuleset() {
  try {
    localStorage.setItem(RULESET_STORAGE_KEY, currentRuleset);
  } catch (e) {
    // sin localStorage disponible, la app sigue funcionando sin persistencia
  }
}

let currentRuleset = loadRuleset();

// ============================================================
// ESTADO: reglas seleccionadas para "Catanazo" (persiste en localStorage)
// ============================================================
const STORAGE_KEY = "catanazo-reglas";

function loadSelection() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const ids = JSON.parse(raw);
    if (!Array.isArray(ids)) return [];
    // descarta ids que ya no existan en el catalogo (por si se elimino una regla)
    return ids.filter(id => RULES.some(r => r.id === id));
  } catch (e) {
    return [];
  }
}

function saveSelection() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...selectedRuleIds]));
  } catch (e) {
    // localStorage no disponible (modo privado, etc.) - la app sigue funcionando sin persistencia
  }
}

const selectedRuleIds = new Set(loadSelection());
const impactOrder = ["bajo", "medio", "alto"];
const impactKeys = { bajo: "impactoBajo", medio: "impactoMedio", alto: "impactoAlto" };

function getRule(id) {
  return RULES.find(r => r.id === id);
}

// una regla esta bloqueada si alguna de sus incompatibles ya esta en el carrito
function isBlocked(rule) {
  if (selectedRuleIds.has(rule.id)) return false;
  return rule.incompatible.some(id => selectedRuleIds.has(id));
}

// nombres de las reglas ya elegidas que estan causando el bloqueo, para mostrar el motivo
function blockingRuleNames(rule) {
  return rule.incompatible
    .filter(id => selectedRuleIds.has(id))
    .map(id => ruleTitle(getRule(id)));
}

function addRule(id) {
  const rule = getRule(id);
  if (!rule || isBlocked(rule)) return;
  selectedRuleIds.add(id);
  saveSelection();
  refreshAll();
}

function removeRule(id) {
  selectedRuleIds.delete(id);
  saveSelection();
  refreshAll();
}

// ============================================================
// TABS (Reglas / Catanazo / Configuración) + paginas de detalle
// ============================================================
const allPages = document.querySelectorAll(".page");
const bottomTabs = document.querySelectorAll(".bottom-tab");
const topbarTitle = document.getElementById("topbarTitle");
const tabTitleKeys = { "tab-reglas": "tabReglas", "tab-partida": "tabPartida", "tab-config": "tabConfig" };

function showPage(id) {
  allPages.forEach(p => p.classList.toggle("is-active", p.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goToTab(tabId) {
  showPage(tabId);
  bottomTabs.forEach(t2 => t2.classList.toggle("is-active", t2.dataset.tab === tabId));
  topbarTitle.textContent = t(tabTitleKeys[tabId] || "tabReglas");
  updateJumpnavVisibility();
}

function goToRule(ruleId) {
  const rule = getRule(ruleId);
  if (!rule) return;
  showPage(ruleId);
  topbarTitle.textContent = ruleTitle(rule);
  refreshRuleActions(ruleId);
  updateJumpnavVisibility();
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
    group.innerHTML = `<h3 class="rule-group-title rule-group-title--${level}">${t(impactKeys[level])}</h3>`;

    rulesInLevel.forEach(rule => {
      const added = selectedRuleIds.has(rule.id);
      const blocked = isBlocked(rule);

      const row = document.createElement("div");
      row.className = "rule-row" + (blocked ? " is-disabled" : "");
      row.innerHTML = `
        <button class="rule-row-body" data-open="${rule.id}">
          <span class="rule-row-seal">${rule.seal}</span>
          <span class="rule-row-text">
            <h4>${ruleTitle(rule)}</h4>
            <p>${ruleDesc(rule)}</p>
            ${blocked ? `<span class="rule-row-note">${t("noCompatibleCon")} ${blockingRuleNames(rule).join(", ")}</span>` : ""}
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
// RENDER: Catanazo (tu partida) - contenido completo apilado,
// con navegacion rapida lateral. Sin boton de quitar (eso se
// hace solo desde la pestaña Reglas).
// ============================================================
const partidaList = document.getElementById("partidaList");
const jumpnav = document.getElementById("jumpnav");

function buildRuleBlock(ruleId) {
  const original = document.getElementById(ruleId);
  if (!original) return null;

  const clone = original.cloneNode(true);
  clone.removeAttribute("id");
  clone.classList.remove("page", "is-active");
  clone.classList.add("partida-block");

  // en Catanazo no se gestiona compatibilidad ni se quita/juega: solo se lee
  clone.querySelector(".compat-notice")?.remove();
  clone.querySelector(".rule-actions")?.remove();

  const wrap = document.createElement("div");
  wrap.className = "partida-anchor";
  wrap.id = `partida-anchor-${ruleId}`;
  wrap.appendChild(clone);

  // reconectar la interactividad de reglas con contenido dinamico,
  // ya que clonar el DOM no copia los listeners originales
  if (ruleId === "civilizaciones") {
    wireCivImages(clone);
    wireCivFavorites(clone);
    refreshCivFavoritesUI();
  }
  if (ruleId === "asedio") wireKnightImage(clone);
  if (ruleId === "catastrofes") wireDisasterImages(clone);
  if (ruleId === "consecuencias") initFateDeck(clone);
  if (ruleId === "civilizaciones" || ruleId === "asedio") refreshResourceDisplay();

  return wrap;
}

function renderPartidaList() {
  partidaList.innerHTML = "";
  jumpnav.innerHTML = "";

  const rulesSelected = RULES.filter(r => selectedRuleIds.has(r.id));
  const partidaDivider = document.getElementById("partidaDivider");
  if (partidaDivider) partidaDivider.classList.toggle("is-visible", rulesSelected.length > 0);

  if (!rulesSelected.length) {
    partidaList.innerHTML = `
      <div class="partida-empty">
        <span class="icon">⚔</span>
        <p>${t("partidaEmptyMsg")}</p>
        <button class="btn-seal" data-goto-reglas>${t("partidaEmptyBtn")}</button>
      </div>
    `;
    partidaList.querySelector("[data-goto-reglas]").addEventListener("click", () => goToTab("tab-reglas"));
    updateJumpnavVisibility();
    setupJumpnavObserver();
    return;
  }

  rulesSelected.forEach(rule => {
    const block = buildRuleBlock(rule.id);
    if (block) partidaList.appendChild(block);

    const jumpBtn = document.createElement("button");
    jumpBtn.className = "jumpnav-seal";
    jumpBtn.dataset.jump = rule.id;
    jumpBtn.title = ruleTitle(rule);
    jumpBtn.innerHTML = rule.seal;
    jumpBtn.addEventListener("click", () => {
      document.getElementById(`partida-anchor-${rule.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    jumpnav.appendChild(jumpBtn);
  });

  updateJumpnavVisibility();
  setupJumpnavObserver();
}

// resalta en el jumpnav el sello de la regla que esta a la vista mientras
// se scrollea el Catanazo, para dar sensacion de "donde estoy parado"
let jumpnavObserver = null;

function setupJumpnavObserver() {
  if (jumpnavObserver) jumpnavObserver.disconnect();
  if (typeof IntersectionObserver === "undefined") return; // navegadores muy viejos: se omite, sin romper nada

  const anchors = partidaList.querySelectorAll(".partida-anchor");
  if (!anchors.length) return;

  jumpnavObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const ruleId = entry.target.id.replace("partida-anchor-", "");
      const seal = jumpnav.querySelector(`[data-jump="${ruleId}"]`);
      if (seal) seal.classList.toggle("is-current", entry.isIntersecting);
    });
  }, {
    root: null,
    rootMargin: "-110px 0px -65% 0px",
    threshold: 0
  });

  anchors.forEach(a => jumpnavObserver.observe(a));
}

function updateJumpnavVisibility() {
  const onPartidaTab = document.getElementById("tab-partida").classList.contains("is-active");
  jumpnav.classList.toggle("is-visible", onPartidaTab && selectedRuleIds.size > 0);
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
    <button class="btn-back-rules" data-back></button>
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
    const names = rule.incompatible.map(id => ruleTitle(getRule(id)));
    const sep = currentLang === "en" ? " and " : " y ";
    const namesList = names.join(sep);
    const conflictNames = blockingRuleNames(rule);
    const conflict = conflictNames.length > 0;
    notice.classList.toggle("is-conflict", conflict);
    notice.innerHTML = `
      <span class="compat-notice-tag">${conflict ? t("conflictTag") : t("incompatibleTag")}</span>
      <p>${t("compatText", { names: namesList })}${conflict ? t("compatConflictText", { names: conflictNames.join(", ") }) : ""}</p>
    `;
  }

  // botones
  const playBtn = section.querySelector("[data-play]");
  const backBtn = section.querySelector("[data-back]");
  if (backBtn) backBtn.textContent = t("btnBackRules");
  const added = selectedRuleIds.has(ruleId);
  const blocked = !added && isBlocked(rule);

  playBtn.classList.toggle("is-added", added);
  playBtn.disabled = blocked;
  playBtn.textContent = added ? t("btnRemoveRule") : (blocked ? `${t("noCompatibleCon")} ${blockingRuleNames(rule).join(", ")}` : t("btnPlayRule"));
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
    if (confirm(t("confirmVaciar"))) {
      selectedRuleIds.clear();
      saveSelection();
      refreshAll();
    }
  });
}

// ============================================================
// CONFIGURACIÓN: compartir la app con amigos
// ============================================================
const shareBtn = document.getElementById("shareBtn");
if (shareBtn) {
  shareBtn.addEventListener("click", async () => {
    const shareData = {
      title: t("shareTitle"),
      text: t("shareText"),
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        // el usuario cancelo el dialogo nativo, o no se pudo compartir: no hacemos nada mas
      }
      return;
    }

    // sin Web Share API (navegadores de escritorio, sobre todo): copiamos el link
    const originalText = shareBtn.textContent;
    try {
      await navigator.clipboard.writeText(shareData.url);
      shareBtn.textContent = t("btnShareCopied");
    } catch (e) {
      // ni Web Share ni Clipboard disponibles: seleccionamos el texto en un input temporal
      const tempInput = document.createElement("input");
      tempInput.value = shareData.url;
      document.body.appendChild(tempInput);
      tempInput.select();
      try {
        document.execCommand("copy");
        shareBtn.textContent = t("btnShareCopied");
      } catch (e2) {
        // ultimo recurso: no se pudo copiar de ninguna forma, dejamos el boton como estaba
      }
      document.body.removeChild(tempInput);
    }
    setTimeout(() => { shareBtn.textContent = t("btnShare"); }, 2000);
  });
}

// ============================================================
// TOGGLE: Catan Clásico vs Age of Catan by Joe (set de recursos)
// ============================================================
const rulesetToggle = document.getElementById("rulesetToggle");
// aplica el estado visual (opcion resaltada + posicion de la perilla)
// a cualquier switch de dos opciones tipo .ruleset-toggle, de forma
// generica, sin depender de los nombres de valor de cada opcion
function setToggleState(toggleEl, activeValue) {
  if (!toggleEl) return;
  const options = [...toggleEl.querySelectorAll(".ruleset-option")];
  const activeIndex = options.findIndex(opt => opt.dataset.option === activeValue);
  toggleEl.dataset.activeIndex = activeIndex === -1 ? 0 : activeIndex;
  options.forEach(opt => {
    opt.classList.toggle("is-active", opt.dataset.option === activeValue);
  });
}

function applyRulesetUI() {
  setToggleState(rulesetToggle, currentRuleset);
}
if (rulesetToggle) {
  applyRulesetUI();
  rulesetToggle.addEventListener("click", () => {
    currentRuleset = currentRuleset === "clasico" ? "joe" : "clasico";
    saveRuleset();
    applyRulesetUI();
    refreshResourceDisplay();
  });
}

// ============================================================
// TOGGLE: idioma (Español / English)
// ============================================================
const langToggle = document.getElementById("langToggle");
function applyLangToggleUI() {
  setToggleState(langToggle, currentLang);
}
if (langToggle) {
  applyLangToggleUI();
  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "es" ? "en" : "es";
    saveLang();
    applyLangToggleUI();
    applyLanguage();
  });
}

// aplica el idioma activo a TODO el documento: textos fijos marcados con
// data-i18n(-html/-alt), los titulos de regla, y todo el contenido dinamico
// generado por JS (listas, botones, civilizaciones, mazo del 7)
function applyLanguage() {
  document.documentElement.lang = currentLang;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll("[data-i18n-alt]").forEach(el => {
    el.setAttribute("alt", t(el.dataset.i18nAlt));
  });
  document.querySelectorAll("[data-i18n-rule-title]").forEach(el => {
    const rule = getRule(el.dataset.i18nRuleTitle);
    if (rule) el.textContent = ruleTitle(rule);
  });

  refreshAll();
  RULES.forEach(r => refreshRuleActions(r.id));
  refreshCivTexts();
  refreshCivFavoritesUI();
  refreshResourceDisplay();

  // el contador de cartas ya tirado ("Carta N de 30") no tiene data-i18n
  // porque su numero es dinamico: se reformatea a mano, extrayendo el numero
  document.querySelectorAll(".deck-count").forEach(el => {
    const match = el.textContent.match(/(\d+)/);
    const n = match ? match[1] : "0";
    el.textContent = t("deckCountTpl", { n, total: FATE_DECK.length });
  });

  // si ya se tiro una carta del mazo del reino, se vuelve a mostrar en el
  // idioma nuevo (se guarda el indice de la carta en el propio elemento)
  document.querySelectorAll(".fate-card").forEach(fc => {
    const idx = fc.dataset.currentCard;
    if (idx === undefined) return;
    const card = FATE_DECK[+idx];
    if (!card) return;
    const quote = fc.querySelector(".fate-quote");
    const effectText = fc.querySelector(".fate-effect-text");
    const tag = fc.querySelector(".fate-tag");
    if (quote) quote.textContent = cardQuote(card);
    if (effectText) effectText.textContent = cardEffect(card);
    if (tag) tag.textContent = t("tag" + capitalize(card.w));
  });
}

// ============================================================
// CIVILIZACIONES - render con costos en iconos e imagen estatica
// ============================================================
const civGrid = document.getElementById("civGrid");

const STAR_OUTLINE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"/></svg>';
const STAR_FILLED_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"/></svg>';

function renderCostRow(resourceKeys) {
  return resourceKeys.map(key => {
    const res = RESOURCE_SETS[currentRuleset][key];
    return `<span class="cost-icon" title="${resName(res)}">${res.icon}</span>`;
  }).join("");
}

// re-conecta el fallback de imagen (placeholder si /images/ no cargo)
// dentro de cualquier raiz: el documento original o un clon de Catanazo
function wireCivImages(root) {
  root.querySelectorAll(".civ-image").forEach(civImg => {
    const img = civImg.querySelector('[data-role="preview"]');
    const placeholder = civImg.querySelector('[data-role="placeholder"]');
    if (!img) return;
    img.addEventListener("error", () => {
      img.style.display = "none";
      if (placeholder) placeholder.style.display = "flex";
    });
    img.addEventListener("load", () => {
      if (placeholder) placeholder.style.display = "none";
    });
  });
}

// ============================================================
// CIVILIZACIONES - favoritas: marcar cuales usa cada jugador para
// compactar el resto y acortar el scroll en Catanazo. Se puede
// tener mas de una activa (celular compartido / banquero).
// ============================================================
const CIV_STORAGE_KEY = "catanazo-civ-favoritas";

function loadCivFavorites() {
  try {
    const raw = localStorage.getItem(CIV_STORAGE_KEY);
    if (!raw) return [];
    const ids = JSON.parse(raw);
    return Array.isArray(ids) ? ids.filter(id => CIVILIZATIONS.some(c => c.id === id)) : [];
  } catch (e) {
    return [];
  }
}

function saveCivFavorites() {
  try {
    localStorage.setItem(CIV_STORAGE_KEY, JSON.stringify([...civFavorites]));
  } catch (e) {
    // sin localStorage disponible, la app sigue funcionando sin persistencia
  }
}

const civFavorites = new Set(loadCivFavorites());

function toggleCivFavorite(civId) {
  if (civFavorites.has(civId)) {
    civFavorites.delete(civId);
  } else {
    civFavorites.add(civId);
  }
  saveCivFavorites();
  refreshCivFavoritesUI();
}

// aplica el estado (estrella + compactado) a TODAS las tarjetas de esa
// civilizacion presentes en el documento (la original y cualquier clon
// que este mostrandose en Catanazo al mismo tiempo)
function refreshCivFavoritesUI() {
  const anyFav = civFavorites.size > 0;
  document.querySelectorAll(".civ-card").forEach(card => {
    const civId = card.dataset.civId;
    const civ = CIVILIZATIONS.find(c => c.id === civId);
    const isFav = civFavorites.has(civId);
    card.classList.toggle("is-compact", anyFav && !isFav);
    const btn = card.querySelector(".civ-fav-btn");
    if (btn && civ) {
      btn.classList.toggle("is-active", isFav);
      btn.innerHTML = isFav ? STAR_FILLED_SVG : STAR_OUTLINE_SVG;
      btn.setAttribute("aria-label", isFav ? t("civFavRemove", { name: civName(civ) }) : t("civFavAdd", { name: civName(civ) }));
    }
  });
}

// re-conecta el click de la estrella dentro de cualquier raiz (documento
// original o clon de Catanazo); el estado en si es compartido y global
function wireCivFavorites(root) {
  root.querySelectorAll(".civ-fav-btn").forEach(btn => {
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      toggleCivFavorite(btn.dataset.civFav);
    });
  });
}

CIVILIZATIONS.forEach(civ => {
  const card = document.createElement("article");
  card.className = "civ-card";
  card.style.setProperty("--civ-color", civ.color);
  card.dataset.civId = civ.id;

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
        <button class="civ-fav-btn" data-civ-fav="${civ.id}" title="Favorita">${STAR_OUTLINE_SVG}</button>
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
  civGrid.appendChild(card);
});

wireCivImages(document);
wireCivFavorites(document);
refreshCivFavoritesUI();

// vuelve a pintar nombre, etiquetas y habilidades de cada tarjeta de
// civilizacion segun el idioma activo (documento original + clones)
function refreshCivTexts() {
  const costLabelKeys = ["costCamino", "costPoblado", "costCiudad", "costCdd"];
  document.querySelectorAll(".civ-card").forEach(card => {
    const civ = CIVILIZATIONS.find(c => c.id === card.dataset.civId);
    if (!civ) return;

    const nameEl = card.querySelector(".civ-name");
    if (nameEl) nameEl.textContent = civName(civ);

    const costLabels = card.querySelectorAll(".civ-cost-label");
    costLabels.forEach((el, i) => { el.textContent = t(costLabelKeys[i]); });

    const abilityTags = card.querySelectorAll(".civ-ability-tag");
    if (abilityTags[0]) abilityTags[0].textContent = t("civPasivaCardTag");
    if (abilityTags[1]) abilityTags[1].textContent = t("civActivaCardTag");

    const abilityPs = card.querySelectorAll(".civ-ability p");
    if (abilityPs[0]) abilityPs[0].textContent = civPassive(civ);
    if (abilityPs[1]) abilityPs[1].textContent = civActive(civ);
  });
}

// ============================================================
// SET DE RECURSOS - vuelve a pintar costos de Civilizaciones y la
// tabla de Asedio segun el ruleset activo (Catan Clásico / Age of
// Catan by Joe). Corre sobre TODO el documento: la seccion original
// y cualquier clon que este mostrandose en Catanazo al mismo tiempo.
// ============================================================
function refreshResourceDisplay() {
  const costOrder = ["camino", "poblado", "ciudad", "cdd"];
  document.querySelectorAll(".civ-card").forEach(card => {
    const civ = CIVILIZATIONS.find(c => c.id === card.dataset.civId);
    if (!civ) return;
    const vals = card.querySelectorAll(".civ-cost-val");
    vals.forEach((el, i) => {
      el.innerHTML = renderCostRow(civ.costs[costOrder[i]]);
    });
  });

  document.querySelectorAll(".res-label").forEach(el => {
    const key = el.dataset.resKey;
    const count = parseInt(el.dataset.resCount, 10) || 1;
    const res = RESOURCE_SETS[currentRuleset][key];
    if (!res) return;
    const label = count > 1 ? `${capitalize(resName(res))}s` : capitalize(resName(res));
    el.textContent = `${label} ${res.icon.repeat(count)}`;
  });

  const legendOrder = ["madera", "oveja", "piedra", "trigo", "arcilla"];
  const legendText = legendOrder.map(key => {
    const res = RESOURCE_SETS[currentRuleset][key];
    return `${res.icon} ${resName(res)}`;
  }).join(" &nbsp;·&nbsp; ");
  document.querySelectorAll(".resource-legend").forEach(el => {
    el.innerHTML = legendText;
  });
}

refreshResourceDisplay();

// ============================================================
// ASEDIO - imagen de ejemplo de la carta de Caballero
// ============================================================
function wireKnightImage(root) {
  const wrap = root.querySelector(".knight-image");
  if (!wrap) return;
  const img = wrap.querySelector(".knight-img");
  const placeholder = wrap.querySelector(".knight-placeholder");
  if (!img) return;
  img.addEventListener("error", () => {
    img.style.display = "none";
    if (placeholder) placeholder.style.display = "flex";
  });
  img.addEventListener("load", () => {
    if (placeholder) placeholder.style.display = "none";
  });
}
wireKnightImage(document);

// ============================================================
// CATASTROFES - imagenes de cada carta (con fallback a placeholder)
// ============================================================
function wireDisasterImages(root) {
  root.querySelectorAll(".disaster-image").forEach(box => {
    const img = box.querySelector("img");
    const placeholder = box.querySelector(".disaster-placeholder");
    if (!img) return;
    let loaded = false;
    img.addEventListener("error", () => {
      loaded = false;
      img.style.display = "none";
      if (placeholder) placeholder.style.display = "flex";
    });
    img.addEventListener("load", () => {
      loaded = true;
      if (placeholder) placeholder.style.display = "none";
    });
    box.addEventListener("click", () => {
      if (loaded) openLightbox(img.src, img.alt);
    });
  });
}
wireDisasterImages(document);

// ============================================================
// LIGHTBOX - amplia una imagen en un popup (compartido globalmente,
// tanto la seccion original como cualquier clon de Catanazo lo usan)
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
// CONSECUENCIAS DEL 7 - mazo con contador y sin repeticion.
// Cada instancia (la original y cada clon en Catanazo) tiene su
// propio mazo independiente, con su propio estado.
// ============================================================
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function initFateDeck(root) {
  const drawBtn = root.querySelector(".draw-btn");
  const deckCounter = root.querySelector(".deck-count");
  const fateCard = root.querySelector(".fate-card");
  const fateQuote = root.querySelector(".fate-quote");
  const fateEffect = root.querySelector(".fate-effect");
  const fateEffectText = root.querySelector(".fate-effect-text");
  const fateTag = root.querySelector(".fate-tag");
  const reshuffleNote = root.querySelector(".deck-note");
  const deckReset = root.querySelector(".btn-reset");
  if (!drawBtn) return;

  const total = FATE_DECK.length;
  let pile = shuffle(FATE_DECK.map((_, i) => i));
  let drawn = 0;

  function resetDeck() {
    pile = shuffle(FATE_DECK.map((_, i) => i));
    drawn = 0;
    delete fateCard.dataset.currentCard;
    deckCounter.textContent = t("deckCountTpl", { n: 0, total });
    fateQuote.textContent = t("fateQuoteInitial");
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

    deckCounter.textContent = t("deckCountTpl", { n: drawn, total });

    fateCard.style.opacity = "0";
    setTimeout(() => {
      fateCard.dataset.currentCard = idx;
      fateQuote.textContent = cardQuote(card);
      fateEffectText.textContent = cardEffect(card);
      fateTag.className = `fate-tag ${card.w}`;
      fateTag.textContent = t("tag" + capitalize(card.w));
      fateEffect.style.display = "block";
      fateCard.style.opacity = "1";
    }, 150);
  });

  deckReset.addEventListener("click", resetDeck);
}
initFateDeck(document);

// ============================================================
// SPLASH - pantalla de carga con el logo (3 segundos)
// ============================================================
const splash = document.getElementById("splash");
if (splash) {
  setTimeout(() => {
    splash.classList.add("is-hidden");
    setTimeout(() => splash.remove(), 400);
  }, 3000);
}

// ============================================================
// primer render de toda la app, ya con todo inicializado
// ============================================================
applyLanguage();
