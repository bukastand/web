import { NextResponse } from "next/server";

/**
 * GET /api/admin/contacts
 * Dummy endpoint — contact saat ini dikirim via Resend email,
 * belum disimpan ke database. Berisi petunjuk untuk implementasi database.
 */
export async function GET() {
  // Saat ini contact form mengirim email via Resend langsung
  // (lihat src/app/api/contact/route.ts)
  // Data tidak disimpan ke database.

  return NextResponse.json({
    contacts: [],
    status: "email_only",
    message:
      "Contact form saat ini mengirim email via Resend. " +
      "Data tidak disimpan di database. " +
      "Untuk menyimpan ke database, buat tabel contacts dan ubah POST /api/contact.",
    hint: {
      sql: `-- Buat tabel contacts:
CREATE TABLE IF NOT EXISTS contacts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  page_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_read BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view contacts" ON contacts
  FOR ALL USING (public.is_admin());`,
    },
  });
}
