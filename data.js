// ============================================================
// SETS DE RECURSOS - Catan Clásico vs Age of Catan by Joe
// El toggle en Configuración cambia cuál de estos se usa para
// mostrar nombres e íconos en Civilizaciones y Asedio.
// ============================================================
const RESOURCE_SETS = {
  clasico: {
    madera: { name: "madera", nameEn: "wood", icon: "🪵" },
    oveja: { name: "oveja", nameEn: "sheep", icon: "🐑" },
    trigo: { name: "trigo", nameEn: "wheat", icon: "🌾" },
    piedra: { name: "piedra", nameEn: "ore", icon: "🪨" },
    arcilla: { name: "arcilla", nameEn: "brick", icon: "🧱" }
  },
  joe: {
    madera: { name: "árbol", nameEn: "tree", icon: "🌳" },
    oveja: { name: "oveja", nameEn: "sheep", icon: "🦙" },
    trigo: { name: "paja", nameEn: "straw", icon: "🌾" },
    piedra: { name: "piedra", nameEn: "ore", icon: "🪨" },
    arcilla: { name: "oro", nameEn: "gold", icon: "🪙" }
  }
};

// ============================================================
// CIVILIZACIONES
// Los costos usan claves de recurso (madera, oveja, trigo, piedra,
// arcilla) en vez de íconos fijos, para poder mostrar Catan Clásico
// o Age of Catan by Joe segun lo que elija el usuario en Configuración.
// "image" apunta a la carpeta /images/ - reemplaza esos archivos en GitHub
// (mismo nombre, cualquier imagen) y se sincronizan solas en Vercel.
// ============================================================
const CIVILIZATIONS = [
  {
    id: "incas",
    name: "Incas",
    nameEn: "Incas",
    number: 1,
    color: "var(--incas)",
    image: "images/incas.jpg",
    costs: {
      camino: ["oveja", "arcilla"],
      poblado: ["oveja", "arcilla", "madera", "trigo"],
      ciudad: ["oveja", "piedra", "piedra", "trigo", "trigo"],
      cdd: ["oveja", "piedra", "madera"]
    },
    passive: "Si ningún número tuyo produce en un turno, recibís del banco 1 recurso a elección de quien tiró los dados.",
    passiveEn: "If none of your numbers produce on a turn, you get 1 resource of your choice from the bank, chosen by whoever rolled the dice.",
    active: "Robás con el ladrón, y podés reposicionar 1 camino propio (abierto) en otra ubicación válida.",
    activeEn: "You rob with the robber, and can reposition 1 of your own roads (an open one) to another valid location."
  },
  {
    id: "azteca",
    name: "Azteca",
    nameEn: "Aztecs",
    number: 2,
    color: "var(--azteca)",
    image: "images/azteca.jpg",
    costs: {
      camino: ["oveja", "arcilla"],
      poblado: ["oveja", "arcilla", "madera", "trigo"],
      ciudad: ["oveja", "piedra", "piedra", "trigo", "trigo"],
      cdd: ["oveja", "piedra", "madera"]
    },
    passive: "Al construir un asentamiento nuevo, podés sacrificar 1 CDD sin revelar, y recibir a cambio otra CDD nueva.",
    passiveEn: "When you build a new settlement, you can sacrifice 1 dev card without revealing it, and get a new dev card in return.",
    active: "Si el ladrón cae en un hexágono con poblados de dos jugadores, robás 1 carta a cada uno.",
    activeEn: "If the robber lands on a hex with settlements from two players, you steal 1 card from each."
  },
  {
    id: "romanos",
    name: "Romanos",
    nameEn: "Romans",
    number: 3,
    color: "var(--romanos)",
    image: "images/romanos.jpg",
    costs: {
      camino: ["madera", "piedra"],
      poblado: ["madera", "piedra", "trigo", "oveja"],
      ciudad: ["madera", "arcilla", "arcilla", "oveja", "oveja"],
      cdd: ["madera", "arcilla", "trigo"]
    },
    passive: "Al comprar una CDD, podés mirar la carta superior del mazo. Si no te sirve, tomás la siguiente y barajás.",
    passiveEn: "When you buy a dev card, you can peek at the top card of the deck. If you don't want it, take the next one instead and shuffle it back in.",
    active: "Al mover el ladrón, le mirás la mano a un jugador y elegís qué carta robarle.",
    activeEn: "When you move the robber, you look at a player's hand and choose which card to steal."
  },
  {
    id: "vikingos",
    name: "Vikingos",
    nameEn: "Vikings",
    number: 4,
    color: "var(--vikingos)",
    image: "images/vikingos.jpg",
    costs: {
      camino: ["madera", "piedra"],
      poblado: ["madera", "piedra", "trigo", "oveja"],
      ciudad: ["madera", "arcilla", "arcilla", "oveja", "oveja"],
      cdd: ["madera", "arcilla", "trigo"]
    },
    passive: "Con al menos 2 puertos 3:1, comerciás a 2:1 en cualquiera. Tus 2 primeras ciudades solo se construyen en puertos.",
    passiveEn: "With at least 2 3:1 ports, you trade at 2:1 on any of them. Your first 2 cities can only be built on ports.",
    active: "Robás normal. Además, un poblado o ciudad te cuesta 1 recurso menos ese turno.",
    activeEn: "Rob normally. Also, a settlement or city costs you 1 less resource this turn."
  },
  {
    id: "egipcios",
    name: "Egipcios",
    nameEn: "Egyptians",
    number: 5,
    color: "var(--egipcios)",
    image: "images/egipcios.jpg",
    costs: {
      camino: ["trigo", "arcilla"],
      poblado: ["trigo", "arcilla", "oveja", "madera"],
      ciudad: ["trigo", "piedra", "piedra", "madera", "madera"],
      cdd: ["trigo", "piedra", "oveja"]
    },
    passive: "Tus poblados junto a desierto producen +2 recursos.",
    passiveEn: "Your settlements next to a desert produce +2 resources.",
    active: "Robás con el ladrón, o le das 1 recurso al jugador con menos puntos, a cambio recibís 1 CDD del banco.",
    activeEn: "Rob with the robber, or give 1 resource to the player with the fewest points, and get 1 dev card from the bank in return."
  },
  {
    id: "chinos",
    name: "Chinos",
    nameEn: "Chinese",
    number: 6,
    color: "var(--chinos)",
    image: "images/chinos.jpg",
    costs: {
      camino: ["trigo", "arcilla"],
      poblado: ["trigo", "arcilla", "oveja", "madera"],
      ciudad: ["trigo", "piedra", "piedra", "madera", "madera"],
      cdd: ["trigo", "piedra", "oveja"]
    },
    passive: "Tu límite de cartas en mano si toca un 7, es de 9 cartas.",
    passiveEn: "Your hand-size limit when a 7 is rolled is 9 cards.",
    active: "Robás con el ladrón, o comerciás 2:2 con el banco.",
    activeEn: "Rob with the robber, or trade 2:2 with the bank."
  }
];

