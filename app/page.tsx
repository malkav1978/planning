import { SignupForm } from "@/components/signup-form"
import { SlotsRecapTable } from "@/components/slots-recap-table"
import { FESTIVAL, JOURS } from "@/lib/festival"
import { getSlotOccupancy, occupancyToPlainNames } from "@/lib/signups"
import { UtensilsCrossed } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function Page() {
  const occupancy = await getSlotOccupancy()
  const occupancyNames = occupancyToPlainNames(occupancy)

  return (
    <main className="min-h-dvh">
      <header className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex items-center gap-2 text-sm font-medium text-primary-foreground/80">
            <UtensilsCrossed className="size-4" aria-hidden />
            {FESTIVAL.name}
          </div>
          <h1 className="font-serif text-3xl leading-tight text-balance sm:text-4xl">
            Devenez bénévole du Fessti'Jeux
          </h1>
          <p className="max-w-xl text-pretty leading-relaxed text-primary-foreground/85">
            Rejoignez l&apos;équipe qui régale le festival&nbsp;!<p/>Choisissez les postes et les
            créneaux qui vous conviennent — {JOURS.map((j) => j.label).join(" et ")}.
          </p>
          <p className="text-sm text-primary-foreground/70">{FESTIVAL.edition}</p>
        </div>
      </header>

      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
        <section aria-labelledby="recap-title">
          <div className="mb-4">
            <h2 id="recap-title" className="font-serif text-2xl text-foreground">
              Qui est déjà inscrit ?
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Aperçu des créneaux déjà pris. Choisissez un créneau encore libre ci-dessous.
            </p>
          </div>
          <SlotsRecapTable occupancy={occupancy} />
        </section>

        <SignupForm occupancy={occupancyNames} />
      </div>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-3xl px-4 py-6 text-center text-sm text-muted-foreground sm:px-6">
          Une question ? Contactez la coordination bénévoles du festival.
        </div>
      </footer>
    </main>
  )
}
