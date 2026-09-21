import { db } from "@/lib/db"
import { volunteerSignups } from "@/lib/db/schema"
import { GENERIC_ROLES, JOURS, POSTES, getGenericRoleCreneau, getSlotCapacity } from "@/lib/festival"

export type SlotOccupancy = {
  poste: string
  jour: string
  creneau: string
  names: string[]
}

export function slotKey(poste: string, jour: string, creneau: string) {
  return `${poste}|${jour}|${creneau}`
}

function displayName(firstName: string, lastName: string) {
  const initial = lastName.trim().charAt(0).toUpperCase()
  return initial ? `${firstName} ${initial}.` : firstName
}

/**
 * Retourne, pour chaque combinaison poste/jour/créneau connue (+ celles
 * éventuellement obsolètes présentes en base), la liste des bénévoles inscrits.
 */
export async function getSlotOccupancy(): Promise<Map<string, SlotOccupancy>> {
  const signups = await db.select().from(volunteerSignups)

  const occupancy = new Map<string, SlotOccupancy>()

  for (const poste of POSTES) {
    for (const jour of JOURS) {
      for (const creneau of jour.creneaux) {
        occupancy.set(slotKey(poste.label, jour.label, creneau), {
          poste: poste.label,
          jour: jour.label,
          creneau,
          names: [],
        })
      }
    }
  }
  for (const role of GENERIC_ROLES) {
    for (const jour of JOURS) {
      const creneau = getGenericRoleCreneau(role, jour.id)
      if (!creneau) continue
      occupancy.set(slotKey(role.label, jour.label, creneau), {
        poste: role.label,
        jour: jour.label,
        creneau,
        names: [],
      })
    }
  }

  for (const signup of signups) {
    const name = displayName(signup.firstName, signup.lastName)
    for (const slot of signup.slots) {
      const key = slotKey(slot.poste, slot.jour, slot.creneau)
      const bucket = occupancy.get(key)
      if (bucket) {
        bucket.names.push(name)
      } else {
        // Créneau qui n'existe plus dans la configuration actuelle (ex: config modifiée depuis) :
        // on le garde visible plutôt que de perdre l'information.
        occupancy.set(key, { poste: slot.poste, jour: slot.jour, creneau: slot.creneau, names: [name] })
      }
    }
  }

  return occupancy
}

export function isSlotFull(occupancy: Map<string, SlotOccupancy>, poste: string, jour: string, creneau: string) {
  const bucket = occupancy.get(slotKey(poste, jour, creneau))
  return (bucket?.names.length ?? 0) >= getSlotCapacity(poste, jour, creneau)
}

/** Convertit la Map en objet simple sérialisable, pour le passer à un composant client. */
export function occupancyToPlainNames(occupancy: Map<string, SlotOccupancy>): Record<string, string[]> {
  const plain: Record<string, string[]> = {}
  for (const [key, bucket] of occupancy) {
    plain[key] = bucket.names
  }
  return plain
}