// ============================================================
// CATALOGO DE REGLAS - fuente unica para Reglas, Catanazo y su impacto
// Agregar una regla nueva = sumar un objeto aca (mas su seccion en el HTML)
// "incompatible" lista los ids de reglas que no se pueden jugar juntas
// ============================================================
const RULES = [
  { id: "dos-doce", title: "2 y 12", titleEn: "2 and 12", desc: "Ambos extremos del dado producen recursos por igual.", descEn: "Both extremes of the dice produce resources equally.", seal: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" ><path d=\"M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14\"/><path d=\"M8 8.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0\" fill=\"currentColor\"/><path d=\"M15 8.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0\" fill=\"currentColor\"/><path d=\"M15 15.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0\" fill=\"currentColor\"/><path d=\"M8 15.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0\" fill=\"currentColor\"/></svg>", impact: "bajo", incompatible: [] },
  { id: "ronda-cierre", title: "Ronda de cierre", titleEn: "Final round", desc: "Todos juegan un turno más cuando alguien llega a 10 puntos.", descEn: "Everyone plays one more turn once someone reaches 10 points.", seal: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" ><path d=\"M6.5 7h11\"/><path d=\"M6.5 17h11\"/><path d=\"M6 20v-2a6 6 0 1 1 12 0v2a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1\"/><path d=\"M6 4v2a6 6 0 1 0 12 0v-2a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1\"/></svg>", impact: "bajo", incompatible: [] },
  { id: "dados-dobles", title: "Dados dobles", titleEn: "Double dice", desc: "Sacar un doble te da una tirada extra inmediata.", descEn: "Rolling doubles gives you an immediate extra roll.", seal: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" ><path d=\"M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14\"/><path d=\"M8 8.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0\" fill=\"currentColor\"/><path d=\"M15 8.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0\" fill=\"currentColor\"/><path d=\"M15 15.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0\" fill=\"currentColor\"/><path d=\"M8 15.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0\" fill=\"currentColor\"/><path d=\"M11.5 12a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0\" fill=\"currentColor\"/></svg>", impact: "bajo", incompatible: [] },
  { id: "soborno", title: "Soborno al ladrón", titleEn: "Bribe the robber", desc: "Pagá para reubicar al ladrón antes de que te bloquee.", descEn: "Pay to relocate the robber before it blocks you.", seal: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" ><path d=\"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0\"/><path d=\"M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1\"/><path d=\"M12 7v10\"/></svg>", impact: "medio", incompatible: [] },
  { id: "maestro-puertos", title: "Maestro de puertos", titleEn: "Port master", desc: "Un punto extra por diversificar tus puertos.", descEn: "An extra point for diversifying your ports.", seal: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" ><path d=\"M2 20a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1\"/><path d=\"M4 18l-1 -3h18l-1 3\"/><path d=\"M11 12h7l-7 -9v9\"/><path d=\"M8 7l-2 5\"/></svg>", impact: "medio", incompatible: [] },
  { id: "ciudad-expres", title: "Ciudad exprés", titleEn: "Express city", desc: "Convertí una carta de Punto de Victoria en una ciudad instantánea.", descEn: "Turn a Victory Point card into an instant city.", seal: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" ><path d=\"M15 19v-2a3 3 0 0 0 -6 0v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-14h4v3h3v-3h4v3h3v-3h4v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1\"/><path d=\"M3 11l18 0\"/></svg>", impact: "medio", incompatible: ["catastrofes"] },
  { id: "consecuencias", title: "Consecuencias del 7", titleEn: "Consequences of the 7", desc: "Un mazo de 30 cartas de reino decide qué pasa al sacar 7.", descEn: "A 30-card kingdom deck decides what happens when you roll a 7.", seal: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" ><path d=\"M3.604 7.197l7.138 -3.109a.96 .96 0 0 1 1.27 .527l4.924 11.902a1 1 0 0 1 -.514 1.304l-7.137 3.109a.96 .96 0 0 1 -1.271 -.527l-4.924 -11.903a1 1 0 0 1 .514 -1.304l0 .001\"/><path d=\"M15 4h1a1 1 0 0 1 1 1v3.5\"/><path d=\"M20 6c.264 .112 .52 .217 .768 .315a1 1 0 0 1 .53 1.311l-2.298 5.374\"/></svg>", impact: "alto", incompatible: ["civilizaciones"] },
  { id: "civilizaciones", title: "Civilizaciones", titleEn: "Civilizations", desc: "Seis pueblos, cada uno con una habilidad pasiva y una activa.", descEn: "Six peoples, each with a passive and an active ability.", seal: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" ><path d=\"M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4l4 -6\"/></svg>", impact: "alto", incompatible: ["consecuencias", "catastrofes"] },
  { id: "asedio", title: "Asedio y defensa", titleEn: "Siege and defense", desc: "Atacá y defendé fichas rivales adyacentes a las tuyas.", descEn: "Attack and defend rival pieces adjacent to yours.", seal: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" ><path d=\"M21 3v5l-11 9l-4 4l-3 -3l4 -4l9 -11l5 0\"/><path d=\"M5 13l6 6\"/><path d=\"M14.32 17.32l3.68 3.68l3 -3l-3.365 -3.365\"/><path d=\"M10 5.5l-2 -2.5h-5v5l3 2.5\"/></svg>", impact: "alto", incompatible: [] },
  { id: "catastrofes", title: "Catástrofes", titleEn: "Catastrophes", desc: "Cinco cartas especiales que reordenan o inhabilitan hexágonos.", descEn: "Five special cards that reshuffle or disable hexes.", seal: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" ><path d=\"M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1\"/><path d=\"M13 14l-2 4l3 0l-2 4\"/></svg>", impact: "alto", incompatible: ["ciudad-expres", "civilizaciones"] }
];

