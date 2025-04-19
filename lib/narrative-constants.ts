// narrative-constants.ts - Common constants for narrative settings

// Literary Styles
export const KNOWN_STYLES = ["diderot", "balzac", "proust", "camus"];
export const STYLE_DESCRIPTIONS: Record<string, string> = {
  diderot: "Inspiré du XVIIIe siècle, avec des digressions, une adresse au lecteur et un ton espiègle.",
  balzac: "Réaliste du XIXe siècle, avec des descriptions détaillées, un souci de la documentation sociale.",
  proust: "Phrases longues, introspection, exploration de la mémoire involontaire et du temps.",
  camus: "Style sobre, phrases courtes, ton neutre ou détaché, réflexions existentialistes.",
};

// Narrator Personality / Tone
export const KNOWN_PERSONALITIES = ["playful", "philosophical", "ironic", "dramatic", "absurd", "neutral"];
export const PERSONALITY_DESCRIPTIONS: Record<string, string> = {
  playful: "Espiègle et joueur, avec un humour léger et des clins d'œil.",
  philosophical: "Réfléchi, contemplatif, pose des questions existentielles ou morales.",
  ironic: "Ton détaché, critique implicite, décalage entre le dit et le non-dit.",
  dramatic: "Intense, met l'accent sur les conflits et les émotions fortes, sens du théâtral.",
  absurd: "Décalé, illogique, souligne le non-sens de l'existence ou des situations.",
  neutral: "Objectif, factuel, s'efface pour laisser parler les faits ou les personnages.",
};
export const PERSONALITY_DISPLAY_NAMES: Record<string, string> = {
  playful: "Espiègle",
  philosophical: "Philosophique",
  ironic: "Ironique",
  dramatic: "Dramatique",
  absurd: "Absurde",
  neutral: "Neutre / Objectif"
};

// Narrative Voice: Relation to the Story (Who speaks?)
export const KNOWN_RELATIONS = ["heterodiegetic", "homodiegetic", "autodiegetic"];
export const NARRATOR_RELATION_DESCRIPTIONS: Record<string, string> = {
  heterodiegetic: "Le narrateur est extérieur à l'histoire qu'il raconte. Il n'y participe pas comme personnage.",
  homodiegetic: "Le narrateur est un personnage à l'intérieur de l'histoire qu'il raconte (principal ou secondaire).",
  autodiegetic: "Cas spécifique d'homodiégétique : le narrateur est le héros/protagoniste de sa propre histoire.",
};
export const NARRATOR_RELATION_DISPLAY_NAMES: Record<string, string> = {
  heterodiegetic: "Hétérodiégétique (Extérieur)",
  homodiegetic: "Homodiégétique (Personnage)",
  autodiegetic: "Autodiégétique (Protagoniste)",
};

// Narrative Perspective: Focalization (Who sees?)
export const KNOWN_FOCALIZATIONS = ["zero", "internal", "external"];
export const FOCALIZATION_DESCRIPTIONS: Record<string, string> = {
  zero: "Focalisation zéro (Omniscience). Le narrateur sait tout, plus que n'importe quel personnage (pensées, sentiments, passé, futur).",
  internal: "Focalisation interne. Le récit est filtré par la conscience d'un personnage. Le narrateur ne dit que ce que ce personnage sait, pense ou perçoit.",
  external: "Focalisation externe. Le narrateur est un observateur neutre, comme une caméra. Il décrit actions et paroles mais n'accède pas aux pensées des personnages. Il en sait moins que les personnages.",
};
export const FOCALIZATION_DISPLAY_NAMES: Record<string, string> = {
  zero: "Zéro / Omnisciente",
  internal: "Interne",
  external: "Externe",
};

