# Tumbuh Bersama

Aplikasi belajar IPA interaktif tentang pertumbuhan dan perkembangan manusia. Dibuat dengan React, Vite, Tailwind CSS, dan Dexie.js; tidak memerlukan backend atau database server.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

## Deploy ke Vercel

Impor folder proyek ini sebagai project Vercel. Pengaturan build otomatis menggunakan:

- Build command: `npm run build`
- Output directory: `dist`

`vercel.json` mengarahkan rute aplikasi kembali ke halaman utama agar navigasi client-side tetap berfungsi.

## Penyimpanan

Hasil kuis dan LKPD tersimpan di IndexedDB pada browser/perangkat yang digunakan. Nama siswa dan kelas disimpan di local storage. Data tidak dikirim ke server, sehingga tidak otomatis tersinkron antarperangkat atau browser. Menghapus data situs/browser juga akan menghapus progres tersebut.

## Materi dan aktivitas

- Tiga topik materi dengan rangkuman dan fakta kontekstual.
- Papan interaktif: klasifikasi pertumbuhan/perkembangan dan urutan tahap kehidupan.
- Kuis lima soal dengan umpan balik jawaban dan penyimpanan skor.
- LKPD refleksi tiga pertanyaan dengan riwayat lokal.
