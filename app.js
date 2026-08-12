// ============================================================
// RENDER NAV (sidebar) + INICIO (agrupado por impacto)
// desde el catálogo único RULES en data.js
// ============================================================
const navContainer = document.getElementById("nav");
RULES.forEach(rule => {
  const btn = document.createElement("button");
  btn.className = "nav-item";
  btn.dataset.target = rule.id;
  btn.innerHTML = `<span class="nav-seal">${rule.seal}</span><span class="nav-label">${rule.title}</span>`;
  navContainer.appendChild(btn);
});

const impactOrder = ["bajo", "medio", "alto"];
const impactLabels = { bajo: "Impacto bajo", medio: "Impacto medio", alto: "Impacto alto" };
const indexGroups = document.getElementById("indexGroups");

impactOrder.forEach(level => {
  const rulesInLevel = RULES.filter(r => r.impact === level);
  if (!rulesInLevel.length) return;

  const group = document.createElement("div");
  group.className = "index-group";
  group.innerHTML = `<h3 class="index-group-title index-group-title--${level}">${impactLabels[level]}</h3>`;

  const grid = document.createElement("div");
  grid.className = "index-grid";

  rulesInLevel.forEach(rule => {
    const card = document.createElement("button");
    card.className = "index-card";
    card.dataset.target = rule.id;
    card.innerHTML = `
      <span class="index-seal">${rule.seal}</span>
      <h3>${rule.title}</h3>
      <p>${rule.desc}</p>
    `;
    grid.appendChild(card);
  });

  group.appendChild(grid);
  indexGroups.appendChild(group);
});

// ============================================================
// NAVIGATION
// ============================================================
const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");

function goToPage(target) {
  pages.forEach(p => p.classList.toggle("is-active", p.id === target));
  navItems.forEach(n => n.classList.toggle("is-active", n.dataset.target === target));
  sidebar.classList.remove("is-open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

navItems.forEach(btn => {
  btn.addEventListener("click", () => goToPage(btn.dataset.target));
});

document.querySelectorAll("[data-target]").forEach(el => {
  if (!el.classList.contains("nav-item")) {
    el.addEventListener("click", () => goToPage(el.dataset.target));
  }
});

menuToggle.addEventListener("click", () => sidebar.classList.toggle("is-open"));

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
  img.addEventListener("error", () => {
    img.style.display = "none";
    placeholder.style.display = "flex";
  });
  img.addEventListener("load", () => {
    placeholder.style.display = "none";
  });
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
