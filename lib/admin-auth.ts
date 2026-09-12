import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

const COOKIE_NAME = "admin_session"
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8 // 8 heures

function getSecret() {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret) {
    throw new Error(
      "ADMIN_PASSWORD n'est pas défini. Ajoutez-le à votre .env pour activer la page admin.",
    )
  }
  return secret
}

function signToken(secret: string) {
  return createHmac("sha256", secret).update("admin-authenticated").digest("hex")
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD)
}

export function verifyAdminPassword(password: string) {
  const secret = getSecret()
  const expected = Buffer.from(secret)
  const actual = Buffer.from(password)
  if (expected.length !== actual.length) return false
  return timingSafeEqual(expected, actual)
}

export async function createAdminSession() {
  const secret = getSecret()
  const store = await cookies()
  store.set(COOKIE_NAME, signToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
}

export async function clearAdminSession() {
  const store = await cookies()
  store.delete({ name: COOKIE_NAME, path: "/admin" })
}

export async function isAdminAuthenticated() {
  if (!isAdminConfigured()) return false
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  if (!token) return false
  const secret = getSecret()
  const expected = signToken(secret)
  const tokenBuf = Buffer.from(token)
  const expectedBuf = Buffer.from(expected)
  if (tokenBuf.length !== expectedBuf.length) return false
  return timingSafeEqual(tokenBuf, expectedBuf)
}
