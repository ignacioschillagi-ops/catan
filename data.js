// ============================================================
// CIVILIZACIONES
// Los costos usan iconos de recursos: madera, oveja, mineral, trigo, arcilla
// "image" apunta a la carpeta /images/ - reemplaza esos archivos en GitHub
// (mismo nombre, cualquier imagen) y se sincronizan solas en Vercel.
// ============================================================
const CIVILIZATIONS = [
  {
    id: "incas",
    name: "Incas",
    number: 1,
    color: "var(--incas)",
    image: "images/incas.jpg",
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
    image: "images/azteca.jpg",
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
    image: "images/romanos.jpg",
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
    image: "images/vikingos.jpg",
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
    image: "images/egipcios.jpg",
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
    image: "images/chinos.jpg",
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
// CATALOGO DE REGLAS - fuente unica para Reglas, Catanazo y su impacto
// Agregar una regla nueva = sumar un objeto aca (mas su seccion en el HTML)
// "incompatible" lista los ids de reglas que no se pueden jugar juntas
// ============================================================
const RULES = [
  { id: "dos-doce", title: "2 y 12", desc: "Ambos extremos del dado producen recursos por igual.", seal: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" ><path d=\"M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14\"/><path d=\"M8 8.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0\" fill=\"currentColor\"/><path d=\"M15 8.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0\" fill=\"currentColor\"/><path d=\"M15 15.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0\" fill=\"currentColor\"/><path d=\"M8 15.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0\" fill=\"currentColor\"/></svg>", impact: "bajo", incompatible: [] },
  { id: "ronda-cierre", title: "Ronda de cierre", desc: "Todos juegan un turno más cuando alguien llega a 10 puntos.", seal: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" ><path d=\"M6.5 7h11\"/><path d=\"M6.5 17h11\"/><path d=\"M6 20v-2a6 6 0 1 1 12 0v2a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1\"/><path d=\"M6 4v2a6 6 0 1 0 12 0v-2a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1\"/></svg>", impact: "bajo", incompatible: [] },
  { id: "dados-dobles", title: "Dados dobles", desc: "Sacar un doble te da una tirada extra inmediata.", seal: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" ><path d=\"M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14\"/><path d=\"M8 8.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0\" fill=\"currentColor\"/><path d=\"M15 8.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0\" fill=\"currentColor\"/><path d=\"M15 15.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0\" fill=\"currentColor\"/><path d=\"M8 15.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0\" fill=\"currentColor\"/><path d=\"M11.5 12a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0\" fill=\"currentColor\"/></svg>", impact: "bajo", incompatible: [] },
  { id: "soborno", title: "Soborno al ladrón", desc: "Pagá para reubicar al ladrón antes de que te bloquee.", seal: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" ><path d=\"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0\"/><path d=\"M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1\"/><path d=\"M12 7v10\"/></svg>", impact: "medio", incompatible: [] },
  { id: "maestro-puertos", title: "Maestro de puertos", desc: "Un punto extra por diversificar tus puertos.", seal: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" ><path d=\"M2 20a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1\"/><path d=\"M4 18l-1 -3h18l-1 3\"/><path d=\"M11 12h7l-7 -9v9\"/><path d=\"M8 7l-2 5\"/></svg>", impact: "medio", incompatible: [] },
  { id: "ciudad-expres", title: "Ciudad exprés", desc: "Convertí una carta de Punto de Victoria en una ciudad instantánea.", seal: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" ><path d=\"M15 19v-2a3 3 0 0 0 -6 0v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-14h4v3h3v-3h4v3h3v-3h4v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1\"/><path d=\"M3 11l18 0\"/></svg>", impact: "medio", incompatible: ["catastrofes"] },
  { id: "consecuencias", title: "Consecuencias del 7", desc: "Un mazo de 30 cartas de reino decide qué pasa al sacar 7.", seal: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" ><path d=\"M3.604 7.197l7.138 -3.109a.96 .96 0 0 1 1.27 .527l4.924 11.902a1 1 0 0 1 -.514 1.304l-7.137 3.109a.96 .96 0 0 1 -1.271 -.527l-4.924 -11.903a1 1 0 0 1 .514 -1.304l0 .001\"/><path d=\"M15 4h1a1 1 0 0 1 1 1v3.5\"/><path d=\"M20 6c.264 .112 .52 .217 .768 .315a1 1 0 0 1 .53 1.311l-2.298 5.374\"/></svg>", impact: "alto", incompatible: ["civilizaciones"] },
  { id: "civilizaciones", title: "Civilizaciones", desc: "Seis pueblos, cada uno con una habilidad pasiva y una activa.", seal: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" ><path d=\"M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4l4 -6\"/></svg>", impact: "alto", incompatible: ["consecuencias", "catastrofes"] },
  { id: "asedio", title: "Asedio y defensa", desc: "Atacá y defendé fichas rivales adyacentes a las tuyas.", seal: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" ><path d=\"M21 3v5l-11 9l-4 4l-3 -3l4 -4l9 -11l5 0\"/><path d=\"M5 13l6 6\"/><path d=\"M14.32 17.32l3.68 3.68l3 -3l-3.365 -3.365\"/><path d=\"M10 5.5l-2 -2.5h-5v5l3 2.5\"/></svg>", impact: "alto", incompatible: [] },
  { id: "catastrofes", title: "Catástrofes", desc: "Cinco cartas especiales que reordenan o inhabilitan hexágonos.", seal: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" ><path d=\"M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1\"/><path d=\"M13 14l-2 4l3 0l-2 4\"/></svg>", impact: "alto", incompatible: ["ciudad-expres", "civilizaciones"] }
];

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
