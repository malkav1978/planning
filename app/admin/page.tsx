import { desc } from "drizzle-orm"
import { db } from "@/lib/db"
import { volunteerSignups } from "@/lib/db/schema"
import { GENERIC_ROLES, JOURS, POSTES, getGenericRoleCreneau, getSlotCapacity } from "@/lib/festival"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { AdminLoginForm } from "@/app/admin/login-form"
import { adminLogout } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { LogOut, Mail, Phone, Users } from "lucide-react"

export const dynamic = "force-dynamic"

type SlotBucket = {
  poste: string
  jour: string
  creneau: string
  names: string[]
}

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated()

  if (!authenticated) {
    return <AdminLoginForm />
  }

  const signups = await db
    .select()
    .from(volunteerSignups)
    .orderBy(desc(volunteerSignups.createdAt))

  // Construit la liste de tous les créneaux possibles (postes + mise en place)
  // afin de pouvoir repérer les créneaux non couverts.
  const buckets = new Map<string, SlotBucket>()
  for (const poste of POSTES) {
    for (const jour of JOURS) {
      for (const creneau of jour.creneaux) {
        if (getSlotCapacity(poste.label, jour.label, creneau) === 0) continue
        const key = `${poste.label}|${jour.label}|${creneau}`
        buckets.set(key, { poste: poste.label, jour: jour.label, creneau, names: [] })
      }
    }
  }
  for (const role of GENERIC_ROLES) {
    for (const jour of JOURS) {
      const creneau = getGenericRoleCreneau(role, jour.id)
      if (!creneau) continue
      const key = `${role.label}|${jour.label}|${creneau}`
      buckets.set(key, { poste: role.label, jour: jour.label, creneau, names: [] })
    }
  }

  let totalSlotSignups = 0
  for (const signup of signups) {
    for (const slot of signup.slots) {
      const key = `${slot.poste}|${slot.jour}|${slot.creneau}`
      const bucket = buckets.get(key)
      const name = `${signup.firstName} ${signup.lastName}`
      if (bucket) {
        bucket.names.push(name)
      } else {
        // Ancien créneau (config modifiée depuis) : on l'affiche quand même.
        buckets.set(key, { poste: slot.poste, jour: slot.jour, creneau: slot.creneau, names: [name] })
      }
      totalSlotSignups += 1
    }
  }

  const bucketsByJourAndPoste = new Map<string, SlotBucket[]>()
  for (const bucket of buckets.values()) {
    const groupKey = `${bucket.jour}|${bucket.poste}`
    const list = bucketsByJourAndPoste.get(groupKey) ?? []
    list.push(bucket)
    bucketsByJourAndPoste.set(groupKey, list)
  }

  const posteOrder = [...GENERIC_ROLES.map((r) => r.label), ...POSTES.map((p) => p.label)]

  return (
    <main className="min-h-dvh">
      <header className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-primary-foreground/80">
                <Users className="size-4" aria-hidden />
                Coordination bénévoles
              </div>
              <h1 className="mt-1 font-serif text-2xl sm:text-3xl">Tableau de bord des inscriptions</h1>
            </div>
            <form action={adminLogout}>
              <Button type="submit" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                <LogOut className="size-4" aria-hidden />
                Déconnexion
              </Button>
            </form>
          </div>
          <p className="text-sm text-primary-foreground/85">
            {signups.length} bénévole{signups.length > 1 ? "s" : ""} inscrit{signups.length > 1 ? "s" : ""} ·{" "}
            {totalSlotSignups} créneau{totalSlotSignups > 1 ? "x" : ""} couvert{totalSlotSignups > 1 ? "s" : ""}
          </p>
        </div>
      </header>

      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6">
        {/* Vue par créneau */}
        <section aria-labelledby="planning-title">
          <h2 id="planning-title" className="mb-4 font-serif text-2xl text-foreground">
            Couverture des créneaux
          </h2>
          <div className="flex flex-col gap-6">
            {JOURS.map((jour) => (
              <div key={jour.id} className="rounded-xl border border-border bg-card p-4 sm:p-5">
                <h3 className="mb-3 font-serif text-lg text-card-foreground">{jour.label}</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {posteOrder.map((posteLabel) => {
                    const list = bucketsByJourAndPoste.get(`${jour.label}|${posteLabel}`)
                    if (!list || list.length === 0) return null
                    return (
                      <div key={posteLabel}>
                        <p className="mb-2 text-sm font-medium text-foreground">{posteLabel}</p>
                        <ul className="flex flex-col gap-1.5">
                          {list.map((bucket) => (
                            <li
                              key={bucket.creneau}
                              className={`rounded-md border px-3 py-2 text-sm ${
                                bucket.names.length === 0
                                  ? "border-destructive/30 bg-destructive/5 text-destructive"
                                  : "border-border bg-background text-foreground"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span>{bucket.creneau}</span>
                                <span className="text-xs font-medium">
                                  {bucket.names.length === 0
                                    ? "Aucun bénévole"
                                    : `${bucket.names.length} bénévole${bucket.names.length > 1 ? "s" : ""}`}
                                </span>
                              </div>
                              {bucket.names.length > 0 && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {bucket.names.join(", ")}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Liste des bénévoles */}
        <section aria-labelledby="volunteers-title">
          <h2 id="volunteers-title" className="mb-4 font-serif text-2xl text-foreground">
            Liste des bénévoles
          </h2>
          {signups.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune inscription pour le moment.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {signups.map((signup) => (
                <div key={signup.id} className="rounded-xl border border-border bg-card p-4 sm:p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h3 className="font-serif text-lg text-card-foreground">
                      {signup.firstName} {signup.lastName}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      Inscrit le {new Date(signup.createdAt).toLocaleString("fr-FR")}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Mail className="size-3.5" aria-hidden />
                      {signup.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="size-3.5" aria-hidden />
                      {signup.phone}
                    </span>
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {signup.slots.map((slot, i) => (
                      <li
                        key={i}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs text-foreground"
                      >
                        {slot.poste} · {slot.jour.split(" ")[0]} · {slot.creneau}
                      </li>
                    ))}
                  </ul>
                  {signup.notes && (
                    <p className="mt-3 rounded-md bg-secondary p-3 text-sm text-secondary-foreground">
                      {signup.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
