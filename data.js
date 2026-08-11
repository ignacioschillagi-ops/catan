// ============================================================
// CIVILIZACIONES
// Los costos usan iconos de recursos: madera, oveja, mineral, trigo, arcilla
// "image" apunta a la carpeta /images/civs/ - reemplaza esos archivos en GitHub
// (mismo nombre, cualquier imagen) y se sincronizan solas en Vercel.
// ============================================================
const CIVILIZATIONS = [
  {
    id: "incas",
    name: "Incas",
    number: 1,
    color: "var(--incas)",
    image: "images/civs/incas.jpg",
    costs: {
      camino: ["🐑", "🧱"],
      poblado: ["🐑", "🧱", "🪵", "🌾"],
      ciudad: ["🐑", "🪨", "🪨", "🌾", "🌾"],
      cdd: ["🐑", "🪨", "🪵"]
    },
    passive: "Si ningún número tuyo produce en un turno, recibís del banco 1 recurso a elección de quien tiró los dados.",
    active: "Robás con el ladrón, y podés reposicionar 1 camino propio (abierto) en otra ubicación válida."
  },
  {
    id: "azteca",
    name: "Azteca",
    number: 2,
    color: "var(--azteca)",
    image: "images/civs/azteca.jpg",
    costs: {
      camino: ["🐑", "🧱"],
      poblado: ["🐑", "🧱", "🪵", "🌾"],
      ciudad: ["🐑", "🪨", "🪨", "🌾", "🌾"],
      cdd: ["🐑", "🪨", "🪵"]
    },
    passive: "Al construir una ciudad nueva, podés sacrificar 1 CDD sin revelar, y recibir a cambio otra CDD.",
    active: "Si el ladrón cae en un hexágono con poblados de dos jugadores, robás 1 carta a cada uno."
  },
  {
    id: "romanos",
    name: "Romanos",
    number: 3,
    color: "var(--romanos)",
    image: "images/civs/romanos.jpg",
    costs: {
      camino: ["🪵", "🪨"],
      poblado: ["🪵", "🪨", "🌾", "🐑"],
      ciudad: ["🪵", "🧱", "🧱", "🐑", "🐑"],
      cdd: ["🪵", "🧱", "🌾"]
    },
    passive: "Al comprar una CDD, podés mirar la carta superior del mazo. Si no te sirve, tomás la siguiente y barajás.",
    active: "Mirás la mano de un jugador y elegís qué carta robarle."
  },
  {
    id: "vikingos",
    name: "Vikingos",
    number: 4,
    color: "var(--vikingos)",
    image: "images/civs/vikingos.jpg",
    costs: {
      camino: ["🪵", "🪨"],
      poblado: ["🪵", "🪨", "🌾", "🐑"],
      ciudad: ["🪵", "🧱", "🧱", "🐑", "🐑"],
      cdd: ["🪵", "🧱", "🌾"]
    },
    passive: "Con 2+ puertos 3:1, comerciás a 2:1 en cualquiera. Tus ciudades solo se construyen en costa.",
    active: "Robás normal. Además, un poblado o ciudad te cuesta 1 recurso menos ese turno."
  },
  {
    id: "egipcios",
    name: "Egipcios",
    number: 5,
    color: "var(--egipcios)",
    image: "images/civs/egipcios.jpg",
    costs: {
      camino: ["🌾", "🧱"],
      poblado: ["🌾", "🧱", "🐑", "🪵"],
      ciudad: ["🌾", "🪨", "🪨", "🪵", "🪵"],
      cdd: ["🌾", "🪨", "🐑"]
    },
    passive: "Tus poblados junto a desierto producen +2 recursos.",
    active: "Robás con el ladrón, o le das 1 recurso al jugador con menos puntos, a cambio recibís 1 CDD del banco."
  },
  {
    id: "chinos",
    name: "Chinos",
    number: 6,
    color: "var(--chinos)",
    image: "images/civs/chinos.jpg",
    costs: {
      camino: ["🌾", "🧱"],
      poblado: ["🌾", "🧱", "🐑", "🪵"],
      ciudad: ["🌾", "🪨", "🪨", "🪵", "🪵"],
      cdd: ["🌾", "🪨", "🐑"]
    },
    passive: "Tu límite de cartas en mano si toca un 7, es de 9 cartas.",
    active: "En vez de robar con el ladrón, comerciás 2:2 con el banco (una vez por turno)."
  }
];

// ============================================================
// IMPACTO EN LA JUGABILIDAD - para las tarjetas de Inicio
// ============================================================
const RULE_IMPACT = {
  "dos-doce": "bajo",
  "soborno": "medio",
  "consecuencias": "alto",
  "civilizaciones": "alto",
  "asedio": "alto"
};