// ============================================================
// MAZO - CONSECUENCIAS DEL 7 (30 cartas)
// w: good | neutral | risk | bad
// ============================================================
const FATE_DECK = [
  { q: "Un mercader itinerante, harto de que lo asalten en el camino, soborna a todo el pueblo con su mercancía.", qEn: "A traveling merchant, tired of getting robbed on the road, bribes the whole village with his goods.", e: "Recibís 2 recursos a elección del banco.", eEn: "Take 2 resources of your choice from the bank.", w: "good" },
  { q: "Los siervos del reino, cansados de ver crecer las arcas del más rico, deciden \u201credistribuir\u201d un poco de riqueza.", qEn: "The kingdom's servants, tired of watching the richest get richer, decide to \u201credistribute\u201d some wealth.", e: "Robás 1 carta al azar a cada jugador con más puntos de victoria visibles que vos.", eEn: "Steal 1 random card from every player with more visible victory points than you.", w: "good" },
  { q: "Un grupo de monjes empedradores, en penitencia por sus pecados, pavimenta un camino sin cobrar nada.", qEn: "A group of paving monks, doing penance for their sins, pave a road free of charge.", e: "Construís 1 camino gratis, sin gastar recursos.", eEn: "Build 1 free road, without spending resources.", w: "good" },
  { q: "Un alquimista exiliado de la corte por sus experimentos fallidos te entrega sus últimos secretos a cambio de refugio.", qEn: "An alchemist exiled from court after his failed experiments hands you his last secrets in exchange for shelter.", e: "Recibís 1 carta de desarrollo gratis del mazo.", eEn: "Take 1 free development card from the deck.", w: "good" },
  { q: "Otro día cualquiera en el feudo: el recaudador de impuestos hace su ronda habitual.", qEn: "Just another day on the fief: the tax collector makes his usual rounds.", e: "Movés el ladrón y robás con normalidad.", eEn: "Move the robber and rob as normal.", w: "neutral" },
  { q: "El ladrón sigue su rutina de siempre, ajeno a cualquier drama cortesano.", qEn: "The robber goes about business as usual, oblivious to any courtly drama.", e: "Movés el ladrón y robás con normalidad.", eEn: "Move the robber and rob as normal.", w: "neutral" },
  { q: "Un heraldo anuncia noticias sin mayor importancia en la plaza del pueblo.", qEn: "A herald announces news of little importance in the town square.", e: "Movés el ladrón y robás con normalidad.", eEn: "Move the robber and rob as normal.", w: "neutral" },
  { q: "El clima se mantiene templado; ni bendición ni maldición hoy.", qEn: "The weather stays mild; neither blessing nor curse today.", e: "Movés el ladrón y robás con normalidad.", eEn: "Move the robber and rob as normal.", w: "neutral" },
  { q: "El molino gira como cada mañana, sin sobresaltos.", qEn: "The mill turns as it does every morning, without incident.", e: "Movés el ladrón y robás con normalidad.", eEn: "Move the robber and rob as normal.", w: "neutral" },
  { q: "Los guardias hacen su ronda nocturna sin encontrar nada fuera de lo común.", qEn: "The guards make their night rounds without finding anything unusual.", e: "Movés el ladrón y robás con normalidad.", eEn: "Move the robber and rob as normal.", w: "neutral" },
  { q: "Un trovador canta las mismas baladas de siempre en la taberna.", qEn: "A troubadour sings the same old ballads at the tavern.", e: "Movés el ladrón y robás con normalidad.", eEn: "Move the robber and rob as normal.", w: "neutral" },
  { q: "El granjero ordeña sus vacas, ignorante de la política del reino.", qEn: "The farmer milks his cows, oblivious to the kingdom's politics.", e: "Movés el ladrón y robás con normalidad.", eEn: "Move the robber and rob as normal.", w: "neutral" },
  { q: "El herrero forja otra herradura más; jornada tranquila en la fragua.", qEn: "The blacksmith forges another horseshoe; a quiet day at the forge.", e: "Movés el ladrón y robás con normalidad.", eEn: "Move the robber and rob as normal.", w: "neutral" },
  { q: "El río sigue su curso; nada cambia en el reino hoy.", qEn: "The river follows its course; nothing changes in the kingdom today.", e: "Movés el ladrón y robás con normalidad.", eEn: "Move the robber and rob as normal.", w: "neutral" },
  { q: "Una feria de mercaderes extranjeros ofrece trueques generosos, solo por hoy.", qEn: "A fair of foreign merchants offers generous trades, just for today.", e: "Movés el ladrón y robás con normalidad. Además, comerciás 2:1 con el banco este turno, en cualquier recurso.", eEn: "Move the robber and rob as normal. Also, trade 2:1 with the bank this turn, in any resource.", w: "good" },
  { q: "El gremio de comerciantes, en gesto de buena voluntad (o desesperación por vender), baja sus precios.", qEn: "The merchants' guild, out of goodwill (or desperation to sell), lowers its prices.", e: "Movés el ladrón y robás con normalidad. Además, comerciás 2:1 con el banco este turno, en cualquier recurso.", eEn: "Move the robber and rob as normal. Also, trade 2:1 with the bank this turn, in any resource.", w: "good" },
  { q: "Una caravana de la Ruta de la Seda hace escala y negocia con inusual generosidad.", qEn: "A caravan from the Silk Road stops by and trades with unusual generosity.", e: "Movés el ladrón y robás con normalidad. Además, comerciás 2:1 con el banco este turno, en cualquier recurso.", eEn: "Move the robber and rob as normal. Also, trade 2:1 with the bank this turn, in any resource.", w: "good" },
  { q: "Un cuervo se posa sobre los dados y los tira al suelo antes de que nadie lea el resultado.", qEn: "A crow lands on the dice and knocks them to the floor before anyone can read the result.", e: "Se vuelve a tirar los dados y se resuelve el nuevo resultado.", eEn: "Roll the dice again and resolve the new result.", w: "neutral" },
  { q: "El destino, indeciso esta vez, pide una segunda oportunidad.", qEn: "Fate, undecided this time, asks for a second chance.", e: "Se vuelve a tirar los dados y se resuelve el nuevo resultado.", eEn: "Roll the dice again and resolve the new result.", w: "neutral" },
  { q: "Los dados ruedan bajo la mesa; nadie llegó a verlos.", qEn: "The dice roll under the table; nobody got to see them.", e: "Se vuelve a tirar los dados y se resuelve el nuevo resultado.", eEn: "Roll the dice again and resolve the new result.", w: "neutral" },
  { q: "El ladrón, agotado tras noches de trabajo, se toma la jornada libre.", qEn: "The robber, worn out from working nights, takes the day off.", e: "El ladrón no se mueve y nadie roba nada este turno.", eEn: "The robber doesn't move and nobody robs anything this turn.", w: "neutral" },
  { q: "Una tormenta repentina obliga a todos, incluido el ladrón, a resguardarse.", qEn: "A sudden storm forces everyone, including the robber, to take shelter.", e: "El ladrón no se mueve y nadie roba nada este turno.", eEn: "The robber doesn't move and nobody robs anything this turn.", w: "neutral" },
  { q: "El ladrón se queda dormido bajo un árbol; nadie tiene el coraje de despertarlo.", qEn: "The robber falls asleep under a tree; nobody has the nerve to wake him.", e: "El ladrón no se mueve y nadie roba nada este turno.", eEn: "The robber doesn't move and nobody robs anything this turn.", w: "neutral" },
  { q: "El pregonero del reino exige, por orden real, que todos muestren sus riquezas en la plaza.", qEn: "The kingdom's town crier demands, by royal order, that everyone show their wealth in the square.", e: "Movés el ladrón y robás con normalidad. Después, todos muestran su mano de recursos al resto durante 10 segundos.", eEn: "Move the robber and rob as normal. Afterward, everyone shows their resource hand to the rest for 10 seconds.", w: "neutral" },
  { q: "El ladrón, confundido por rumores falsos, marcha directo hacia tus propias tierras.", qEn: "The robber, misled by false rumors, marches straight for your own lands.", e: "El ladrón se mueve a un hexágono donde tengas al menos 1 poblado o ciudad propia. Si hay otro jugador ahí, le robás. Si sos el único, no robás nada.", eEn: "The robber moves to a hex where you have at least 1 settlement or city. If another player is there too, you rob them. If you're the only one, you rob nothing.", w: "risk" },
  { q: "Alguien esparció el rumor de que tus graneros son el escondite perfecto; el ladrón les cree.", qEn: "Someone spread the rumor that your granaries are the perfect hideout; the robber believes it.", e: "El ladrón se mueve a un hexágono donde tengas al menos 1 poblado o ciudad propia. Si hay otro jugador ahí, le robás. Si sos el único, no robás nada.", eEn: "The robber moves to a hex where you have at least 1 settlement or city. If another player is there too, you rob them. If you're the only one, you rob nothing.", w: "risk" },
  { q: "Un impuesto de guerra inesperado golpea tus arcas sin previo aviso.", qEn: "An unexpected war tax hits your coffers without warning.", e: "Entregás al banco 1 recurso al azar de tu mano.", eEn: "Give the bank 1 random resource from your hand.", w: "bad" },
  { q: "El ladrón, perdido, termina vagando sin rumbo por las tierras yermas.", qEn: "The robber, lost, ends up wandering aimlessly through the barren lands.", e: "El ladrón se mueve al desierto. No robás nada este turno.", eEn: "The robber moves to the desert. You rob nothing this turn.", w: "bad" },
  { q: "Una vieja profecía manda al ladrón lejos de toda civilización, al desierto.", qEn: "An old prophecy sends the robber far from all civilization, to the desert.", e: "El ladrón se mueve al desierto. No robás nada este turno.", eEn: "The robber moves to the desert. You rob nothing this turn.", w: "bad" },
  { q: "La Inquisición registra tu carpa y confisca uno de tus pergaminos secretos.", qEn: "The Inquisition searches your tent and confiscates one of your secret scrolls.", e: "Movés el ladrón y robás con normalidad. Además, si tenés al menos 1 carta de desarrollo sin usar, descartás una a elección.", eEn: "Move the robber and rob as normal. Also, if you have at least 1 unused development card, discard one of your choice.", w: "bad" }
];

