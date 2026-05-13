# Panduan Lengkap Kirana

## PENGEMBANGAN APLIKASI MANAJEMEN KEUANGAN PRIBADI BERBASIS MOBILE MENGGUNAKAN METODE FUZZY TSUKAMOTO UNTUK REKOMENDASI PRIORITAS PENGELUARAN DAN TABUNGAN

---

## Daftar Isi

1. [Pengenalan Aplikasi](#pengenalan-aplikasi)
2. [Permasalahan & Solusi](#permasalahan--solusi)
3. [Fitur-Fitur Utama](#fitur-fitur-utama)
4. [Arsitektur Sistem](#arsitektur-sistem)
5. [Panduan Penggunaan](#panduan-penggunaan)
6. [Metode Fuzzy Tsukamoto](#metode-fuzzy-tsukamoto)
7. [Instalasi & Setup](#instalasi--setup)

---

## Pengenalan Aplikasi

### Nama Aplikasi

**Kirana**

### Deskripsi

Aplikasi mobile yang dirancang khusus untuk membantu anak muda dalam mengelola keuangan pribadi mereka dengan lebih efektif dan efisien. Aplikasi ini menggabungkan tracking pengeluaran, perencanaan tabungan, dan sistem rekomendasi cerdas berbasis **Fuzzy Tsukamoto**.

### Platform

- Android (via Expo)
- iOS (via Expo)
- Web (via Expo Web)

### Teknologi

- **React Native**: Framework untuk development cross-platform
- **Expo**: Platform development yang mempermudah build & deployment
- **Zustand**: Lightweight state management
- **React Navigation**: Navigation library untuk mobile app

---

## Permasalahan & Solusi

### Permasalahan Utama

Anak muda modern menghadapi beberapa tantangan dalam mengelola keuangan:

1. **Kesulitan Mengatur Pengeluaran**
   - Tidak memiliki track record pengeluaran
   - Sulit mengidentifikasi pengeluaran yang berlebihan
   - Tidak tahu ke mana uang mereka pergi

2. **Kesulitan Perencanaan**
   - Tidak bisa membedakan kebutuhan vs keinginan
   - Sulit mengalokasikan uang untuk berbagai kategori
   - Tidak memiliki guidance untuk prioritas pengeluaran

3. **Kesulitan Menabung**
   - Tidak tahu berapa target tabungan yang realistis
   - Sulit membuat multiple savings goals
   - Tidak ada motivasi visual untuk tracking progress

4. **Lack of Personalization**
   - Advice keuangan umum tidak sesuai dengan kondisi individual
   - Tidak ada sistem yang adaptif terhadap situasi finansial unik mereka

### Solusi yang Ditawarkan

Aplikasi ini mengatasi semua permasalahan di atas dengan:

**Expense Tracking**: Pencatatan pengeluaran real-time dengan kategori  
**Savings Planning**: Buat multiple targets dengan deadline  
**Smart Recommendations**: Fuzzy Tsukamoto memberikan rekomendasi personal  
**Visual Analytics**: Dashboard yang mudah dipahami dengan charts & stats  
**Actionable Insights**: Specific action items untuk improve finansial

---

## Fitur-Fitur Utama

### 1. **Dashboard Keuangan**

Tampilan utama yang menampilkan ringkasan kondisi finansial:

- **Pendapatan Bulanan**: Total penghasilan yang dicatatkan
- **Status Pengeluaran**: Total pengeluaran dan persentase dari pendapatan
- **Status Tabungan**: Total tabungan dan persentase dari pendapatan
- **Sisa Anggaran**: Uang yang masih tersedia
- **Rekomendasi Alokasi**: Sugesti dari Fuzzy Tsukamoto
- **Top Categories**: 4 kategori pengeluaran terbesar

**Use Case:**

- Lihat kondisi finansial daily
- Understand alokasi yang direkomendasikan
- Monitor sisa anggaran untuk bulan berjalan

---

### 2. **Tracking Pengeluaran**

Fitur untuk mencatat dan menganalisis setiap transaksi pengeluaran:

- **Add Expense**: Catat pengeluaran dengan deskripsi, nominal, kategori, dan tanggal
- **View History**: Lihat riwayat lengkap semua pengeluaran
- **Category Analytics**: Statistik per kategori (total, rata-rata, tertinggi, terendah)
- **Distribution**: Melihat distribusi pengeluaran antar kategori
- **Delete**: Hapus transaksi yang salah

**Kategori Pengeluaran:**

- Makanan
- Transport
- Utilitas
- Hiburan
- Cicilan
- Belanja
- Kesehatan
- Lainnya

**Use Case:**

- Catat pengeluaran setiap hari
- Lihat mana kategori yang paling banyak pengeluaran
- Identify spending patterns dan opportunities untuk cut

---

### 3. **Perencanaan Tabungan**

Fitur untuk membuat dan track multiple savings goals:

- **Create Target**: Buat target tabungan dengan nama, nominal, dan deadline
- **Track Progress**: Visual progress bar menunjukkan % completion
- **Add Savings**: Catat pemasukan ke target tertentu
- **Monthly Recommendation**: Sistem suggest berapa target bulanan untuk capai goal tepat waktu
- **View Statistics**: Total target, terkumpul, sisa, dan timeline

**Features:**

- Multiple goals support (bisa punya target liburan, mobil, rumah, dll)
- Automatic monthly requirement calculation
- Progress visualization dengan persentase
- Delete / manage goals

**Use Case:**

- Tentukan 3-5 savings goals untuk jangka waktu berbeda
- Allocate savings setiap bulan ke specific goals
- Monitor progress dan celebrate milestone

---

### 4. **Sistem Rekomendasi (Fuzzy Tsukamoto)**

Core intelligence system yang memberikan rekomendasi alokasi keuangan:

- **Analyze Situation**: Sistem menganalisis pendapatan, pengeluaran, dan target tabungan Anda
- **Generate Recommendations**: Berdasarkan 7 rules dengan logika fuzzy
- **Allocation Breakdown**: Rekomendasikan % untuk Essential, Savings, Discretionary
- **Status Report**: Apakah pengeluaran Anda sudah optimal atau perlu adjustment
- **Action Items**: Specific steps untuk improve finansial

**Output Rekomendasi:**

1. **Kebutuhan Esensial (40-70%)**
   - Makanan, transport, utilitas, cicilan rutin
   - Must-have categories

2. **Tabungan (10-40%)**
   - Target savings sesuai goals Anda
   - Important untuk financial security

3. **Pengeluaran Diskresioner (5-40%)**
   - Hiburan, lifestyle, wants
   - Flexible spending untuk quality of life

**Use Case:**

- Understand alokasi yang paling sesuai dengan kondisi Anda
- Get actionable insights untuk improve finansial
- Make informed decisions tentang spending priorities

---

### 5. **Profil Pengguna**

Untuk setup dan manage informasi keuangan:

- **Setup Income**: Input pendapatan bulanan (wajib)
- **Savings Goal**: Target tabungan umum (optional)
- **Edit Profile**: Update informasi kapan saja
- **Reset Data**: Reset pengeluaran & tabungan untuk bulan baru
- **App Info**: Tentang aplikasi dan fitur

**Use Case:**

- First-time setup saat buka app
- Update income jika ada perubahan
- Reset data setiap bulan untuk tracking fresh

---

## Arsitektur Sistem

### High-Level Architecture

```
┌─────────────────────────────────────────┐
│       User Interface Layer              │
│  (Screens, Components, Navigation)      │
├─────────────────────────────────────────┤
│       Business Logic Layer              │
│  (Fuzzy Tsukamoto, Calculators)         │
├─────────────────────────────────────────┤
│       State Management (Zustand)        │
│  (Store, Actions, Selectors)            │
├─────────────────────────────────────────┤
│       Data Layer                        │
│  (Local State - Future: SQLite/Firebase)│
└─────────────────────────────────────────┘
```

### Component Structure

```
App.js
├── RootNavigator (React Navigation)
│   └── BottomTabNavigator
│       ├── Dashboard Stack
│       │   ├── DashboardScreen
│       │   └── ExpenseDetailScreen
│       ├── AddExpenseScreen
│       ├── Savings Stack
│       │   ├── SavingsScreen
│       │   └── SavingsDetailScreen
│       ├── RecommendationScreen
│       └── ProfileScreen
└── Store (Zustand)
    └── financeStore
```

### Data Flow

```
User Action
    ↓
Component State Update
    ↓
Zustand Store Update
    ↓
Fuzzy Tsukamoto Processing (if needed)
    ↓
UI Re-render
    ↓
Display Updated Data
```

---

## Panduan Penggunaan

### Langkah 1: Setup Awal

1. **Download & Buka App**
   - Download via Expo Go atau build APK/IPA

2. **Go to Profile Tab**
   - Klik tab **Profil** di bottom navigation

3. **Enter Monthly Income**
   - Klik "Edit Profil"
   - Input pendapatan bulanan Anda
   - Opsional: Input target tabungan umum
   - Klik "Simpan"

### Langkah 2: Catat Pengeluaran

1. **Go to Expense Tab**
   - Klik tab **Pengeluaran**

2. **Add First Expense**
   - Klik **"+ Catat Pengeluaran"**
   - Isi Form:
     - **Deskripsi**: Contoh "Makan siang"
     - **Nominal**: 25000
     - **Kategori**: Makanan
   - Klik **"Simpan"**

3. **Repeat Daily**
   - Catat setiap pengeluaran dalam sehari
   - Consistency adalah kunci akurasi

### Langkah 3: Buat Savings Goals

1. **Go to Savings Tab**
   - Klik tab **Tabungan**

2. **Create First Goal**
   - Klik **"+ Target Baru"**
   - Isi Form:
     - **Nama Target**: "Liburan ke Bali"
     - **Target Jumlah**: 10000000
     - **Jangka Waktu**: 12 (months)
   - Klik **"Buat Target"**

3. **Track Progress**
   - Klik **"+ Tambah Tabungan"** untuk setiap savings
   - System auto-update progress bar

### Langkah 4: Review Dashboard

1. **Go to Dashboard Tab**
   - Klik tab **Beranda**

2. **Check Overview**
   - Review total income vs expenses
   - Check sisa anggaran
   - See top spending categories

3. **Analyze Allocation**
   - Lihat recommended allocation dari Fuzzy Tsukamoto
   - Compare dengan actual spending Anda

### Langkah 5: Get Recommendations

1. **Go to Recommendation Tab**
   - Klik tab **Rekomendasi**

2. **Review Analysis**
   - Lihat status: Optimal atau perlu adjustment
   - Check recommended allocation percentages
   - See specific action items

3. **Implement Changes**
   - Follow action items yang disuggest
   - Adjust spending sesuai rekomendasi
   - Track progress di dashboard

---

## Metode Fuzzy Tsukamoto

### Definisi

Fuzzy Tsukamoto adalah metode inference system yang menggabungkan:

- **Fuzzy Logic**: Untuk handle ketidakpastian dan gradual transitions
- **Tsukamoto Method**: Menggunakan weighted average untuk defuzzification

### Cara Kerja Step-by-Step

#### 1. INPUT DEFINITION

**Variabel Input:**

```
Income = Rp X (pendapatan bulanan)
├── Low: Rp 0 - Rp 3 juta
├── Medium: Rp 1 juta - Rp 7 juta
└── High: Rp 3 juta - ∞

Expense Ratio = (Total Pengeluaran / Income) × 100%
├── Low: 0% - 60%
├── Medium: 30% - 80%
└── High: 60% - 100%+

Savings Target Ratio = (Target Tabungan / Income) × 100%
├── Low: 0% - 20%
├── Medium: 5% - 35%
└── High: 20% - ∞
```

#### 2. FUZZIFICATION

Convert input crisp ke membership degree (0-1):

```
Example 1:
Income = Rp 5 juta
- membershipIncome.low = 0 (< Rp 1 juta? NO)
- membershipIncome.medium = 0.67 (somewhere in range)
- membershipIncome.high = 0.33 (partially HIGH)

Example 2:
ExpenseRatio = 45%
- membershipExpenseRatio.low = 0.75 (mostly LOW)
- membershipExpenseRatio.medium = 0.5 (partially MEDIUM)
- membershipExpenseRatio.high = 0 (< 60%? NO)
```

#### 3. RULE EVALUATION

**7 Rules with IF-THEN Logic:**

| No  | Condition                              | Conclusion                             |
| --- | -------------------------------------- | -------------------------------------- |
| 1   | Income=Low AND ExpenseRatio=High       | Essential=HIGH, Savings=LOW, Disc=LOW  |
| 2   | Income=Medium AND ExpenseRatio=Medium  | Essential=MED, Savings=MED, Disc=MED   |
| 3   | Income=HIGH AND SavingsTarget=HIGH     | Essential=MED, Savings=HIGH, Disc=MED  |
| 4   | ExpenseRatio=LOW AND SavingsTarget=MED | Essential=LOW, Savings=HIGH, Disc=HIGH |
| 5   | Income=MED AND ExpenseRatio=HIGH       | Essential=HIGH, Savings=MED, Disc=LOW  |
| 6   | Income=LOW AND SavingsTarget=MED       | Essential=MED, Savings=MED, Disc=LOW   |
| 7   | ExpenseRatio=LOW AND Income=HIGH       | Essential=MED, Savings=MED, Disc=HIGH  |

**Degree of Firing** = min(antecedent membership degrees)

```
Example:
IF Income=Medium (0.67) AND ExpenseRatio=Medium (0.5)
THEN Degree of Firing = min(0.67, 0.5) = 0.5
```

#### 4. DEFUZZIFICATION (Tsukamoto Method)

Hitung output crisp menggunakan weighted average:

```
Output = Σ(w_i × z_i) / Σ(w_i)

Where:
- w_i = degree of firing untuk rule i
- z_i = center of membership function output
```

**Output Membership Functions:**

```
Essential Allocation:
├── Low: 20-40%
├── Medium: 40-60% (peak at 50%)
└── High: 60-80%

Savings Allocation:
├── Low: 5-20%
├── Medium: 15-35% (peak at 25%)
└── High: 30-50%

Discretionary:
├── Low: 0-15%
├── Medium: 10-30% (peak at 20%)
└── High: 25-45%
```

#### 5. OUTPUT NORMALIZATION

Ensure total = 100%:

```
Final_Essential = Essential / (Essential + Savings + Disc) × 100%
Final_Savings = Savings / (Essential + Savings + Disc) × 100%
Final_Disc = Disc / (Essential + Savings + Disc) × 100%
```

### Example Calculation

**Scenario:**

- Monthly Income: Rp 5 juta
- Current Expenses: Rp 2 juta (40%)
- Savings Target: Rp 1 juta

**Step 1: Fuzzification**

```
Income = Rp 5M
- low: 0
- medium: 0.67 ← Rule 2, Rule 5, Rule 6
- high: 0.33 ← Rule 3, Rule 7

ExpenseRatio = 40%
- low: 0.67 ← Rule 4, Rule 7
- medium: 0.67 ← Rule 2, Rule 5
- high: 0

SavingsTarget = 20%
- low: 0
- medium: 0.67 ← Rule 1, Rule 2, Rule 6
- high: 0
```

**Step 2: Rule Firing**

```
Rule 2: min(0.67, 0.67) = 0.67 → Essential=MED(50%), Savings=MED(25%), Disc=MED(20%)
Rule 5: min(0.67, 0.67) = 0.67 → Essential=HIGH(65%), Savings=MED(25%), Disc=LOW(10%)
(Other rules have lower firing or don't apply)
```

**Step 3: Tsukamoto Defuzzification**

```
Essential = (0.67×50 + 0.67×65) / (0.67+0.67) = 57.5%
Savings = (0.67×25 + 0.67×25) / (0.67+0.67) = 25%
Discretionary = (0.67×20 + 0.67×10) / (0.67+0.67) = 15%
```

**Final Result:**

```
✓ Essential: 57.5% = Rp 2.875 juta
✓ Savings: 25% = Rp 1.25 juta
✓ Discretionary: 17.5% = Rp 0.875 juta
✓ Total: 100% = Rp 5 juta ✓
```

---

## Instalasi & Setup

### Requirements

- **Node.js** >= 16
- **npm** >= 8
- **Expo CLI** (akan auto-install)
- **Mobile device** atau emulator

### Installation Steps

```bash
# 1. Navigate to project
cd "d:\App Project\mobile-app\Kirana"

# 2. Install dependencies (if not yet)
npm install

# 3. Start Expo development server
npm start

# 4. Run on platform:
# Press 'a' for Android Emulator
# Press 'i' for iOS Simulator (Mac only)
# Press 'w' for Web Browser
# Scan QR code dengan Expo Go app
```

### Project Structure

```
Kirana/
├── src/
│   ├── components/
│   │   ├── index.js                 # Core UI components
│   │   └── FormComponents.js         # Form inputs
│   ├── screens/
│   │   ├── DashboardScreen.js
│   │   ├── AddExpenseScreen.js
│   │   ├── SavingsScreen.js
│   │   ├── RecommendationScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── ExpenseDetailScreen.js
│   │   └── SavingsDetailScreen.js
│   ├── navigation/
│   │   └── RootNavigator.js
│   ├── store/
│   │   └── financeStore.js           # Zustand state management
│   ├── fuzzy/
│   │   └── tsukamoto.js              # Fuzzy Tsukamoto logic
│   ├── utils/
│   │   └── formatters.js             # Utility functions
│   ├── constants/
│   │   └── index.js                  # Colors, categories, etc
│   └── hooks/
│       └── (custom hooks if any)
├── App.js                             # Entry point
├── app.json                           # Expo config
├── package.json
└── README.md
```

### Running the App

**Development Mode:**

```bash
npm start
```

**Building APK (Android):**

```bash
eas build --platform android
```

**Building IPA (iOS):**

```bash
eas build --platform ios
```

---

## Kesimpulan

Aplikasi **Manajemen Keuangan Pribadi** dengan Fuzzy Tsukamoto menawarkan:

- User-friendly interface untuk tracking keuangan
- Intelligent recommendation system
- Multiple savings goals management
- Visual analytics dan insights
- Actionable guidance untuk improvement finansial

Dengan menggunakan aplikasi ini secara konsisten, anak muda dapat:

- Memahami pola pengeluaran mereka
- Membuat keputusan finansial yang lebih baik
- Mencapai goals tabungan dengan terstruktur
- Mengoptimalkan alokasi keuangan mereka

---

**Version**: 1.0.0  
**Last Updated**: Mei 2026  
**Developed with** **L**❤️**VE** **for better financial management**
