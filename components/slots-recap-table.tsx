import { Fragment } from "react"
import { JOURS, POSTES, PREPA, getSlotCapacity } from "@/lib/festival"
import { slotKey, type SlotOccupancy } from "@/lib/signups"

type Column = { key: string; label: string }

function Cell({
  occupancy,
  poste,
  jour,
  creneau,
  applicable,
}: {
  occupancy: Map<string, SlotOccupancy>
  poste: string
  jour: string
  creneau: string
  applicable: boolean
}) {
  if (!applicable) {
    return <td className="border border-border px-3 py-2 text-center text-xs text-muted-foreground/60">Fermé</td>
  }

  const names = occupancy.get(slotKey(poste, jour, creneau))?.names ?? []
  const freeSlots = Math.max(0, getSlotCapacity(poste, jour, creneau) - names.length)

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

export function SlotsRecapTable({ occupancy }: { occupancy: Map<string, SlotOccupancy> }) {
  const columns: Column[] = [
    { key: PREPA.label, label: PREPA.label },
    ...POSTES.map((p) => ({ key: p.label, label: p.label })),
  ]

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-secondary">
            <th className="sticky left-0 border border-border bg-secondary px-3 py-2 font-medium text-secondary-foreground">
              Créneaux
            </th>
            {columns.map((col) => (
              <th key={col.key} className="border border-border px-3 py-2 font-medium text-secondary-foreground">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {JOURS.map((jour) => (
            <Fragment key={jour.id}>
              <tr className="bg-muted">
                <td colSpan={columns.length + 1} className="border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  📅 {jour.label}
                </td>
              </tr>

              <tr>
                <td className="sticky left-0 whitespace-nowrap border border-border bg-background px-3 py-2 text-xs text-foreground">
                  {PREPA.creneau}
                </td>
                {columns.map((col) => (
                  <Cell
                    key={col.key}
                    occupancy={occupancy}
                    poste={col.key}
                    jour={jour.label}
                    creneau={PREPA.creneau}
                    applicable={col.key === PREPA.label}
                  />
                ))}
              </tr>

              {jour.creneaux.map((creneau) => (
                <tr key={`${jour.id}-${creneau}`}>
                  <td className="sticky left-0 whitespace-nowrap border border-border bg-background px-3 py-2 text-xs text-foreground">
                    {creneau}
                  </td>
                  {columns.map((col) => (
                    <Cell
                      key={col.key}
                      occupancy={occupancy}
                      poste={col.key}
                      jour={jour.label}
                      creneau={creneau}
                      applicable={col.key !== PREPA.label}
                    />
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