// ============================================================
// I18N - diccionario de textos fijos de la interfaz (español/inglés)
// El toggle de idioma en Configuración cambia cual de estos se usa.
// El contenido de las reglas/civilizaciones/mazo vive en los objetos
// de arriba (campo "X" en español, campo "XEn" en inglés).
// ============================================================
const I18N = {
  es: {
    splashText: "Cargando reglas de la casa…",
    topbarSub: "World of Catan — reglas de la casa",
    tabReglas: "Reglas",
    tabPartida: "Catanazo",
    tabConfig: "Configuración",

    reglasEyebrow: "Compendio de variantes",
    reglasTitle: "Elegí tus reglas",
    reglasLede: "Tocá una regla para leerla completa, o sumala directo con el botón +. Podés jugarlas por separado, combinando las que quieras.",
    impactoBajo: "Impacto bajo",
    impactoMedio: "Impacto medio",
    impactoAlto: "Impacto alto",
    noCompatibleCon: "No compatible con",

    partidaLede: "Las reglas que sumaste para esta partida, de menor a mayor impacto. Usá los sellos de la derecha para saltar directo a cada una.",
    partidaDividerLabel: "Tu Catanazo",
    partidaEmptyMsg: "Todavía no armaste tu Catanazo.<br>Andá a Reglas y sumá las que quieras jugar.",
    partidaEmptyBtn: "Ver reglas",

    configEyebrow: "Ajustes",
    configTitle: "Configuración",
    langPanelTitle: "Idioma",
    langPanelNote: "Cambia el idioma de todas las reglas y de la interfaz.",
    rulesetPanelTitle: "Versión del juego",
    rulesetPanelNote: "Cambia los nombres e íconos de recursos que aparecen en Civilizaciones y Asedio, para que coincidan con tu edición física.",
    rulesetClasico: "Catan Clásico",
    btnPdf: "⬇ Bajar PDF para imprimir",
    btnVaciar: "Vaciar Catanazo",
    btnShare: "📤 Compartir con amigos",
    btnShareCopied: "✓ Enlace copiado",
    shareTitle: "World of Catan — reglas de la casa",
    shareText: "Mirá esta app con reglas caseras para Catan que armé.",
    confirmVaciar: "¿Vaciar todas las reglas de tu Catanazo?",
    installTitle: "¿Cómo instalo la app?",
    installIos: "En iPhone (Safari)",
    installIos1: 'Tocá el botón de compartir <span class="install-icon">⬆</span> en la barra inferior.',
    installIos2: 'Elegí "Agregar a pantalla de inicio".',
    installIos3: 'Confirmá el nombre y tocá "Agregar".',
    installAndroid: "En Android (Chrome)",
    installAndroid1: 'Tocá el menú <span class="install-icon">⋮</span> arriba a la derecha.',
    installAndroid2: 'Elegí "Instalar app" o "Agregar a pantalla de inicio".',
    installAndroid3: 'Confirmá tocando "Instalar".',
    installNote: "Una vez instalada, el ícono queda en tu pantalla de inicio como cualquier otra app, sin necesidad de abrir el navegador.",
    footMsg: '¿Ideas o comentarios sobre las reglas?<br>Escribime.',

    doceEyebrow: "Regla simple",
    doceLead: "Si el resultado de los dados es <strong>2</strong> o <strong>12</strong>, ambos números producen recursos. Estos números son equivalentes en valor para efectos del juego.",

    sobornoEyebrow: "Extorsionando al ladrón",
    sobornoH: "Mover al ladrón",
    sobornoLead: "Si el ladrón está bloqueando uno de tus números, durante la etapa de construcción podés pagar <strong>2 recursos equivalentes</strong> al hexágono obstruido, para moverlo a un hexágono adyacente al que ocupa.",
    sobornoCalloutTag: "Importante",
    sobornoCalloutText: "Al moverlo de esta manera, no podés robar recursos de los jugadores que ocupen el nuevo hexágono, como lo harías con un 7.",

    rondaEyebrow: "Cierre de partida",
    rondaLead: "Cuando un jugador alcanza los 10 puntos de victoria, la partida no termina en el acto: todos los demás jugadores completan un turno más antes de declarar ganador.",
    rondaCalloutTag: "Empate",
    rondaCalloutText: "Si más de un jugador llega a 10 puntos o más durante esta ronda final, gana quien tenga más puntos de victoria. Si el empate persiste, gana quien lo haya alcanzado primero en el orden de turno.",

    doblesEyebrow: "Regla simple",
    doblesLead: "Si el resultado de los dados es doble (1-1, 2-2, 3-3, 4-4, 5-5 o 6-6), se resuelve esa producción con normalidad y se tira de nuevo de inmediato, sumando el resultado nuevo aparte.",
    doblesCalloutTag: "Importante",
    doblesCalloutText: "Si la segunda tirada también resulta en un 7, se resuelve como cualquier 7 antes de continuar el turno.",

    maestroEyebrow: "Puntuación final",
    maestroLead: "Al final de la partida, el jugador con asentamientos en la mayor variedad de tipos de puerto distintos recibe 1 punto de victoria extra.",
    maestroList1: "Se cuenta variedad de tipos de puerto (por ejemplo: 2:1 madera, 2:1 trigo, 3:1 genérico), no la cantidad total de puertos.",
    maestroList2: "En caso de empate en la cantidad de tipos distintos, ningún jugador recibe el punto.",

    expresEyebrow: "Construcción",
    expresLead: "Al construir un poblado nuevo, podés descartar una carta de desarrollo de Punto de Victoria sin revelarla y subirlo directo a ciudad, sin pagar el costo normal de ciudad.",
    expresCalloutTag: "Importante",
    expresCalloutText: "Esto reemplaza el pago de la ciudad; el poblado igual debe pagarse con normalidad al construirse primero.",

    consecEyebrow: "El reino decide",
    consecLede: "Al sacar un 7, además de mover el ladrón con normalidad, se puede robar una carta del mazo del reino para ver qué sucede este turno. El ladrón se mueve igual, salvo que la carta indique lo contrario.",
    deckCountTpl: "Carta {n} de {total}",
    btnReset: "↺ reiniciar mazo",
    fateCardEyebrow: "Carta del reino",
    fateQuoteInitial: "Tocá el sello para tirar el 7.",
    drawBtn: "Tirar el 7",
    deckNote: "El mazo se agotó — se barajó de nuevo.",
    tagGood: "favorable",
    tagNeutral: "neutro",
    tagRisk: "riesgo",
    tagBad: "desfavorable",

    civEyebrow: "Seis pueblos, seis caminos",
    civLede: "Existen 6 civilizaciones distintas, con 3 tipos distintos de construcción. Cada una posee dos habilidades: una pasiva y otra activa.",
    civPasivaTag: "Habilidad pasiva",
    civPasivaText: "Efecto que está siempre activo durante toda la partida, sin necesidad de declararlo ni gastar nada para usarlo. Se aplica automáticamente cuando se cumple su condición.",
    civActivaTag: "Habilidad activa (con 7)",
    civActivaText: "Efecto que se dispara únicamente cuando el jugador de esa civilización obtiene un 7. No es automática: el jugador decide si la usa y en qué orden respecto a robar la carta.",
    civDadoNote: "Cada jugador lanza un dado para saber qué civilización utilizará. Si el número ya salió, se vuelve a lanzar.",
    civPasivaCardTag: "Pasiva",
    civActivaCardTag: "Con 7",
    costCamino: "Camino",
    costPoblado: "Poblado",
    costCiudad: "Ciudad",
    costCdd: "CDD",
    civFavAdd: "Marcar {name} como favorita",
    civFavRemove: "Quitar {name} de favoritas",

    asedioEyebrow: "Asedio a otro jugador",
    knightLabel: "Carta de Caballero",
    knightAlt: "Ejemplo de carta de Caballero",
    asediandoH: "Asediando al enemigo",
    asedioList1: "Si tenés un camino, poblado o ciudad adyacente a una ficha de otro jugador, podés declarar un asedio sobre ella como <strong>última acción de tu turno</strong>.",
    asedioList2: "Costo: <strong>1 carta de Caballero</strong> + los mismos recursos que se usaron para construir esa ficha. El Caballero sigue la regla estándar de cartas de desarrollo: si lo comprás este turno, recién podés jugarlo en tu próximo turno.",
    asedioList3: "No hay límite de cantidad de asedios por turno, siempre que tengas fichas rivales adyacentes y los recursos para pagarlos.",
    asedioList4: "Un jugador con <strong>7 o más puntos de victoria a la vista</strong> no puede declarar ningún asedio (aunque sí puede ser objetivo de uno).",
    asedioList5: "Solo puede haber <strong>un asedio activo por ficha</strong> a la vez.",
    asedioList6: "La ficha asediada se marca con una ficha de asedio y no produce recursos mientras dure, sin importar si sale su número en el dado.",
    costTh1: "Ficha",
    costTh2: "Costo atacar",
    costTh3: "Costo defender",
    caballero: "Caballero",
    recursos: "recursos",
    asedioAtkCamino: "1 Caballero ⚔️ + 2 recursos 🚥",
    asedioAtkPoblado: "1 Caballero ⚔️ + 4 recursos 🛖",
    asedioAtkCiudad: "1 Caballero ⚔️ + 5 recursos 🏯",
    defensaH: "Defensa del asedio",
    defensaText: "Solo el jugador atacado puede resistir, como <strong>última acción de su turno</strong>, pagando el costo de defensa correspondiente. Si paga, retira la ficha de asedio y la pieza sigue en pie con normalidad.",
    resolucionH: "Resolución",
    resolucionText: "Si el asedio no fue defendido, se resuelve al comienzo de la vuelta siguiente del atacante (una vuelta completa de la mesa), <strong>justo antes de tirar los dados</strong>. Un poblado o camino destruido vuelve a la mano del jugador; una ciudad se degrada a poblado y se devuelve.",
    asedioCalloutTag: "Importante",
    asedioCalloutText: "La ficha sigue valiendo puntos mientras siga en el tablero. La carta de Caballero utilizada no afecta al ladrón.",

    catEyebrow: "Carta de catástrofe + 1 PV",
    catLede: "Cinco cartas especiales mezcladas entre las cartas de desarrollo. Cada una afecta al azar a un grupo de hexágonos del tablero: algunas reordenan sus números, otras los dejan sin producir por un tiempo.",
    tornadoName: "Tornado", tornadoBuilding: "Ayuntamiento", tornadoDesc: "Todos los números se barajan y se colocan de manera aleatoria sobre los hexágonos.",
    sequiaName: "Sequía", sequiaBuilding: "Iglesia", sequiaDesc: "Los números con ovejas se voltean y no producen recursos hasta que vuelva a ser el turno del jugador que jugó la carta.",
    tsunamiName: "Tsunami", tsunamiBuilding: "Biblioteca", tsunamiDesc: "Los números con ciudades costeras se barajan y se colocan de manera aleatoria sobre los hexágonos.",
    incendioName: "Incendio", incendioBuilding: "Mercado", incendioDesc: "Los números con trigos y maderas se voltean y no producen recursos hasta que vuelva a ser el turno del jugador que jugó la carta.",
    terremotoName: "Terremoto", terremotoBuilding: "Universidad", terremotoDesc: "Los números con piedras y barros se barajan y se colocan de manera aleatoria sobre los hexágonos.",
    catReglasH: "Reglas generales",
    catList1: "Todas las cartas de catástrofe devuelven el ladrón al desierto.",
    catList2: "Las cartas de Catástrofe se encuentran entre las cartas de desarrollo: son las cartas de 1 punto de victoria (se puede escribir, pegar o imprimir el nombre de la catástrofe sobre el diseño de esa carta).",
    catList3: "Si un jugador compra 2 o más CDD en el mismo turno y obtiene dos o más cartas de Catástrofe, se resuelven en el orden de compra.",
    catCalloutTag: "Obligatorio",
    catCalloutText: "Si un jugador obtiene esta carta, debe revelarla inmediatamente. Si lo hace, sigue valiendo 1 PV; si no la revela, el punto es inválido.",

    ariaReglas: "Reglas",
    ariaPartida: "Catanazo",
    ariaConfig: "Configuración",
    ariaCerrar: "Cerrar",

    btnPlayRule: "+ Jugar regla",
    btnRemoveRule: "✕ Quitar regla",
    btnBackRules: "← Volver a todas las reglas",
    incompatibleTag: "Incompatible",
    conflictTag: "Conflicto",
    compatText: "Esta regla no es compatible con <strong>{names}</strong>. Se juegan por separado, no en la misma partida.",
    compatConflictText: " Ya tenés <strong>{names}</strong> en tu Catanazo — quitala primero si querés sumar esta."
  },
  en: {
    splashText: "Loading house rules…",
    topbarSub: "World of Catan — house rules",
    tabReglas: "Rules",
    tabPartida: "Catanazo",
    tabConfig: "Settings",

    reglasEyebrow: "Variant compendium",
    reglasTitle: "Pick your rules",
    reglasLede: "Tap a rule to read it in full, or add it straight away with the + button. Play them separately, mixing whichever ones you like.",
    impactoBajo: "Low impact",
    impactoMedio: "Medium impact",
    impactoAlto: "High impact",
    noCompatibleCon: "Not compatible with",

    partidaLede: "The rules you've added for this game, from lowest to highest impact. Use the seals on the right to jump straight to each one.",
    partidaDividerLabel: "Your Catanazo",
    partidaEmptyMsg: "You haven't built your Catanazo yet.<br>Go to Rules and add the ones you want to play.",
    partidaEmptyBtn: "See rules",

    configEyebrow: "Settings",
    configTitle: "Settings",
    langPanelTitle: "Language",
    langPanelNote: "Changes the language of every rule and the interface.",
    rulesetPanelTitle: "Game edition",
    rulesetPanelNote: "Changes the resource names and icons shown in Civilizations and Siege, to match your physical edition.",
    rulesetClasico: "Classic Catan",
    btnPdf: "⬇ Download PDF to print",
    btnVaciar: "Empty Catanazo",
    btnShare: "📤 Share with friends",
    btnShareCopied: "✓ Link copied",
    shareTitle: "World of Catan — house rules",
    shareText: "Check out this Catan house-rules app I put together.",
    confirmVaciar: "Empty every rule from your Catanazo?",
    installTitle: "How do I install the app?",
    installIos: "On iPhone (Safari)",
    installIos1: 'Tap the share button <span class="install-icon">⬆</span> in the bottom bar.',
    installIos2: 'Choose "Add to Home Screen".',
    installIos3: 'Confirm the name and tap "Add".',
    installAndroid: "On Android (Chrome)",
    installAndroid1: 'Tap the menu <span class="install-icon">⋮</span> in the top right.',
    installAndroid2: 'Choose "Install app" or "Add to Home screen".',
    installAndroid3: 'Confirm by tapping "Install".',
    installNote: "Once installed, the icon sits on your home screen like any other app, no need to open the browser.",
    footMsg: 'Ideas or comments about the rules?<br>Write to me.',

    doceEyebrow: "Simple rule",
    doceLead: "If the dice result is <strong>2</strong> or <strong>12</strong>, both numbers produce resources. These numbers are treated as equivalent for game purposes.",

    sobornoEyebrow: "Bribing the robber",
    sobornoH: "Moving the robber",
    sobornoLead: "If the robber is blocking one of your numbers, during the build phase you can pay <strong>2 matching resources</strong> for the blocked hex, to move it to an adjacent hex.",
    sobornoCalloutTag: "Important",
    sobornoCalloutText: "Moving it this way, you can't steal resources from players on the new hex, like you would with a 7.",

    rondaEyebrow: "End of game",
    rondaLead: "When a player reaches 10 victory points, the game doesn't end immediately: every other player completes one more turn before a winner is declared.",
    rondaCalloutTag: "Tie",
    rondaCalloutText: "If more than one player reaches 10 or more points during this final round, whoever has the most victory points wins. If the tie persists, whoever reached it first in turn order wins.",

    doblesEyebrow: "Simple rule",
    doblesLead: "If the dice result is doubles (1-1, 2-2, 3-3, 4-4, 5-5 or 6-6), that production resolves as normal and you roll again immediately, resolving the new result separately.",
    doblesCalloutTag: "Important",
    doblesCalloutText: "If the second roll is also a 7, it resolves like any other 7 before continuing the turn.",

    maestroEyebrow: "Final scoring",
    maestroLead: "At the end of the game, the player with settlements on the widest variety of different port types gets 1 extra victory point.",
    maestroList1: "Counts variety of port types (e.g.: 2:1 wood, 2:1 wheat, generic 3:1), not the total number of ports.",
    maestroList2: "In case of a tie in the number of different types, no player gets the point.",

    expresEyebrow: "Building",
    expresLead: "When you build a new settlement, you can discard a Victory Point development card without revealing it and upgrade it straight to a city, without paying the normal city cost.",
    expresCalloutTag: "Important",
    expresCalloutText: "This replaces the city's payment; the settlement must still be paid for normally when it's built.",

    consecEyebrow: "The kingdom decides",
    consecLede: "When you roll a 7, besides moving the robber as normal, you can draw a card from the kingdom deck to see what happens this turn. The robber still moves, unless the card says otherwise.",
    deckCountTpl: "Card {n} of {total}",
    btnReset: "↺ reshuffle deck",
    fateCardEyebrow: "Card of the realm",
    fateQuoteInitial: "Tap the seal to roll the 7.",
    drawBtn: "Roll the 7",
    deckNote: "The deck ran out — it was reshuffled.",
    tagGood: "favorable",
    tagNeutral: "neutral",
    tagRisk: "risky",
    tagBad: "unfavorable",

    civEyebrow: "Six peoples, six paths",
    civLede: "There are 6 different civilizations, with 3 distinct construction types. Each has two abilities: one passive, one active.",
    civPasivaTag: "Passive ability",
    civPasivaText: "An effect that's always active throughout the game, with no need to declare it or spend anything to use it. It applies automatically whenever its condition is met.",
    civActivaTag: "Active ability (on 7)",
    civActivaText: "An effect that only triggers when that civilization's player rolls a 7. It's not automatic: the player decides whether to use it and in what order relative to robbing.",
    civDadoNote: "Each player rolls a die to find out which civilization they'll use. If the number already came up, they roll again.",
    civPasivaCardTag: "Passive",
    civActivaCardTag: "On 7",
    costCamino: "Road",
    costPoblado: "Settlement",
    costCiudad: "City",
    costCdd: "Dev card",
    civFavAdd: "Mark {name} as favorite",
    civFavRemove: "Remove {name} from favorites",

    asedioEyebrow: "Siege another player",
    knightLabel: "Knight card",
    knightAlt: "Example Knight card",
    asediandoH: "Besieging the enemy",
    asedioList1: "If you have a road, settlement, or city adjacent to another player's piece, you can declare a siege on it as the <strong>last action of your turn</strong>.",
    asedioList2: "Cost: <strong>1 Knight card</strong> + the same resources used to build that piece. The Knight follows the standard development-card rule: if you buy it this turn, you can only play it starting next turn.",
    asedioList3: "There's no limit on how many sieges you can declare per turn, as long as you have adjacent rival pieces and the resources to pay for them.",
    asedioList4: "A player with <strong>7 or more visible victory points</strong> can't declare a siege (though they can still be targeted by one).",
    asedioList5: "Only <strong>one active siege per piece</strong> at a time.",
    asedioList6: "The besieged piece is marked with a siege token and produces no resources while under siege, regardless of whether its number is rolled.",
    costTh1: "Piece",
    costTh2: "Attack cost",
    costTh3: "Defense cost",
    caballero: "Knight",
    recursos: "resources",
    asedioAtkCamino: "1 Knight ⚔️ + 2 resources 🚥",
    asedioAtkPoblado: "1 Knight ⚔️ + 4 resources 🛖",
    asedioAtkCiudad: "1 Knight ⚔️ + 5 resources 🏯",
    defensaH: "Defending a siege",
    defensaText: "Only the attacked player can resist, as the <strong>last action of their turn</strong>, by paying the matching defense cost. If they pay, the siege token is removed and the piece stands as normal.",
    resolucionH: "Resolution",
    resolucionText: "If the siege wasn't defended, it resolves at the start of the attacker's next turn (a full lap of the table), <strong>right before rolling the dice</strong>. A destroyed settlement or road returns to the player's hand; a city downgrades to a settlement and is returned.",
    asedioCalloutTag: "Important",
    asedioCalloutText: "The piece still counts for points as long as it's on the board. The Knight card used doesn't affect the robber.",

    catEyebrow: "Catastrophe card + 1 VP",
    catLede: "Five special cards mixed into the development cards. Each one randomly affects a group of hexes on the board: some reshuffle their numbers, others stop them from producing for a while.",
    tornadoName: "Tornado", tornadoBuilding: "Town Hall", tornadoDesc: "All numbers are shuffled and placed randomly across the hexes.",
    sequiaName: "Drought", sequiaBuilding: "Church", sequiaDesc: "Numbers with sheep are flipped and stop producing resources until it's the turn of the player who played the card again.",
    tsunamiName: "Tsunami", tsunamiBuilding: "Library", tsunamiDesc: "Numbers with coastal cities are shuffled and placed randomly across the hexes.",
    incendioName: "Fire", incendioBuilding: "Market", incendioDesc: "Numbers with wheat and wood are flipped and stop producing resources until it's the turn of the player who played the card again.",
    terremotoName: "Earthquake", terremotoBuilding: "University", terremotoDesc: "Numbers with ore and brick are shuffled and placed randomly across the hexes.",
    catReglasH: "General rules",
    catList1: "All catastrophe cards return the robber to the desert.",
    catList2: "Catastrophe cards are mixed among the development cards: they're the 1-victory-point cards (you can write, stick, or print the catastrophe's name onto that card's design).",
    catList3: "If a player buys 2 or more dev cards in the same turn and gets two or more Catastrophe cards, they resolve in purchase order.",
    catCalloutTag: "Mandatory",
    catCalloutText: "If a player gets this card, they must reveal it immediately. If they do, it's still worth 1 VP; if they don't reveal it, the point is invalid.",

    ariaReglas: "Rules",
    ariaPartida: "Catanazo",
    ariaConfig: "Settings",
    ariaCerrar: "Close",

    btnPlayRule: "+ Add rule",
    btnRemoveRule: "✕ Remove rule",
    btnBackRules: "← Back to all rules",
    incompatibleTag: "Incompatible",
    conflictTag: "Conflict",
    compatText: "This rule isn't compatible with <strong>{names}</strong>. They're played separately, not in the same game.",
    compatConflictText: " You already have <strong>{names}</strong> in your Catanazo — remove it first if you want to add this one."
  }
};
