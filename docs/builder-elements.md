# 📦 Dokumentasi Element Builder

Seluruh elemen yang tersedia di **PAGODA STUDIO Website Builder**. Setiap elemen bisa di-drag ke canvas, dikustomisasi konten dan style-nya, serta diatur responsive visibility-nya.

---

## 🚀 Buat Landing Page Gratis

Ingin membuat landing page profesional **tanpa biaya**? Ikuti langkah-langkah berikut:

### 1. Registrasi Akun
Daftar akun gratis di halaman **Register**. Tidak perlu kartu kredit — cukup email dan password.

### 2. Buat Halaman Baru
Setelah login, klik **Buat Halaman Baru** di dashboard builder. Beri judul yang relevan dengan konten landing page Anda.

### 3. Pilih Template (Opsional)
Gunakan tab **Templates** di sidebar untuk memulai dengan section siap pakai. Pilih template yang sesuai dengan kebutuhan Anda.

### 4. Susun Elemen Landing Page
Landing page ideal terdiri dari:

| Urutan | Elemen | Fungsi |
|--------|--------|--------|
| 1 | **Heading** + **Animated Headline** | Judul utama yang menarik perhatian |
| 2 | **Text** | Deskripsi singkat value proposition |
| 3 | **Image** atau **Hero Slides** | Visual/banner utama |
| 4 | **Features Grid** | Menampilkan fitur/layanan unggulan |
| 5 | **Stats Counter** | Bukti sosial (klien, project, pengalaman) |
| 6 | **Testimonial** | Testimonial klien untuk membangun kepercayaan |
| 7 | **Pricing Table** | Tabel paket harga (opsional) |
| 8 | **Contact Form** | Form kontak + WhatsApp untuk konversi |
| 9 | **CTA Section** | Call-to-action terakhir |
| 10 | **Footer** | Informasi kontak & navigasi tambahan |

### 5. Atur Style & Branding
1. Pilih **warna utama** yang konsisten (gunakan color picker di setiap elemen)
2. Atur **font family** sesuai brand Anda
3. Gunakan style panel untuk mengatur **padding, margin, dan alignment**
4. Tambahkan **background gambar/gradient** untuk section tertentu

### 6. Publikasikan
1. Klik tombol **Publish** di toolbar atas
2. Halaman akan live di domain: `https://pagodastudio.my.id/[slug-halaman]`
3. Bagikan link ke klien atau pasang di sosial media

> 💡 **Tips:** Landing page gratis sudah termasuk hosting, SSL, dan domain subdomain. Upgrade ke paket premium untuk custom domain dan fitur tambahan.

---

## 📋 Daftar Isi