// ============================================================
// MAZO - CONSECUENCIAS DEL 7 (30 cartas)
// w: good | neutral | risk | bad
// ============================================================
const FATE_DECK = [
  { q: "Un mercader itinerante, harto de que lo asalten en el camino, soborna a todo el pueblo con su mercancía.", e: "Recibís 2 recursos a elección del banco.", w: "good" },
  { q: "Los siervos del reino, cansados de ver crecer las arcas del más rico, deciden \u201credistribuir\u201d un poco de riqueza.", e: "Robás 1 carta al azar a cada jugador con más puntos de victoria visibles que vos.", w: "good" },
  { q: "Un grupo de monjes empedradores, en penitencia por sus pecados, pavimenta un camino sin cobrar nada.", e: "Construís 1 camino gratis, sin gastar recursos.", w: "good" },
  { q: "Un alquimista exiliado de la corte por sus experimentos fallidos te entrega sus últimos secretos a cambio de refugio.", e: "Recibís 1 carta de desarrollo gratis del mazo.", w: "good" },
  { q: "Otro día cualquiera en el feudo: el recaudador de impuestos hace su ronda habitual.", e: "Movés el ladrón y robás con normalidad.", w: "neutral" },
  { q: "El ladrón sigue su rutina de siempre, ajeno a cualquier drama cortesano.", e: "Movés el ladrón y robás con normalidad.", w: "neutral" },
  { q: "Un heraldo anuncia noticias sin mayor importancia en la plaza del pueblo.", e: "Movés el ladrón y robás con normalidad.", w: "neutral" },
  { q: "El clima se mantiene templado; ni bendición ni maldición hoy.", e: "Movés el ladrón y robás con normalidad.", w: "neutral" },
  { q: "El molino gira como cada mañana, sin sobresaltos.", e: "Movés el ladrón y robás con normalidad.", w: "neutral" },
  { q: "Los guardias hacen su ronda nocturna sin encontrar nada fuera de lo común.", e: "Movés el ladrón y robás con normalidad.", w: "neutral" },
  { q: "Un trovador canta las mismas baladas de siempre en la taberna.", e: "Movés el ladrón y robás con normalidad.", w: "neutral" },
  { q: "El granjero ordeña sus vacas, ignorante de la política del reino.", e: "Movés el ladrón y robás con normalidad.", w: "neutral" },
  { q: "El herrero forja otra herradura más; jornada tranquila en la fragua.", e: "Movés el ladrón y robás con normalidad.", w: "neutral" },
  { q: "El río sigue su curso; nada cambia en el reino hoy.", e: "Movés el ladrón y robás con normalidad.", w: "neutral" },
  { q: "Una feria de mercaderes extranjeros ofrece trueques generosos, solo por hoy.", e: "Movés el ladrón y robás con normalidad. Además, comerciás 2:1 con el banco este turno, en cualquier recurso.", w: "good" },
  { q: "El gremio de comerciantes, en gesto de buena voluntad (o desesperación por vender), baja sus precios.", e: "Movés el ladrón y robás con normalidad. Además, comerciás 2:1 con el banco este turno, en cualquier recurso.", w: "good" },
  { q: "Una caravana de la Ruta de la Seda hace escala y negocia con inusual generosidad.", e: "Movés el ladrón y robás con normalidad. Además, comerciás 2:1 con el banco este turno, en cualquier recurso.", w: "good" },
  { q: "Un cuervo se posa sobre los dados y los tira al suelo antes de que nadie lea el resultado.", e: "Se vuelve a tirar los dados y se resuelve el nuevo resultado.", w: "neutral" },
  { q: "El destino, indeciso esta vez, pide una segunda oportunidad.", e: "Se vuelve a tirar los dados y se resuelve el nuevo resultado.", w: "neutral" },
  { q: "Los dados ruedan bajo la mesa; nadie llegó a verlos.", e: "Se vuelve a tirar los dados y se resuelve el nuevo resultado.", w: "neutral" },
  { q: "El ladrón, agotado tras noches de trabajo, se toma la jornada libre.", e: "El ladrón no se mueve y nadie roba nada este turno.", w: "neutral" },
  { q: "Una tormenta repentina obliga a todos, incluido el ladrón, a resguardarse.", e: "El ladrón no se mueve y nadie roba nada este turno.", w: "neutral" },
  { q: "El ladrón se queda dormido bajo un árbol; nadie tiene el coraje de despertarlo.", e: "El ladrón no se mueve y nadie roba nada este turno.", w: "neutral" },
  { q: "El pregonero del reino exige, por orden real, que todos muestren sus riquezas en la plaza.", e: "Movés el ladrón y robás con normalidad. Después, todos muestran su mano de recursos al resto durante 10 segundos.", w: "neutral" },
  { q: "El ladrón, confundido por rumores falsos, marcha directo hacia tus propias tierras.", e: "El ladrón se mueve a un hexágono donde tengas al menos 1 poblado o ciudad propia. Si hay otro jugador ahí, le robás. Si sos el único, no robás nada.", w: "risk" },
  { q: "Alguien esparció el rumor de que tus graneros son el escondite perfecto; el ladrón les cree.", e: "El ladrón se mueve a un hexágono donde tengas al menos 1 poblado o ciudad propia. Si hay otro jugador ahí, le robás. Si sos el único, no robás nada.", w: "risk" },
  { q: "Un impuesto de guerra inesperado golpea tus arcas sin previo aviso.", e: "Entregás al banco 1 recurso al azar de tu mano.", w: "bad" },
  { q: "El ladrón, perdido, termina vagando sin rumbo por las tierras yermas.", e: "El ladrón se mueve al desierto. No robás nada este turno.", w: "bad" },
  { q: "Una vieja profecía manda al ladrón lejos de toda civilización, al desierto.", e: "El ladrón se mueve al desierto. No robás nada este turno.", w: "bad" },
  { q: "La Inquisición registra tu carpa y confisca uno de tus pergaminos secretos.", e: "Movés el ladrón y robás con normalidad. Además, si tenés al menos 1 carta de desarrollo sin usar, descartás una a elección.", w: "bad" }
];
