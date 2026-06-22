-- ============================================================
-- Schema untuk Admin Dashboard - PAGODA STUDIO
-- Jalankan SQL ini di Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- SECURITY DEFINER function to check admin (avoids RLS recursion)
-- Dibutuhkan oleh RLS policies di bawah
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
$$;

-- ============================================================
-- SITE SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id BIGINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_name TEXT NOT NULL DEFAULT 'PAGODA STUDIO',
  tagline TEXT NOT NULL DEFAULT 'Jasa Pembuatan Website Profesional',
  description TEXT NOT NULL DEFAULT 'Website modern, cepat, mobile friendly...',
  logo_url TEXT,
  favicon_url TEXT,
  whatsapp_number TEXT NOT NULL DEFAULT '6282210099969',
  email TEXT DEFAULT 'info@pagodastudio.com',
  address TEXT DEFAULT 'Payakumbuh, Sumbar',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site_settings" ON site_settings FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============================================================
-- HERO SECTION
-- ============================================================
CREATE TABLE IF NOT EXISTS hero_content (
  id BIGINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  badge_text TEXT NOT NULL DEFAULT 'PAGODA STUDIO — Since 2024',
  title_line1 TEXT NOT NULL DEFAULT 'Jasa Pembuatan',
  title_line2 TEXT NOT NULL DEFAULT 'Website Profesional',
  subtitle TEXT NOT NULL DEFAULT 'Website modern, cepat, mobile friendly, dan siap membantu bisnis Anda tampil lebih profesional dan mendapatkan lebih banyak pelanggan.',
  cta_text TEXT NOT NULL DEFAULT 'Konsultasi Gratis',
  cta_link TEXT NOT NULL DEFAULT 'https://wa.me/6282210099969',
  secondary_cta_text TEXT NOT NULL DEFAULT 'Lihat Paket',
  secondary_cta_link TEXT NOT NULL DEFAULT '#paket',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hero" ON hero_content FOR SELECT USING (true);
CREATE POLICY "Admins can manage hero" ON hero_content FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============================================================
-- SERVICES
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '💻',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view services" ON services FOR SELECT USING (true);
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============================================================
-- PRICING PACKAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS pricing (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pricing" ON pricing FOR SELECT USING (true);
CREATE POLICY "Admins can manage pricing" ON pricing FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============================================================
-- PORTFOLIO
-- ============================================================
CREATE TABLE IF NOT EXISTS portfolio (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  gradient_from TEXT NOT NULL DEFAULT 'emerald-600',
  gradient_to TEXT NOT NULL DEFAULT 'teal-700',
  project_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view portfolio" ON portfolio FOR SELECT USING (true);
CREATE POLICY "Admins can manage portfolio" ON portfolio FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============================================================
-- WHY US
-- ============================================================
CREATE TABLE IF NOT EXISTS why_us (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'star',
  gradient TEXT NOT NULL DEFAULT 'from-emerald-500/20 to-emerald-500/5',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE why_us ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view why_us" ON why_us FOR SELECT USING (true);
CREATE POLICY "Admins can manage why_us" ON why_us FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============================================================
-- SEED DATA
-- ============================================================

-- Hero Content
INSERT INTO hero_content (badge_text, title_line1, title_line2, subtitle)
VALUES ('PAGODA STUDIO — Since 2024', 'Jasa Pembuatan', 'Website Profesional',
'Website modern, cepat, mobile friendly, dan siap membantu bisnis Anda tampil lebih profesional dan mendapatkan lebih banyak pelanggan.')
ON CONFLICT (id) DO NOTHING;

-- Site Settings
INSERT INTO site_settings (site_name, tagline, description, whatsapp_number, address)
VALUES ('PAGODA STUDIO', 'Jasa Pembuatan Website Profesional',
'Website modern, cepat, mobile friendly...', '6282210099969', 'Payakumbuh, Sumbar')
ON CONFLICT (id) DO NOTHING;

-- Services
INSERT INTO services (title, description, icon, sort_order) VALUES
('Website Universitas', 'Portal kampus, informasi akademik, pendaftaran mahasiswa, dan sistem pendidikan modern.', '🎓', 1),
('Website Sekolah', 'Website sekolah modern lengkap dengan informasi, galeri, PPDB, dan berita sekolah.', '📚', 2),
('Website Property', 'Website property untuk perumahan, apartemen, agen properti, dan listing rumah.', '🏢', 3),
('Company Profile', 'Tampilan profesional untuk meningkatkan branding dan kepercayaan bisnis Anda.', '🏬', 4),
('Website Travel', 'Website travel dan tour lengkap dengan paket wisata dan booking online.', '✈️', 5),
('Klinik & RS', 'Sistem informasi kesehatan, jadwal dokter, dan layanan pasien online.', '🏥', 6),
('Toko Online', 'Website e-commerce modern untuk menjual produk secara online.', '🛒', 7),
('Website Hotel', 'Website hotel dan penginapan dengan fitur booking dan reservasi online.', '🏨', 8),
('Restaurant & Cafe', 'Website menu digital, reservasi meja, dan promosi cafe atau restaurant.', '🍽️', 9),
('Pemerintahan', 'Portal informasi instansi pemerintahan dan pelayanan publik digital.', '🏛️', 10),
('Portal Berita', 'Portal media online dan berita dengan sistem kategori dan artikel lengkap.', '📰', 11),
('Custom Web App', 'Sistem dashboard, ERP, CRM, booking system, dan aplikasi berbasis web custom.', '💻', 12)
ON CONFLICT (id) DO NOTHING;

-- Pricing
INSERT INTO pricing (name, price, features, is_popular, sort_order) VALUES
('Landing Page', 'Rp1,2 Juta', '["1 Halaman Profesional","Mobile Responsive","Tombol WhatsApp","Copywriting Basic","Fast Loading","Basic SEO","Gratis Domain 1 Tahun","Revisi 2x"]', false, 1),
('Starter UMKM', 'Rp2 Juta', '["1–5 Halaman","Mobile Responsive","WhatsApp Chat","Google Maps","Basic SEO","Gratis Domain 1 Tahun","Gratis Hosting 1 Tahun","Revisi 2x"]', false, 2),
('Business Pro', 'Rp5 Juta', '["Semua Fitur Starter","Desain Semi Custom","SEO Optimasi","Blog / Artikel","Optimasi Speed","Training Admin","Backup Website","Revisi 4x"]', true, 3),
('Premium Custom', 'Mulai Rp10 Juta', '["UI/UX Full Custom","Dashboard Admin","Login Member","Payment Gateway","Integrasi API","Advanced Security","Priority Support","Maintenance 3 Bulan"]', false, 4),
('Aplikasi Android & iOS', 'Mulai Rp15 Juta', '["Aplikasi Android & iOS","UI/UX Modern","Login User","Push Notification","Integrasi API","Dashboard Admin","Maintenance 1 Bulan","Source Code Full"]', false, 5)
ON CONFLICT (id) DO NOTHING;

-- Why Us
INSERT INTO why_us (title, description, icon_name, gradient, sort_order) VALUES
('Desain Modern', 'Tampilan elegan dan profesional untuk meningkatkan kepercayaan customer.', 'image', 'from-emerald-500/20 to-emerald-500/5', 1),
('Mobile Friendly', 'Website tampil optimal di HP, tablet, maupun desktop.', 'smartphone', 'from-blue-500/20 to-blue-500/5', 2),
('Fast Loading', 'Website ringan dan cepat diakses untuk pengalaman pengguna yang lebih baik.', 'zap', 'from-yellow-500/20 to-yellow-500/5', 3),
('Support Cepat', 'Kami siap membantu jika ada kendala atau update website.', 'settings', 'from-purple-500/20 to-purple-500/5', 4)
ON CONFLICT (id) DO NOTHING;

-- Portfolio
INSERT INTO portfolio (title, category, description, gradient_from, gradient_to, sort_order) VALUES
('SMA Nusantara', 'Website Sekolah', 'Website sekolah lengkap dengan sistem PPDB online, info akademik, dan galeri kegiatan.', 'emerald-600', 'teal-700', 1),
('GreenHill Residence', 'Website Property', 'Landing page modern untuk perumahan dengan virtual tour 3D dan booking unit online.', 'blue-600', 'cyan-700', 2),
('WarungBahagia', 'Toko Online', 'E-commerce dengan payment gateway, manajemen stok, dan dashboard admin lengkap.', 'orange-600', 'amber-700', 3),
('Klinik Sehati', 'Klinik & RS', 'Sistem reservasi online, jadwal dokter, dan rekam medis pasien terintegrasi.', 'sky-600', 'indigo-700', 4),
('Java Adventure', 'Website Travel', 'Portal travel dengan paket wisata, booking online, dan galeri destinasi interaktif.', 'violet-600', 'purple-700', 5),
('Hotel Grand Palace', 'Website Hotel', 'Website hotel dengan fitur reservasi kamar, menu restoran, dan virtual tour.', 'rose-600', 'pink-700', 6),
('BeritaKota', 'Portal Berita', 'Portal berita modern dengan sistem kategori, tag, dan artikel multimedia.', 'slate-600', 'gray-700', 7),
('TechBiz Solutions', 'Company Profile', 'Company profile interaktif dengan portfolio digital, tim, dan fitur inquiry.', 'green-700', 'emerald-800', 8)
ON CONFLICT (id) DO NOTHING;