- [Kategori Elemen](#kategori-elemen)
- [Cara Menggunakan](#cara-menggunakan)
- [Style Umum (Semua Elemen)](#style-umum-semua-elemen)
- [Elemen Teks](#-teks)
- [Elemen Layout](#-layout)
- [Elemen Media](#-media)
- [Elemen Interaktif](#-interaktif)
- [Elemen Konten](#-konten)
- [Elemen Struktur](#-struktur)
- [Elemen Premium](#-premium)
- [Elemen 3D](#-3d-elements)
- [Tips & Trik](#-tips--trik)

---

## Kategori Elemen

| Kategori | Daftar Elemen |
|----------|--------------|
| **Teks** | Heading, Text |
| **Layout** | Spacer, Divider |
| **Media** | Image, Video, Icon |
| **Interaktif** | Button |
| **Konten** | Features Grid, Pricing Table, Testimonial, CTA Section, Stats Counter, Contact Form, Google Maps, FAQ Accordion, Tim Kami, Carousel, Countdown |
| **Struktur** | Navbar, Footer |
| **Premium** | Animated Headline, Blockquote, Code Highlight, Flip Box, Hotspot, Progress Tracker, Share Buttons, Checklist, Gallery, Lottie Animation, Star Rating, Search, Floating Button, Breadcrumbs, Off Canvas, Hero Slides, Nested Carousel, Video Playlist, Table of Contents, Social Embed, Custom HTML |
| **3D** | 3D Background, 3D Scene, 3D Particles, 3D Model |

---

## Cara Menggunakan

1. **Tambah Elemen:** Drag elemen dari sidebar kiri ke canvas
2. **Edit Konten:** Klik elemen di canvas → panel kanan terbuka → tab **Konten**
3. **Edit Style:** Klik elemen di canvas → panel kanan → tab **Style**
4. **Edit Langsung:** Double-click teks untuk edit langsung di canvas
5. **Hapus/Duplikat:** Klik elemen → gunakan tombol ▲ Atas / ▼ Bawah / 📋 Duplikat / 🗑 Hapus
6. **Responsive:** Klik elemen → tab Style → bagian Responsive → toggle Sembunyi per perangkat

---

## Style Umum (Semua Elemen)

Setiap elemen memiliki panel **Style** dengan opsi berikut:

| Bagian | Field | Deskripsi |
|--------|-------|-----------|
| **Tata Letak** | Alignment | `left`, `center`, `right` |
| | Object Fit | `cover`, `contain`, `fill`, `none`, `scale-down` (khusus image/video) |
| | Opacity | Nilai 0-1 (khusus image/video) |
| | Warna Teks | Color picker (khusus heading/text) |
| | Ukuran Font | Slider + preset 8px-72px (khusus heading/text) |
| | Ketebalan | 100-900 (khusus heading/text) |
| | Font Family | Inter, Arial, Georgia, Roboto, dll (khusus heading/text) |
| **Background** | Warna Background | Color picker |
| | Opacity Background | Nilai opacity |
| | Gambar Background | Upload image |
| | Ukuran Background | `cover`, `contain`, `auto` |
| | Posisi Background | `center`, `top`, `bottom`, dll |
| | Gradient Background | Gradient builder |
| **Spasi** | Padding | Top, Bottom, Left, Right (individual) |
| | Margin | Top, Bottom, Left, Right (individual) |
| **Border** | Radius | Per sudut (Top Left, Top Right, Bottom Left, Bottom Right) |
| | Lebar Border | Nilai dalam px |
| | Warna Border | Color picker |
| | Style Border | `solid`, `dashed`, `dotted`, `double`, `none` |
| **Responsive** | Sembunyi Mobile | Sembunyikan di < 640px |
| | Sembunyi Tablet | Sembunyikan di 640-1024px |
| | Sembunyi Desktop | Sembunyikan di > 1024px |
| **Ukuran** | Width, Max Width | Nilai css (px, %, rem, dll) |
| | Height, Max Height | Nilai css (px, %, vh, dll) |

---

## 📝 Teks

### Heading

Elemen judul/heading dengan level h1-h6.

**Konten:**
| Field | Tipe | Default | Deskripsi |
|-------|------|---------|-----------|
| `text` | Text | "Judul Heading" | Teks heading |
| `level` | Select | `h2` | Level heading: h1, h2, h3, h4, h5, h6 |
| `align` | Select | `center` | Posisi teks: left, center, right |

**Style Khusus:** Bisa di-edit langsung di canvas (double-click).

### Text

Elemen paragraf untuk teks deskripsi.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `text` | Textarea | "Lorem ipsum..." |

**Style Khusus:** Bisa di-edit langsung di canvas. Mendukung `white-space: pre-line` untuk line breaks.

---

## 📐 Layout

### Spacer

Memberi jarak vertikal antar elemen.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `height` | Text | `40px` |

### Divider

Garis pemisah horizontal.

**Konten:**
| Field | Tipe | Default | Deskripsi |
|-------|------|---------|-----------|
| `style` | Select | `solid` | `solid`, `dashed`, `dotted` |
| `color` | Color | `#e2e8f0` | Warna garis |

---

## 🖼 Media

### Image

Menampilkan gambar dengan caption opsional.

**Konten:**
| Field | Tipe | Default | Deskripsi |
|-------|------|---------|-----------|
| `src` | Image upload / URL | Placeholder | Upload gambar atau masukkan URL |
| `alt` | Text | Caption / "Gambar" | Alt text untuk SEO & aksesibilitas |
| `caption` | Text | "" | Teks caption di bawah gambar |

**Fitur:**
- Upload gambar → kompresi WebP otomatis → upload ke Supabase Storage
- Jika upload gagal, fallback ke Data URL
- `loading="lazy"` untuk performa

### Video

Embed video YouTube atau platform lain.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `url` | URL | YouTube embed |
| `caption` | Text | "" |

### Icon

Menampilkan icon SVG dari koleksi built-in.

**Konten:**
| Field | Tipe | Default | Deskripsi |
|-------|------|---------|-----------|
| `icon` | Select | `star` | Pilihan: star, heart, rocket, globe, lightbulb, shield, chart, users, cog, check |
| `size` | Text | `48px` | Ukuran icon |
| `color` | Color | `#22c55e` | Warna icon |

---

## 🎯 Interaktif

### Button

Tombol dengan link, bisa diedit langsung.

**Konten:**
| Field | Tipe | Default | Deskripsi |
|-------|------|---------|-----------|
| `text` | Text | "Klik Disini" | Bisa diedit langsung di canvas |
| `href` | URL | `#` | Link tujuan |
| `target` | Select | `_self` | `_self`, `_blank` |
| `variant` | Select | `primary` | `primary` (hijau), `secondary` (transparan), `outline` (border) |

---

## 📊 Konten

### Features Grid

Grid fitur/layanan dengan icon, judul, dan deskripsi.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `title` | Text | "Fitur Unggulan" |
| `subtitle` | Text | "Mengapa memilih kami?" |
| `columns` | Number | 3 |
| `items[]` | Array | 3 item default |

**Style Per Item:** icon, title, desc — warna dan ukuran bisa diatur.
**Style Warna:** titleColor, titleSize, subtitleColor, itemBg, itemBorder, itemTitleColor, itemTextColor

### Pricing Table

Tabel harga/paket dengan fitur, highlight, dan CTA.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `title` | Text | "Paket Harga" |
| `subtitle` | Text | "Pilih paket yang sesuai" |
| `items[]` | Array | Basic, Pro (highlighted), Premium |

**Per Item:** name, price, desc, features[], highlighted (boolean), cta.
**Style:** cardBg, cardBorder, highlightBg, cardNameColor, cardPriceColor, cardDescColor, cardFeatureColor

### Testimonial

Kartu testimonial dengan rating bintang, avatar, dan detail author.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `title` | Text | "Apa Kata Klien" |
| `items[]` | Array | 2 testimonial default |

**Per Item:** name, role, text, rating (1-5), avatar (inisial).
**Style:** cardBg, cardBorder, cardTextColor, authorNameColor, authorNameSize, authorRoleColor, avatarBg

### CTA Section

Section Call-to-Action dengan judul, subtitle, dan tombol.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `title` | Text | "Siap Memulai?" |
| `subtitle` | Text | "Hubungi kami sekarang" |
| `buttonText` | Text | "Konsultasi Gratis" |
| `buttonHref` | URL | WhatsApp link |

**Fitur:** Semua field bisa diedit langsung di canvas (double-click).

### Stats Counter

Menampilkan statistik/angka dengan label.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `columns` | Number | 4 |
| `items[]` | Array | 4 item default |

**Per Item:** value (contoh: "50+"), label (contoh: "Project Selesai").
**Style:** valueColor, valueSize, valueWeight, labelColor, labelSize

### Contact Form

Form kontak dengan WhatsApp fallback + email.

**Konten:**
| Field | Tipe | Default | Deskripsi |
|-------|------|---------|-----------|
| `title` | Text | "Hubungi Kami" | |
| `subtitle` | Text | "Isi form di bawah..." | |
| `whatsappNumber` | Text | `6282210099969` | Nomor WA tujuan |
| `recipientEmail` | Text | "" | Email untuk kirim pesan via Resend |
| `siteName` | Text | "" | Nama website untuk subject email |

**Fitur:**
- Input: name, email, phone, message
- Saat submit: buka WhatsApp + kirim email (jika recipientEmail diisi)
- Rate limiting: 3 request per IP per 60 detik

### Google Maps

Embed peta Google Maps dengan berbagai format URL.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `title` | Text | "Lokasi Kami" |
| `address` | Text | "Jakarta, Indonesia" |
| `embedUrl` | URL | Google Maps link |

**Format URL yang didukung:**
- `maps?q=lat,lng` — query coordinates
- `@lat,lng,zoom` — coordinates with zoom
- `/embed` — direct embed URL
- `share.google.com` — shared link (di-resolve otomatis via API)

### FAQ Accordion

Accordion tanya-jawab yang bisa di-expand.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `title` | Text | "FAQ" |
| `subtitle` | Text | "" |
| `items[]` | Array | 3 FAQ default |

**Per Item:** question, answer.
**Style:** itemBg, itemBorder, questionColor, questionSize, questionWeight, answerColor, answerSize, iconColor

### Tim Kami

Kartu anggota tim dengan foto, nama, role, dan social links.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `title` | Text | "Tim Kami" |
| `subtitle` | Text | "Kenali tim profesional kami" |
| `members[]` | Array | 3 anggota default |

**Per Member:** name, role, image (upload/URL), socials[] (platform + url).
**Style:** cardBg, cardBorder, nameColor, nameSize, roleColor, avatarSize, socialIconColor, socialIconHoverColor

### Carousel

Slider gambar dengan auto-play, navigasi arrow, dan dots.

**Konten:**
| Field | Tipe | Default | Deskripsi |
|-------|------|---------|-----------|
| `title` | Text | "Galeri Kami" | |
| `slides[]` | Array | 3 slide default | image + caption |
| `autoPlay` | Checkbox | true | Auto-slide |
| `interval` | Number | 4000 | Interval dalam ms |

### Countdown

Timer countdown ke tanggal tertentu.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `title` | Text | "Segera Hadir" |
| `targetDate` | Date | 30 hari dari sekarang |
| `labelDays/Hours/Minutes/Seconds` | Text | "Hari", "Jam", "Menit", "Detik" |

---

## 🏗 Struktur

### Navbar

Navigasi bar dengan logo, menu links, dan CTA button.

**Konten:**
| Bagian | Field | Default |
|--------|-------|---------|
| **Logo** | `logo` | "PAGODA STUDIO" |
| | `logoImage` | Upload/URL |
| | `logoHeight` | `32` |
| | `logoColor`, `logoFontSize`, `logoFontWeight` | Style logo |
| **Menu** | `links[]` | Beranda, Tentang, Layanan, Kontak |
| | `menuColor`, `menuHoverColor` | Warna link |
| **CTA** | `ctaText` | "Hubungi Kami" |
| | `ctaHref` | WhatsApp link |
| | `ctaBgColor`, `ctaColor` | Style tombol |

**Fitur:** Mobile hamburger menu, menu hover underline animation.

### Footer

Footer dengan logo, deskripsi, link navigasi, dan social media.

**Konten:**
| Bagian | Field | Default |
|--------|-------|---------|
| **Logo** | `logo`, `logoImage` | "PAGODA STUDIO" |
| **Deskripsi** | `description` | "Jasa pembuatan website..." |
| **Links** | `links[]` | Tentang, Layanan, Portfolio, Kontak |
| **Social** | `socials[]` | Instagram, Facebook, YouTube |
| **Copyright** | `copyright` | Dinamis tahun sekarang |

**Style Lengkap:** Setiap bagian punya warna, ukuran, dan font sendiri.

---

## ✨ Premium

### Animated Headline

Headline dengan efek animasi highlight atau rotating text.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `beforeText` | Text | "Saya adalah" |
| `highlightedText` | Text | "Profesional" |
| `afterText` | Text | "" |
| `style` | Select | `highlight` / `rotating` |
| `animationType` | Select | `underline`, `circle`, `curly` |
| `tag` | Select | h1-h6, p |
| `rotatingTexts[]` | Text (comma) | Kreatif, Inovatif, Profesional |

**Animasi Highlight:**
- **underline:** Garis dari kiri ke kanan
- **circle:** Lingkaran di belakang teks (pop)
- **curly:** Garis curly/ikal di bawah teks

**Rotating:** Teks berganti-ganti dengan efek fade + translate.

### Blockquote

Kutipan dengan author credit dan tweet button opsional.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `quoteText` | Textarea | Lorem ipsum... |
| `authorName` | Text | "Ahmad Fauzi" |
| `skin` | Select | `border`, `quotation`, `boxed`, `clean` |
| `tweetButton` | Checkbox | false |

**Skin:**
- **border:** Garis kiri
- **quotation:** Tanda kutip besar di kiri
- **boxed:** Kotak dengan border
- **clean:** Tanpa hiasan

### Code Highlight

Menampilkan kode dengan syntax highlight dan nomor baris.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `language` | Text | "javascript" |
| `code` | Textarea | `console.log(...)` |
| `showLineNumbers` | Checkbox | true |
| `copyButton` | Checkbox | true |

### Flip Box

Kotak yang berputar 3D saat hover — sisi depan dan belakang berbeda.

**Konten:**
| Bagian | Field | Default |
|--------|-------|---------|
| **Front** | `frontGraphic` | `icon`, `image`, `none` |
| | `frontIcon` | star, heart, rocket, dll |
| | `frontImage` | Upload/URL |
| | `frontTitle`, `frontDescription` | Teks |
| | `frontBackground` | `#1e293b` |
| **Back** | `backTitle`, `backDescription` | Teks |
| | `backBackground` | `#22c55e` |
| | `backButtonText`, `backButtonLink` | Tombol |

### Hotspot

Gambar dengan marker interaktif yang menampilkan popup info.

**Konten:**
| Bagian | Field | Default |
|--------|-------|---------|
| **Gambar** | `imageSrc` | Upload/URL placeholder |
| **Marker** | `items[]` | 2 marker default (x%, y%) |
| **Popup** | `popupBg`, `popupWidth`, dll | Style popup |

**Per Marker:** label, x (%), y (%), description.

### Progress Tracker

Progress bar horizontal atau circular.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `type` | Select | `horizontal` / `circular` |
| `progress` | Range 0-100 | 65% |
| `label` | Text | "Progress" |
| `percentage` | Checkbox | true |

### Share Buttons

Tombol share ke sosial media.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `view` | Select | `icon-text`, `icon`, `text` |
| `skin` | Select | `gradient`, `minimal`, `framed`, `boxed-icon`, `flat` |
| `networks[]` | Array | Facebook, Twitter, LinkedIn |

**Jaringan:** facebook, twitter, linkedin, whatsapp, telegram.

### Checklist

Daftar item dengan icon checklist.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `title` | Text | "Keunggulan Kami" |
| `items[]` | Array | 3 item default |
| `checkedColor` | Color | `#22c55e` |

**Per Item:** text, checked (boolean).

### Gallery

Grid gambar dengan lightbox preview.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `title` | Text | "Galeri" |
| `columns` | Number | 3 |
| `lightbox` | Checkbox | true |
| `images[]` | Array | 6 gambar default |

**Per Image:** src (upload/URL), caption, alt.

### Lottie Animation

Animasi Lottie dari file .json.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `src` | File upload / URL | LottieFiles demo |
| `loop` | Checkbox | true |
| `autoplay` | Checkbox | true |
| `width`, `height` | Text | 300px |

### Star Rating

Rating bintang dengan nilai.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `title` | Text | "Rating" |
| `rating` | Range 0-5 (0.5 step) | 4.5 |
| `scale` | Number | 5 |
| `showValue` | Checkbox | true |
| `starColor` | Color | `#f59e0b` (kuning) |
| `size` | Text | 24px |
| `align` | Select | `center` |

### Search

Search bar dengan Google search.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `placeholder` | Text | "Cari..." |
| `buttonText` | Text | "Cari" |
| `buttonIcon` | Checkbox | true |
| `skin` | Select | `classic`, `minimal`, `fill` |

### Floating Button

Tombol floating di pojok halaman.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `position` | Select | `bottom-right`, `bottom-left`, `top-right`, `top-left` |
| `buttons[]` | Array | Chat, Phone, Email |

**Per Button:** icon (chat/phone/mail/whatsapp), link, color.

### Breadcrumbs

Navigasi breadcrumb.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `items[]` | Array | Beranda, Layanan, Halaman Saat Ini |
| `separator` | Select | `/`, `>`, `|`, `•`, `→` |

### Off Canvas

Panel geser samping (slide-in menu).

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `title` | Text | "Menu" |
| `position` | Select | `right` / `left` |
| `width` | Text | 320px |
| `overlay` | Checkbox | true |
| `closeButton` | Checkbox | true |
| `items[]` | Array | Menu links |

### Hero Slides

Full-width slideshow hero dengan teks overlay, tombol, dan efek Ken Burns.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `slideHeight` | Text | 600px |
| `autoplay` | Checkbox | true |
| `kenBurns` | Checkbox | true |
| `slides[]` | Array | 3 slide default |

**Per Slide:** title, description, image (upload/URL), buttonText, buttonLink.

### Nested Carousel

Carousel multi-item dengan card.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `title` | Text | "Carousel" |
| `slidesPerView` | Number | 3 |
| `gap` | Number | 20px |
| `autoplay` | Checkbox | true |
| `loop` | Checkbox | true |
| `slides[]` | Array | 4 card default |

### Video Playlist

Player video dengan daftar putar di samping.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `title` | Text | "Video Playlist" |
| `videos[]` | Array | 3 video default |
| `playlistBg` | Color | `#0f172a` |

**Per Video:** title, description, url (YouTube embed), duration.

### Table of Contents

Daftar isi otomatis/manual.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `title` | Text | "Daftar Isi" |
| `markers` | Select | `numbers` / `bullets` |
| `minimizeBox` | Checkbox | true |
| `items[]` | Array | Heading manual |

### Social Embed

Embed halaman Facebook, tombol like, komentar, atau postingan.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `type` | Select | `facebook-page`, `facebook-button`, `facebook-comments`, `facebook-embed` |
| `url` | URL | Facebook page |
| `width`, `height` | Text | 340px, 500px |

### Custom HTML

Tempat untuk menambahkan kode HTML kustom.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `html` | Textarea | `<div>Custom HTML</div>` |

⚠️ **Keamanan:** Script (JS) akan berjalan di halaman publikasi. Kode di-sanitize otomatis (script tags & event handlers dihapus).

---

## 🌌 3D Elements

### 3D Background

Efek background geometris dengan CSS. Letakkan dalam section sebagai overlay.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `color` | Color | `#22c55e` |
| `intensity` | Range 0.1-1 | 0.5 |
| `animated` | Checkbox | true |

### 3D Scene

Scene 3D interaktif dengan Three.js.

**Mode Konten:**
- **Procedural Shapes:** Bentuk geometris acak (warna, jumlah, kecepatan bisa diatur)
- **Custom 3D Model:** Upload file .glb sendiri

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `modelMode` | Select | `shapes` / `custom` |
| `color` | Color | `#22c55e` |
| `shapes` | Range 2-12 | 6 |
| `rotateSpeed` | Range 0.1-2 | 0.5 |
| `modelSrc` | File/URL | "" |
| `modelWireframe` | Checkbox | false |

**Overlay Teks:** title, subtitle, buttonText, buttonHref, textPosition.

### 3D Particles

Partikel animasi 3D sebagai background.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `color` | Color | `#22c55e` |
| `particleCount` | Range 50-1000 | 300 |
| `speed` | Range 0.1-2 | 0.5 |

### 3D Model

Viewer model 3D (.glb) dengan auto-rotate.

**Konten:**
| Field | Tipe | Default |
|-------|------|---------|
| `src` | File upload / URL | Avatar demo |
| `autoRotate` | Checkbox | true |
| `rotateSpeed` | Range 0.5-10 | 2 |
| `scale` | Range 0.2-5 | 1.5 |
| `wireframe` | Checkbox | false |

---

## 💡 Tips & Trik

### SEO untuk Halaman Published

1. **Judul Halaman:** Gunakan judul yang deskriptif (termasuk di SEO settings)
2. **Meta Description:** Tulis deskripsi 150-160 karakter
3. **OG Image:** Upload gambar untuk preview saat di-share
4. **Alt Text Gambar:** Selalu isi alt text untuk semua gambar
5. **Hierarki Heading:** Gunakan h1 → h2 → h3 secara berurutan

### Performa

1. **Lazy Loading:** Semua gambar otomatis `loading="lazy"`
2. **Image Compression:** Upload otomatis dikompresi ke WebP
3. **Responsive:** Gunakan fitur "Sembunyi" untuk menyembunyikan elemen di perangkat tertentu

### Best Practice

1. **Navbar + Footer:** Hanya perlu 1 navbar dan 1 footer per halaman
2. **3D Elements:** Gunakan 3D Background sparingly — bisa mempengaruhi performa
3. **Custom HTML:** Hanya gunakan jika elemen yang ada tidak mencukupi
4. **Caching:** Perubahan di halaman published bisa butuh cache refresh
5. **Backup:** Selalu simpan perubahan sebelum publish

---

*Dokumentasi ini diperbarui secara otomatis. Untuk informasi terbaru, hubungi tim developer.*