// Narrative Person (Grammatical Choice)
export const KNOWN_PERSONS = ["first_person", "third_person", "second_person"];
export const PERSON_DESCRIPTIONS: Record<string, string> = {
  first_person: "Narration à la première personne ('Je'). Souvent liée à un narrateur homodiégétique ou autodiégétique.",
  third_person: "Narration à la troisième personne ('Il', 'Elle', 'Ils', 'Elles'). Souvent liée à un narrateur hétérodiégétique, mais peut aussi être utilisée avec une focalisation interne sur un personnage.",
  second_person: "Narration à la deuxième personne ('Tu', 'Vous'). Plus rare, crée une interpellation directe du lecteur ou du personnage.",
};
export const PERSON_DISPLAY_NAMES: Record<string, string> = {
  first_person: "Première personne ('Je')",
  third_person: "Troisième personne ('Il/Elle')",
  second_person: "Deuxième personne ('Tu/Vous')",
};

// Narrative Tense (Primary tense for the narration)
export const KNOWN_TENSES = ["past", "present"];
export const TENSE_DESCRIPTIONS: Record<string, string> = {
  past: "Narration au temps du passé (passé simple, imparfait principalement). Crée une distance temporelle, récit rétrospectif classique.",
  present: "Narration au temps présent (présent de l'indicatif). Crée un effet d'immédiateté, le lecteur découvre les événements en même temps qu'ils semblent se dérouler.",
};
export const TENSE_DISPLAY_NAMES: Record<string, string> = {
  past: "Passé (classique)",
  present: "Présent (immédiateté)",
};

// Literary Genres (Expanded list for narrative fiction)
export const KNOWN_GENRES = [
  "conte_philosophique", "roman_realiste", "roman_naturaliste", "roman_historique",
  "roman_epistolaire", "roman_apprentissage", "science_fiction", "fantasy", "fantastique",
  "policier", "thriller", "nouvelle", "autobiographie", "memoires"
];
export const GENRE_DESCRIPTIONS: Record<string, string> = {
  conte_philosophique: "Récit bref visant à illustrer une idée philosophique, souvent avec ironie et personnages stylisés.",
  roman_realiste: "Vise à représenter la réalité sociale, historique et humaine de manière fidèle et détaillée.",
  roman_naturaliste: "Pousse le réalisme plus loin, influence du déterminisme social et biologique, souvent milieux populaires.",
  roman_historique: "Intrigue se déroulant dans un contexte historique passé réel, avec mélange de personnages fictifs et réels.",
  roman_epistolaire: "Récit composé de lettres échangées entre personnages.",
  roman_apprentissage: "Suit l'évolution et la formation (Bildung) d'un personnage principal, souvent de l'enfance à l'âge adulte.",
  science_fiction: "Explore des thèmes liés à la science, la technologie, le futur, l'espace, les sociétés alternatives.",
  fantasy: "Met en scène des éléments surnaturels acceptés comme normaux dans l'univers du récit (magie, créatures...).",
  fantastique: "Intrusion du surnaturel dans un cadre réaliste, provoquant le doute et l'hésitation chez le personnage et le lecteur.",
  policier: "Centré sur la résolution d'une énigme criminelle, souvent une enquête menée par un détective.",
  thriller: "Suspense intense, rythme rapide, menace souvent physique ou psychologique pour le protagoniste.",
  nouvelle: "Récit bref, concentré sur une intrigue unique, peu de personnages, chute souvent significative.",
  autobiographie: "Récit rétrospectif que fait une personne réelle de sa propre existence.",
  memoires: "Récit d'événements historiques ou sociaux auxquels l'auteur a participé ou été témoin."
};
export const GENRE_DISPLAY_NAMES: Record<string, string> = {
  conte_philosophique: "Conte philosophique",
  roman_realiste: "Roman réaliste",
  roman_naturaliste: "Roman naturaliste",
  roman_historique: "Roman historique",
  roman_epistolaire: "Roman épistolaire",
  roman_apprentissage: "Roman d'apprentissage",
  science_fiction: "Science-Fiction",
  fantasy: "Fantasy",
  fantastique: "Fantastique",
  policier: "Policier / Détection",
  thriller: "Thriller / Suspense",
  nouvelle: "Nouvelle",
  autobiographie: "Autobiographie",
  memoires: "Mémoires"
};