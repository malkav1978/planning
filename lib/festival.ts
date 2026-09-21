export const FESTIVAL = {
  name: "Fessti'Jeux — Pôle Restauration",
  edition: "Édition 2026",
}

// Capacité par défaut si aucun besoin spécifique n'est défini pour une combinaison
// poste/jour/créneau (voir SLOT_CAPACITY_OVERRIDES ci-dessous).
export const DEFAULT_SLOT_CAPACITY = 2

// Besoins en bénévoles par poste et par créneau, issus du fichier
// "Besoins_en_bénévoles.ods" fourni par la coordination (version confirmée avec
// Samedi ET Dimanche explicitement distingués).
// Clé : `${poste}|${jour}|${creneau}` (labels exacts de POSTES/JOURS).
// Une combinaison absente de cette table utilise DEFAULT_SLOT_CAPACITY.
// Une capacité de 0 signifie que le poste est fermé sur ce créneau (ex : Crêpes
// à 8h-10h) — affiché "Fermé" plutôt que "Libre" dans les tableaux récap.
export const SLOT_CAPACITY_OVERRIDES: Record<string, number> = {
  // Mise en place (appel générique, en plus des besoins par poste ci-dessous).
  "Mise en place|Vendredi 6 novembre 2026|18h00 – 20h00": 10,
  "Mise en place|Samedi 7 novembre 2026|8h00 – 10h00": 10,

  "Crêpes|Samedi 7 novembre 2026|8h00 – 10h00": 0,
  "Service|Samedi 7 novembre 2026|8h00 – 10h00": 1,
  "Cuisine|Samedi 7 novembre 2026|8h00 – 10h00": 2,
  "Plonge|Samedi 7 novembre 2026|8h00 – 10h00": 1,
  "Entretien|Samedi 7 novembre 2026|8h00 – 10h00": 1,

  "Service|Samedi 7 novembre 2026|10h00 – 12h00": 1,
  "Entretien|Samedi 7 novembre 2026|10h00 – 12h00": 1,
  "Plonge|Samedi 7 novembre 2026|10h00 – 12h00": 1,
  "Cuisine|Samedi 7 novembre 2026|10h00 – 12h00": 1,
  "Crêpes|Samedi 7 novembre 2026|10h00 – 12h00": 1,

  "Service|Samedi 7 novembre 2026|12h00 – 14h00": 2,
  "Entretien|Samedi 7 novembre 2026|12h00 – 14h00": 1,
  "Plonge|Samedi 7 novembre 2026|12h00 – 14h00": 1,
  "Cuisine|Samedi 7 novembre 2026|12h00 – 14h00": 2,
  "Crêpes|Samedi 7 novembre 2026|12h00 – 14h00": 1,
  "Renfort|Samedi 7 novembre 2026|12h00 – 14h00": 3,

  "Service|Samedi 7 novembre 2026|14h00 – 16h00": 1,
  "Entretien|Samedi 7 novembre 2026|14h00 – 16h00": 1,
  "Plonge|Samedi 7 novembre 2026|14h00 – 16h00": 1,
  "Cuisine|Samedi 7 novembre 2026|14h00 – 16h00": 1,
  "Crêpes|Samedi 7 novembre 2026|14h00 – 16h00": 1,

  "Service|Samedi 7 novembre 2026|16h00 – 18h00": 1,
  "Entretien|Samedi 7 novembre 2026|16h00 – 18h00": 1,
  "Plonge|Samedi 7 novembre 2026|16h00 – 18h00": 1,
  "Cuisine|Samedi 7 novembre 2026|16h00 – 18h00": 1,
  "Crêpes|Samedi 7 novembre 2026|16h00 – 18h00": 1,

  "Service|Samedi 7 novembre 2026|18h00 – 20h00": 2,
  "Entretien|Samedi 7 novembre 2026|18h00 – 20h00": 1,
  "Plonge|Samedi 7 novembre 2026|18h00 – 20h00": 1,
  "Cuisine|Samedi 7 novembre 2026|18h00 – 20h00": 2,
  "Crêpes|Samedi 7 novembre 2026|18h00 – 20h00": 1,
  "Renfort|Samedi 7 novembre 2026|18h00 – 20h00": 3,

  "Service|Samedi 7 novembre 2026|20h00 – 22h00": 1,
  "Entretien|Samedi 7 novembre 2026|20h00 – 22h00": 1,
  "Plonge|Samedi 7 novembre 2026|20h00 – 22h00": 1,
  "Cuisine|Samedi 7 novembre 2026|20h00 – 22h00": 1,
  "Crêpes|Samedi 7 novembre 2026|20h00 – 22h00": 1,
  "Renfort|Samedi 7 novembre 2026|20h00 – 22h00": 3,

  "Service|Samedi 7 novembre 2026|22h00 – 00h00": 1,
  "Entretien|Samedi 7 novembre 2026|22h00 – 00h00": 1,
  "Plonge|Samedi 7 novembre 2026|22h00 – 00h00": 1,
  "Cuisine|Samedi 7 novembre 2026|22h00 – 00h00": 1,
  "Crêpes|Samedi 7 novembre 2026|22h00 – 00h00": 1,

  "Crêpes|Dimanche 8 novembre 2026|8h00 – 10h00": 0,
  "Service|Dimanche 8 novembre 2026|8h00 – 10h00": 1,
  "Cuisine|Dimanche 8 novembre 2026|8h00 – 10h00": 2,
  "Plonge|Dimanche 8 novembre 2026|8h00 – 10h00": 1,
  "Entretien|Dimanche 8 novembre 2026|8h00 – 10h00": 1,

  "Crêpes|Dimanche 8 novembre 2026|10h00 – 12h00": 1,
  "Service|Dimanche 8 novembre 2026|10h00 – 12h00": 1,
  "Cuisine|Dimanche 8 novembre 2026|10h00 – 12h00": 1,
  "Plonge|Dimanche 8 novembre 2026|10h00 – 12h00": 1,
  "Entretien|Dimanche 8 novembre 2026|10h00 – 12h00": 1,

  "Crêpes|Dimanche 8 novembre 2026|12h00 – 14h00": 1,
  "Service|Dimanche 8 novembre 2026|12h00 – 14h00": 2,
  "Cuisine|Dimanche 8 novembre 2026|12h00 – 14h00": 2,
  "Plonge|Dimanche 8 novembre 2026|12h00 – 14h00": 1,
  "Entretien|Dimanche 8 novembre 2026|12h00 – 14h00": 1,

  "Crêpes|Dimanche 8 novembre 2026|14h00 – 16h00": 1,
  "Service|Dimanche 8 novembre 2026|14h00 – 16h00": 1,
  "Cuisine|Dimanche 8 novembre 2026|14h00 – 16h00": 1,
  "Plonge|Dimanche 8 novembre 2026|14h00 – 16h00": 1,
  "Entretien|Dimanche 8 novembre 2026|14h00 – 16h00": 1,

  "Crêpes|Dimanche 8 novembre 2026|16h00 – 18h00": 1,
  "Service|Dimanche 8 novembre 2026|16h00 – 18h00": 1,
  "Cuisine|Dimanche 8 novembre 2026|16h00 – 18h00": 1,
  "Plonge|Dimanche 8 novembre 2026|16h00 – 18h00": 1,
  "Entretien|Dimanche 8 novembre 2026|16h00 – 18h00": 1,
}

