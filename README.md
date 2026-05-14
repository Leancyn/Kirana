# Kirana

Aplikasi mobile manajemen keuangan pribadi berbasis Expo untuk melacak pengeluaran, merencanakan tabungan, dan memberikan rekomendasi alokasi keuangan menggunakan **metode Fuzzy Tsukamoto**.

## Fitur Utama

1. **Dashboard Keuangan**
   - Ringkasan pendapatan bulanan, total pengeluaran, dan saldo akumulatif
   - Ringkasan pengeluaran & tabungan bulan berjalan
   - Menampilkan kategori pengeluaran terbesar
   - Menampilkan rekomendasi alokasi dari sistem fuzzy

2. **Tracking Pengeluaran**
   - Menambah pengeluaran (deskripsi, nominal, kategori, tanggal)
   - Melihat detail/riwayat pengeluaran
   - Menghapus pengeluaran yang tidak valid

3. **Perencanaan Tabungan**
   - Membuat dan mengelola beberapa **savings target** (nama, nominal target, jangka waktu)
   - Menambah pemasukan ke target tertentu
   - Melihat progres tiap target

4. **Rekomendasi Alokasi (Fuzzy Tsukamoto)**
   - Menganalisis kondisi finansial berdasarkan pendapatan, rasio pengeluaran, dan kebutuhan/target tabungan
   - Menghasilkan pembagian alokasi ke:
     - **Kebutuhan/Essential**
     - **Tabungan/Savings**
     - **Pengeluaran Diskresioner/Discretionary**
   - Menyediakan penjelasan logika dan saran tindakan (action items)

5. **Profil Pengguna**
   - Mengatur pendapatan bulanan dan informasi profil terkait
   - Memudahkan konfigurasi awal sebelum menggunakan fitur rekomendasi

## Teknologi yang Digunakan

- **Expo** (React Native)
- **React Navigation** (navigasi tab & stack)
- **Zustand** (state management)
- **React Native Chart Kit** (visualisasi)
- **expo-sqlite** (penyimpanan lokal)

## Struktur Kode (Ringkas)

- `src/navigation/RootNavigator.js` : definisi navigasi antar fitur
- `src/screens/` : halaman utama
  - `DashboardScreen.js`
  - `AddExpenseScreen.js`
  - `SavingsScreen.js`
  - `RecommendationScreen.js`
  - `ProfileScreen.js`
- `src/fuzzy/tsukamoto.js` : engine perhitungan rekomendasi Fuzzy Tsukamoto
- `src/store/financeStore.js` : store data dan business logic

## Instalasi & Menjalankan

### Prasyarat

- Node.js dan npm

### Langkah

1. Instal dependency

   ```bash
   npm install
   ```

2. Jalankan project

   ```bash
   npm start
   ```

3. Buka aplikasi pada salah satu opsi berikut:
   - Android emulator
   - iOS simulator
   - Expo Go (scan QR code)

### Skrip Berguna

- `npm run reset-project` : menjalankan skrip reset project
- `npm run lint` : linting

## Catatan Implementasi Fuzzy Tsukamoto

Engine rekomendasi pada `src/fuzzy/tsukamoto.js` menggunakan tahapan umum logika fuzzy:

- **Fuzzifikasi** input (pendapatan, rasio pengeluaran, rasio target tabungan)
- **Evaluasi aturan (rules)** menggunakan derajat keanggotaan
- **Defuzzifikasi** untuk menghasilkan nilai crisp alokasi
- **Normalisasi** agar total alokasi kembali ke 100%

## Versi

- `1.0.0`
