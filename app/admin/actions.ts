"use server"

import { redirect } from "next/navigation"
import {
  clearAdminSession,
  createAdminSession,
  isAdminConfigured,
  verifyAdminPassword,
} from "@/lib/admin-auth"

export type AdminLoginState = {
  status: "idle" | "error"
  message?: string
}

export async function adminLogin(
  _prev: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  if (!isAdminConfigured()) {
    return {
      status: "error",
      message: "ADMIN_PASSWORD n'est pas configuré sur le serveur. Contactez la personne en charge du déploiement.",
    }
  }

  const password = String(formData.get("password") ?? "")
  if (!password || !verifyAdminPassword(password)) {
    return { status: "error", message: "Mot de passe incorrect." }
  }

  await createAdminSession()
  redirect("/admin")
}

export async function adminLogout() {
  await clearAdminSession()
  redirect("/admin")
}
