import { jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export type SignupSlot = {
  poste: string
  jour: string
  creneau: string
}

export const volunteerSignups = pgTable("volunteer_signups", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  slots: jsonb("slots").$type<SignupSlot[]>().notNull().default([]),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type VolunteerSignup = typeof volunteerSignups.$inferSelect
