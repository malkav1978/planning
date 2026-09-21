"use client"

import { useActionState, useMemo, useState } from "react"
import { useFormStatus } from "react-dom"
import { GENERIC_ROLES, JOURS, POSTES, getGenericRoleCreneau, getSlotCapacity } from "@/lib/festival"
import { submitSignup, type SignupState } from "@/app/actions/signup"
import { Button } from "@/components/ui/button"
import { Check, Loader2, MapPin, PartyPopper, X } from "lucide-react"

type Slot = { poste: string; jour: string; creneau: string }

function slotKey(s: Slot) {
  return `${s.poste}|${s.jour}|${s.creneau}`
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className="h-12 w-full text-base font-semibold sm:w-auto sm:px-10"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Enregistrement…
        </>
      ) : (
        "Valider mon inscription"
      )}
    </Button>
  )
}

export function SignupForm({ occupancy }: { occupancy: Record<string, string[]> }) {
  const [selected, setSelected] = useState<Slot[]>([])
  const initialState: SignupState = { status: "idle" }
  const [state, formAction] = useActionState(submitSignup, initialState)

  const selectedKeys = useMemo(() => new Set(selected.map(slotKey)), [selected])

  function isFull(slot: Slot) {
    const takenBy = occupancy[slotKey(slot)]?.length ?? 0
    return takenBy >= getSlotCapacity(slot.poste, slot.jour, slot.creneau)
  }

  function toggle(slot: Slot) {
    setSelected((prev) => {
      const key = slotKey(slot)
      if (prev.some((s) => slotKey(s) === key)) {
        return prev.filter((s) => slotKey(s) !== key)
      }
      return [...prev, slot]
    })
  }

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <PartyPopper className="size-7" aria-hidden />
        </div>
        <h2 className="mt-5 font-serif text-2xl text-card-foreground text-balance">
          Inscription confirmée
        </h2>
        <p className="mx-auto mt-2 max-w-md text-pretty leading-relaxed text-muted-foreground">
          {state.message}
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Les plannings peuvent évolués jusqu'au dernier moment, un coordinateur reviendra vers vous avec les détails de votre affectation.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-10">
      {/* Sélection des créneaux */}
      <section aria-labelledby="creneaux-title">
        <div className="mb-4">
          <h2 id="creneaux-title" className="font-serif text-2xl text-foreground">
            1. Choisissez vos postes et créneaux
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Cochez tous les créneaux sur lesquels vous vous engagez.
          </p>
        </div>

        <div className="mb-4 grid gap-4">
          {GENERIC_ROLES.map((role) => (
            <fieldset
              key={role.id}
              className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 sm:p-5"
            >
              <legend className="sr-only">{role.label}</legend>
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className="font-serif text-lg text-card-foreground">{role.label}</h3>
                <span className="text-xs text-muted-foreground">{role.description}</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {JOURS.filter((jour) => getGenericRoleCreneau(role, jour.id)).map((jour) => {
                  const creneau = getGenericRoleCreneau(role, jour.id)!
                  const slot: Slot = { poste: role.label, jour: jour.label, creneau }
                  const checked = selectedKeys.has(slotKey(slot))
                  const full = isFull(slot) && !checked
                  return (
                    <div key={jour.id}>
                      <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                        <MapPin className="size-3.5 text-primary" aria-hidden />
                        {jour.label}
                      </p>
                      {full ? (
                        <span className="flex items-center justify-between gap-2 rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
                          {creneau}
                          <span className="text-xs font-medium">Complet</span>
                        </span>
                      ) : (
                        <label
                          className={`flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2 text-sm transition-colors ${
                            checked
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={checked}
                            onChange={() => toggle(slot)}
                          />
                          <span
                            className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                              checked
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-input bg-background"
                            }`}
                            aria-hidden
                          >
                            {checked && <Check className="size-3" />}
                          </span>
                          {creneau}
                        </label>
                      )}
                    </div>
                  )
                })}
              </div>
            </fieldset>
          ))}

          {POSTES.map((poste) => (
            <fieldset
              key={poste.id}
              className="rounded-xl border border-border bg-card p-4 sm:p-5"
            >
              <legend className="sr-only">{poste.label}</legend>
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className="font-serif text-lg text-card-foreground">{poste.label}</h3>
                <span className="text-xs text-muted-foreground">{poste.description}</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {JOURS.filter((jour) => jour.creneaux.length > 0).map((jour) => {
                  const visibleCreneaux = jour.creneaux.filter(
                    (creneau) =>
                      !isFull({ poste: poste.label, jour: jour.label, creneau }) ||
                      selectedKeys.has(slotKey({ poste: poste.label, jour: jour.label, creneau })),
                  )
                  return (
                  <div key={jour.id}>
                    <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <MapPin className="size-3.5 text-primary" aria-hidden />
                      {jour.label}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {visibleCreneaux.length === 0 && (
                        <span className="rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
                          Complet pour cette journée
                        </span>
                      )}
                      {visibleCreneaux.map((creneau) => {
                        const slot: Slot = {
                          poste: poste.label,
                          jour: jour.label,
                          creneau,
                        }
                        const checked = selectedKeys.has(slotKey(slot))
                        return (
                          <label
                            key={creneau}
                            className={`flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2 text-sm transition-colors ${
                              checked
                                ? "border-primary bg-primary/10 text-foreground"
                                : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={checked}
                              onChange={() => toggle(slot)}
                            />
                            <span
                              className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                                checked
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-input bg-background"
                              }`}
                              aria-hidden
                            >
                              {checked && <Check className="size-3" />}
                            </span>
                            {creneau}
                          </label>
                        )
                      })}
                    </div>
                  </div>
                  )
                })}
              </div>
            </fieldset>
          ))}
        </div>

        {/* Récapitulatif */}
        {selected.length > 0 && (
          <div className="mt-4 rounded-xl border border-border bg-secondary p-4">
            <p className="mb-2 text-sm font-medium text-secondary-foreground">
              {selected.length} créneau{selected.length > 1 ? "x" : ""} sélectionné
              {selected.length > 1 ? "s" : ""}
            </p>
            <ul className="flex flex-wrap gap-2">
              {selected.map((s) => (
                <li key={slotKey(s)}>
                  <button
                    type="button"
                    onClick={() => toggle(s)}
                    className="flex items-center gap-1.5 rounded-full bg-primary/10 py-1 pl-3 pr-2 text-xs text-foreground transition-colors hover:bg-primary/20"
                  >
                    <span className="font-medium">{s.poste}</span>
                    <span className="text-muted-foreground">
                      · {s.jour.split(" ")[0]} · {s.creneau}
                    </span>
                    <X className="size-3.5" aria-hidden />
                    <span className="sr-only">Retirer ce créneau</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Coordonnées */}
      <section aria-labelledby="infos-title">
        <div className="mb-4">
          <h2 id="infos-title" className="font-serif text-2xl text-foreground">
            2. Vos coordonnées
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Pour vous contacter et confirmer votre planning.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Prénom" name="firstName" autoComplete="given-name" required />
          <Field label="Nom" name="lastName" autoComplete="family-name" required />
          <Field
            label="Adresse e-mail"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
          <Field label="Téléphone" name="phone" type="tel" autoComplete="tel" required />
          <div className="sm:col-span-2">
            <label
              htmlFor="notes"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Remarques{" "}
              <span className="font-normal text-muted-foreground">(facultatif)</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Régime alimentaire, contraintes horaires, préférences…"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
        </div>
      </section>

      <input type="hidden" name="slots" value={JSON.stringify(selected)} />

      <div className="flex flex-col gap-3 border-t border-border pt-6">
        {state.status === "error" && (
          <p
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {state.message}
          </p>
        )}
        <SubmitButton disabled={selected.length === 0} />
      </div>
    </form>
  )
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  autoComplete?: string
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
      />
    </div>
  )
}
