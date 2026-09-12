export const FESTIVAL = {
  name: "Festival — Pôle Restauration",
  edition: "Édition 2026",
}

// Capacité par défaut si aucun besoin spécifique n'est défini pour une combinaison
// poste/jour/créneau (voir SLOT_CAPACITY_OVERRIDES ci-dessous).
export const DEFAULT_SLOT_CAPACITY = 1

// Besoins en bénévoles par poste et par créneau, issus du fichier
// "Besoins_en_bénévoles.xlsx" fourni par la coordination.
// Clé : `${poste}|${jour}|${creneau}` (labels exacts de POSTES/JOURS).
// Une combinaison absente de cette table utilise DEFAULT_SLOT_CAPACITY.
//
// NB : seul le bloc "Samedi" du fichier (créneaux 10h-22h/00h) a été repris ici.
// Le créneau 8h-10h (Mise en place) et le Dimanche restent en attente de
// confirmation — voir la conversation avec Yannick du 12/09/2026.
export const SLOT_CAPACITY_OVERRIDES: Record<string, number> = {
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

  "Service|Samedi 7 novembre 2026|20h00 – 22h00": 1,
  "Entretien|Samedi 7 novembre 2026|20h00 – 22h00": 1,
  "Plonge|Samedi 7 novembre 2026|20h00 – 22h00": 1,
  "Cuisine|Samedi 7 novembre 2026|20h00 – 22h00": 1,
  "Crêpes|Samedi 7 novembre 2026|20h00 – 22h00": 1,

  "Service|Samedi 7 novembre 2026|22h00 – 00h00": 1,
  "Entretien|Samedi 7 novembre 2026|22h00 – 00h00": 1,
  "Plonge|Samedi 7 novembre 2026|22h00 – 00h00": 1,
  "Cuisine|Samedi 7 novembre 2026|22h00 – 00h00": 1,
  "Crêpes|Samedi 7 novembre 2026|22h00 – 00h00": 1,

  "Service|Dimanche 8 novembre 2026|10h00 – 12h00": 1,
  "Entretien|Dimanche 8 novembre 2026|10h00 – 12h00": 1,
  "Plonge|Dimanche 8 novembre 2026|10h00 – 12h00": 1,
  "Cuisine|Dimanche 8 novembre 2026|10h00 – 12h00": 1,
  "Crêpes|Dimanche 8 novembre 2026|10h00 – 12h00": 1,

  "Service|Dimanche 8 novembre 2026|12h00 – 14h00": 2,
  "Entretien|Dimanche 8 novembre 2026|12h00 – 14h00": 1,
  "Plonge|Dimanche 8 novembre 2026|12h00 – 14h00": 1,
  "Cuisine|Dimanche 8 novembre 2026|12h00 – 14h00": 2,
  "Crêpes|Dimanche 8 novembre 2026|12h00 – 14h00": 1,

  "Service|Dimanche 8 novembre 2026|18h00 – 20h00": 2,
  "Entretien|Dimanche 8 novembre 2026|18h00 – 20h00": 1,
  "Plonge|Dimanche 8 novembre 2026|18h00 – 20h00": 1,
  "Cuisine|Dimanche 8 novembre 2026|18h00 – 20h00": 2,
  "Crêpes|Dimanche 8 novembre 2026|18h00 – 20h00": 1,
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
] as const

// Créneau de préparation avant l'ouverture du stand, proposé chaque jour du festival.
export const PREPA = {
  id: "prepa",
  label: "Mise en place",
  description: "Installation du stand avant l'ouverture au public",
  creneau: "8h00 – 10h00",
} as const

export const JOURS = [
  {
    id: "sam",
    label: "Samedi 7 novembre 2026",
    creneaux: [
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
    creneaux: ["10h00 – 12h00", "12h00 – 14h00", "14h00 – 16h00", "16h00 – 18h00"],
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
