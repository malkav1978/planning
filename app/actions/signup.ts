"use server"

import { sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { volunteerSignups, type SignupSlot } from "@/lib/db/schema"
import { JOURS, POSTES, PREPA, getPrepaCreneau, getSlotCapacity } from "@/lib/festival"

// Clé arbitraire utilisée pour sérialiser les inscriptions via un advisory lock
// Postgres, afin d'éviter que deux bénévoles ne prennent le même créneau en même temps.
const SLOT_CAPACITY_LOCK_KEY = 841200193

// Combinaisons exactes poste|jour|créneau autorisées, pour éviter qu'un poste
// standard soit associé au créneau de mise en place (et inversement).
const VALID_SLOTS = new Set([
  ...POSTES.flatMap((p) => JOURS.flatMap((j) => j.creneaux.map((c) => `${p.label}|${j.label}|${c}`))),
  ...JOURS.flatMap((j) => {
    const prepaCreneau = getPrepaCreneau(j.id)
    return prepaCreneau ? [`${PREPA.label}|${j.label}|${prepaCreneau}`] : []
  }),
])

export type SignupState = {
  status: "idle" | "success" | "error"
  message?: string
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function submitSignup(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const firstName = String(formData.get("firstName") ?? "").trim()
  const lastName = String(formData.get("lastName") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  const notes = String(formData.get("notes") ?? "").trim()

  let slots: SignupSlot[] = []
  try {
    const raw = String(formData.get("slots") ?? "[]")
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      slots = parsed
        .filter(
          (s) =>
            s &&
            typeof s.poste === "string" &&
            typeof s.jour === "string" &&
            typeof s.creneau === "string" &&
            VALID_SLOTS.has(`${s.poste}|${s.jour}|${s.creneau}`),
        )
        .map((s) => ({ poste: s.poste, jour: s.jour, creneau: s.creneau }))
    }
  } catch {
    slots = []
  }

  if (!firstName || !lastName) {
    return { status: "error", message: "Merci d'indiquer votre nom et votre prénom." }
  }
  if (!isEmail(email)) {
    return { status: "error", message: "Merci d'indiquer une adresse e-mail valide." }
  }
  if (phone.replace(/[\s.\-+]/g, "").length < 8) {
    return { status: "error", message: "Merci d'indiquer un numéro de téléphone valide." }
  }
  if (slots.length === 0) {
    return { status: "error", message: "Sélectionnez au moins un créneau de bénévolat." }
  }

  // Deduplicate slots
  const seen = new Set<string>()
  const uniqueSlots = slots.filter((s) => {
    const key = `${s.poste}|${s.jour}|${s.creneau}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  let accepted: SignupSlot[] = []
  let full: SignupSlot[] = []

  try {
    const result = await db.transaction(async (tx) => {
      // Sérialise les écritures concurrentes le temps de vérifier les places disponibles.
      await tx.execute(sql`SELECT pg_advisory_xact_lock(${SLOT_CAPACITY_LOCK_KEY})`)

      const acceptedSlots: SignupSlot[] = []
      const fullSlots: SignupSlot[] = []

      for (const slot of uniqueSlots) {
        const countResult = await tx.execute<{ count: number }>(sql`
          SELECT count(*)::int AS count
          FROM volunteer_signups, jsonb_array_elements(slots) AS elem
          WHERE elem->>'poste' = ${slot.poste}
            AND elem->>'jour' = ${slot.jour}
            AND elem->>'creneau' = ${slot.creneau}
        `)
        const count = countResult.rows[0]?.count ?? 0
        if (count < getSlotCapacity(slot.poste, slot.jour, slot.creneau)) {
          acceptedSlots.push(slot)
        } else {
          fullSlots.push(slot)
        }
      }

      if (acceptedSlots.length > 0) {
        await tx.insert(volunteerSignups).values({
          firstName,
          lastName,
          email,
          phone,
          slots: acceptedSlots,
          notes: notes || null,
        })
      }

      return { acceptedSlots, fullSlots }
    })

    accepted = result.acceptedSlots
    full = result.fullSlots
  } catch {
    return {
      status: "error",
      message: "Une erreur est survenue lors de l'enregistrement. Merci de réessayer.",
    }
  }

  if (accepted.length === 0) {
    return {
      status: "error",
      message:
        "Tous les créneaux sélectionnés sont désormais complets. Merci de recharger la page et de choisir d'autres créneaux.",
    }
  }

  const fullNote =
    full.length > 0
      ? ` (${full.length} créneau${full.length > 1 ? "x" : ""} n'a pas pu être retenu${
          full.length > 1 ? "s" : ""
        } car complet${full.length > 1 ? "s" : ""} entre-temps.)`
      : ""

  return {
    status: "success",
    message: `Merci ${firstName} ! Votre inscription pour ${accepted.length} créneau${accepted.length > 1 ? "x" : ""} a bien été enregistrée.${fullNote}`,
  }
}