/** Nombre maximum de bénévoles pour une combinaison poste/jour/créneau donnée. */
export function getSlotCapacity(poste: string, jour: string, creneau: string): number {
  return SLOT_CAPACITY_OVERRIDES[`${poste}|${jour}|${creneau}`] ?? DEFAULT_SLOT_CAPACITY
}

export const POSTES = [
  { id: "crepes", label: "Crêpes", description: "Préparation des crêpes" },
  { id: "service", label: "Service", description: "Service au stand" },
  { id: "cuisine", label: "Cuisine", description: "Préparation et dressage des plats" },
  { id: "plonge", label: "Plonge", description: "Vaisselle et nettoyage de la vaisselle" },
  { id: "entretien", label: "Entretien", description: "Nettoyage des sanitaires et gestion des poubelles" },
  { id: "renfort", label: "Renfort", description: "Renfort pour les rushs" },
] as const

export type GenericRole = {
  id: string
  label: string
  description: string
  /** Créneau par jour pour ce rôle. Une clé absente = pas de créneau ce jour-là. */
  creneaux: Partial<Record<JourId, string>>
}

// Rôles génériques (non rattachés à un poste précis), proposés en plus des
// besoins normaux par poste. Ils peuvent coexister avec un poste sur le même
// horaire : un bénévole peut s'inscrire aux deux, ce sont des appels distincts.
export const GENERIC_ROLES: GenericRole[] = [
  {
    id: "prepa",
    label: "Mise en place",
    description: "Installation avant l'ouverture au public",
    creneaux: {
      ven: "18h00 – 20h00",
      sam: "8h00 – 10h00",
    },
  },
  {
    id: "rangement",
    label: "Rangement",
    description: "Rangement et nettoyage après la fermeture du festival",
    creneaux: {
      dim: "18h00 – 22h00",
    },
  },
]

/** Rétrocompatibilité : accès direct au rôle "Mise en place". */
export const PREPA = GENERIC_ROLES[0]

/** Créneau du rôle générique donné pour ce jour, ou undefined s'il n'y en a pas. */
export function getGenericRoleCreneau(role: GenericRole, jourId: JourId): string | undefined {
  return role.creneaux[jourId]
}

/** Créneau de mise en place pour ce jour, ou undefined s'il n'y en a pas. */
export function getPrepaCreneau(jourId: JourId): string | undefined {
  return getGenericRoleCreneau(PREPA, jourId)
}

export const JOURS = [
  {
    id: "ven",
    label: "Vendredi 6 novembre 2026",
    creneaux: [] as string[],
  },
  {
    id: "sam",
    label: "Samedi 7 novembre 2026",
    creneaux: [
      "8h00 – 10h00",
      "10h00 – 12h00",
      "12h00 – 14h00",
      "14h00 – 16h00",
      "16h00 – 18h00",
      "18h00 – 20h00",
      "20h00 – 22h00",
      "22h00 – 00h00",
    ],
  },
  {
    id: "dim",
    label: "Dimanche 8 novembre 2026",
    creneaux: [
      "8h00 – 10h00",
      "10h00 – 12h00",
      "12h00 – 14h00",
      "14h00 – 16h00",
      "16h00 – 18h00",
    ],
  },
] as const

export type PosteId = (typeof POSTES)[number]["id"]
export type JourId = (typeof JOURS)[number]["id"]

export function posteLabel(id: string) {
  return POSTES.find((p) => p.id === id)?.label ?? id
}

export function jourLabel(id: string) {
  return JOURS.find((j) => j.id === id)?.label ?? id
}
