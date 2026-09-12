"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { adminLogin, type AdminLoginState } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Loader2, Lock } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="h-11 w-full text-base font-semibold">
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Connexion…
        </>
      ) : (
        "Se connecter"
      )}
    </Button>
  )
}

export function AdminLoginForm() {
  const initialState: AdminLoginState = { status: "idle" }
  const [state, formAction] = useActionState(adminLogin, initialState)

  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4 py-10">
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Lock className="size-5" aria-hidden />
        </div>
        <h1 className="mt-4 text-center font-serif text-2xl text-card-foreground">
          Espace coordination
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Accès réservé à l&apos;équipe de coordination bénévoles.
        </p>

        <form action={formAction} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>

          {state.status === "error" && (
            <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.message}
            </p>
          )}

          <SubmitButton />
        </form>
      </div>
    </div>
  )
}
