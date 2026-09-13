import { Fragment } from "react"
import { JOURS, POSTES, PREPA, getPrepaCreneau, getSlotCapacity } from "@/lib/festival"
import { slotKey, type SlotOccupancy } from "@/lib/signups"

function Cell({
  occupancy,
  poste,
  jour,
  creneau,
}: {
  occupancy: Map<string, SlotOccupancy>
  poste: string
  jour: string
  creneau: string
}) {
  const capacity = getSlotCapacity(poste, jour, creneau)

  if (capacity === 0) {
    return <td className="border border-border px-3 py-2 text-center text-xs text-muted-foreground/60">Fermé</td>
  }

  const names = occupancy.get(slotKey(poste, jour, creneau))?.names ?? []
  const freeSlots = Math.max(0, capacity - names.length)

  return (
    <td className="border border-border px-3 py-2 align-top text-xs">
      <div className="flex flex-col gap-0.5">
        {names.map((name, i) => (
          <span key={i} className="text-foreground">
            {name}
          </span>
        ))}
        {Array.from({ length: freeSlots }).map((_, i) => (
          <span key={`free-${i}`} className="italic text-muted-foreground">
            Libre
          </span>
        ))}
      </div>
    </td>
  )
}

/** Tableau récap des postes du stand (hors mise en place). */
export function SlotsRecapTable({ occupancy }: { occupancy: Map<string, SlotOccupancy> }) {
  const jours = JOURS.filter((jour) => jour.creneaux.length > 0)

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-secondary">
            <th className="sticky left-0 border border-border bg-secondary px-3 py-2 font-medium text-secondary-foreground">
              Créneaux
            </th>
            {POSTES.map((poste) => (
              <th key={poste.id} className="border border-border px-3 py-2 font-medium text-secondary-foreground">
                {poste.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jours.map((jour) => (
            <Fragment key={jour.id}>
              <tr className="bg-muted">
                <td
                  colSpan={POSTES.length + 1}
                  className="border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  📅 {jour.label}
                </td>
              </tr>

              {jour.creneaux.map((creneau) => (
                <tr key={`${jour.id}-${creneau}`}>
                  <td className="sticky left-0 whitespace-nowrap border border-border bg-background px-3 py-2 text-xs text-foreground">
                    {creneau}
                  </td>
                  {POSTES.map((poste) => (
                    <Cell key={poste.id} occupancy={occupancy} poste={poste.label} jour={jour.label} creneau={creneau} />
                  ))}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Tableau récap séparé pour le créneau de mise en place (absent certains jours). */
export function PrepaRecapTable({ occupancy }: { occupancy: Map<string, SlotOccupancy> }) {
  const rows = JOURS.map((jour) => ({ jour, creneau: getPrepaCreneau(jour.id) })).filter(
    (row): row is { jour: (typeof JOURS)[number]; creneau: string } => Boolean(row.creneau),
  )

  if (rows.length === 0) return null

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[420px] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-secondary">
            <th className="border border-border px-3 py-2 font-medium text-secondary-foreground">Jour</th>
            <th className="border border-border px-3 py-2 font-medium text-secondary-foreground">Créneau</th>
            <th className="border border-border px-3 py-2 font-medium text-secondary-foreground">Bénévoles</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ jour, creneau }) => (
            <tr key={jour.id}>
              <td className="whitespace-nowrap border border-border px-3 py-2 text-xs text-foreground">{jour.label}</td>
              <td className="whitespace-nowrap border border-border px-3 py-2 text-xs text-foreground">{creneau}</td>
              <Cell occupancy={occupancy} poste={PREPA.label} jour={jour.label} creneau={creneau} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
