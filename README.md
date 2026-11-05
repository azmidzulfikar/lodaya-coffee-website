# Lodaya Digital Hub — MVP v1.0

Website resmi/link-in-bio Lodaya Coffee Nusantara dengan halaman publik dan dashboard admin.

## Fitur
- Landing page responsif dengan gaya premium/editorial.
- Katalog produk (contoh awal: Gayo Arabica, Java Preanger, Liberica Meranti, Gayo Ground Coffee).
- Tombol WhatsApp, Google Maps, Instagram, TikTok, dan marketplace.
- Dashboard admin untuk login, CRUD produk, ubah tautan dan profil brand.
- Pencatatan klik tautan sederhana.
- Supabase untuk autentikasi dan penyimpanan data.

## Menjalankan secara lokal
1. Install Node.js 20 atau lebih baru.
2. Ekstrak folder project, lalu jalankan `npm install`.
3. Salin `.env.example` menjadi `.env.local`.
4. Buat project di https://supabase.com.
5. Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dari Project Settings > API.
6. Buka Supabase SQL Editor, jalankan seluruh isi `supabase/schema.sql`.
7. Di Supabase Authentication > Users, buat user admin dengan email dan password yang kuat.
8. Isi kontak dan tautan awal melalui dashboard setelah login. Ganti nomor WhatsApp contoh.
9. Jalankan `npm run dev`, lalu buka http://localhost:3000. Dashboard: http://localhost:3000/admin.

## Deploy gratis ke Vercel
1. Upload project ini ke repository GitHub.
2. Import repository di https://vercel.com.
3. Tambahkan environment variables yang sama seperti `.env.local` di Vercel Project Settings.
4. Deploy. Vercel akan memberikan subdomain `nama-project.vercel.app`.
5. Gunakan URL deploy tersebut pada Instagram > Edit Profile > Links.

## Penting sebelum dipublikasikan
- Ganti nomor WhatsApp contoh `6281234567890`.
- Masukkan URL Google Maps lokasi bisnis yang benar.
- Masukkan URL Instagram, TikTok, dan marketplace resmi.
- Periksa kembali foto, nama, deskripsi, asal, dan detail setiap produk.
- Jangan pernah menaruh Supabase service-role key di frontend. Gunakan anon key saja.
- Kebijakan SQL ini menganggap setiap akun authenticated sebagai admin. Untuk tim yang lebih besar, batasi akses admin dengan tabel role/allowlist sebelum mengundang pengguna lain.
- Statistik klik saat ini berupa event sederhana, bukan analytics unik pengunjung.

## Catatan
Ini adalah starter MVP yang dapat dijalankan dan dikembangkan. Supabase, akun admin, data bisnis asli, dan deployment harus dikonfigurasi oleh pemilik sebelum website menjadi live. Gambar contoh menggunakan URL Unsplash.
