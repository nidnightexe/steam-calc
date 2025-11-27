<div align="center">
  <a href="https://github.com/nidnightexe/steam-calc">
    <img src="./public/favicon.svg" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">Steam Calc</h1>

  <p align="center">
    <strong>Analisis Statistik & Valuasi Akun Steam</strong>
    <br />
    Aplikasi web modern untuk menghitung dan memvisualisasikan statistik profil Steam menggunakan Laravel dan React.
    <br />
    <br />
    <a href="#-fitur">Fitur</a> ·
    <a href="#-teknologi">Teknologi</a> ·
    <a href="#-instalasi">Instalasi</a> ·
    <a href="https://github.com/nidnightexe/steam-calc/issues">Lapor Bug</a>
    <a href="https://steamcommunity.com/dev/apikey">Steam Api</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Pest-PHP-purple?style=for-the-badge&logo=php&logoColor=white" alt="Pest" />
    <img src="https://img.shields.io/badge/Steam-1b2838?style=for-the-badge&logo=steam&logoColor=white" alt="Steam API" />
  </p>
</div>

---

## 📸 Tampilan Aplikasi

Berikut adalah antarmuka dari **Steam Calc** yang dirancang dengan fokus pada pengalaman pengguna (UX) yang bersih.

| Halaman Pencarian | Dashboard Utama |
|:---:|:---:|
| <img src="./public/login.png" alt="Halaman Pencarian" width="100%"> | <img src="./public/dashboard.png" alt="Dashboard" width="100%"> |
| *Autentikasi Aman* | *Statistik Real-time* |

---

## 📖 Tentang Proyek

**Steam Calc** adalah alat yang memungkinkan pengguna untuk melihat statistik mendalam mengenai akun Steam mereka. Proyek ini dibangun untuk mendemonstrasikan integrasi yang mulus antara backend PHP yang kuat dan frontend reaktif.

Fitur utama meliputi:
* 🔐 **Autentikasi Aman:** Menggunakan sistem autentikasi bawaan Laravel.
* 📊 **Kalkulasi Aset:** Menghitung estimasi nilai akun berdasarkan game yang dimiliki.
* ⚡ **Performa Tinggi:** Dibangun di atas arsitektur modern Laravel + React.

---

## 🛠 Teknologi

Proyek ini dibangun menggunakan stack modern (TALL/VILT stack variant):

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | [Laravel](https://laravel.com) | Backend PHP yang ekspresif dan elegan. |
| **Frontend** | [React](https://reactjs.org) | Library JavaScript untuk membangun antarmuka pengguna. |
| **Starter Kit** | Laravel Starter | Setup modern dengan integrasi React. |
| **Testing** | [Pest](https://pestphp.com) | Framework testing PHP yang elegan. |

---

## 🚀 Instalasi

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di mesin lokal kamu (Localhost).

### Prasyarat
Pastikan kamu telah menginstal:
* PHP >= 8.2
* Composer
* Node.js & NPM

### Langkah-langkah

1.  **Clone Repositori**
    ```bash
    git clone [https://github.com/nidnightexe/steam-calc.git](https://github.com/nidnightexe/steam-calc.git)
    cd steam-calc
    ```

2.  **Install Dependencies**
    Install paket backend dan frontend:
    ```bash
    composer install
    npm install
    ```

3.  **Setup Environment**
    Salin file `.env.example` menjadi `.env` dan konfigurasi database kamu:
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

4.  **Setup Database**
    Jalankan migrasi untuk membuat tabel database:
    ```bash
    php artisan migrate
    ```

5.  **Jalankan Aplikasi**
    Kamu perlu menjalankan dua terminal terpisah:

    *Terminal 1 (Laravel Server):*
    ```bash
    php artisan serve
    ```

    *Terminal 2 (Vite Development):*
    ```bash
    npm run dev
    ```

Buka browser dan akses `http://localhost:8000`.

---

## 🧪 Pengujian (Testing)

Proyek ini menggunakan **Pest** sebagai framework pengujian. Untuk menjalankan test suite:

```bash
php artisan test
```

## 🤝 Kontribusi
Kontribusi selalu terbuka! Jika kamu memiliki ide untuk membuat Steam Calc lebih baik:

1. Fork repositori ini.

2. Buat branch fitur baru (git checkout -b fitur-keren).

3. Commit perubahan kamu (git commit -m 'Menambahkan fitur keren').

4. Push ke branch tersebut (git push origin fitur-keren).

5. Buat Pull Request.

Tentu, ini adalah draf README.md yang rapi, profesional, dan menarik untuk repositori steam-calc kamu.

Saya telah menyusunnya agar menonjolkan teknologi yang kamu gunakan (Laravel + React + Pest) serta menampilkan aset gambar yang kamu berikan dengan tata letak yang estetis.

Silakan salin kode di bawah ini ke dalam file README.md kamu.

Markdown

<div align="center">
  <a href="https://github.com/nidnightexe/steam-calc">
    <img src="./public/favicon.svg" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">Steam Calc</h1>

  <p align="center">
    <strong>Analisis Statistik & Valuasi Akun Steam</strong>
    <br />
    Aplikasi web modern untuk menghitung dan memvisualisasikan statistik profil Steam menggunakan Laravel dan React.
    <br />
    <br />
    <a href="#-fitur">Fitur</a> ·
    <a href="#-teknologi">Teknologi</a> ·
    <a href="#-instalasi">Instalasi</a> ·
    <a href="https://github.com/nidnightexe/steam-calc/issues">Lapor Bug</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Pest-PHP-purple?style=for-the-badge&logo=php&logoColor=white" alt="Pest" />
  </p>
</div>

---

## 📸 Tampilan Aplikasi

Berikut adalah antarmuka dari **Steam Calc** yang dirancang dengan fokus pada pengalaman pengguna (UX) yang bersih.

| Halaman Login | Dashboard Utama |
|:---:|:---:|
| <img src="./public/login.png" alt="Halaman Login" width="100%"> | <img src="./public/dashboard.png" alt="Dashboard" width="100%"> |
| *Autentikasi Aman* | *Statistik Real-time* |

---

## 📖 Tentang Proyek

**Steam Calc** adalah alat yang memungkinkan pengguna untuk melihat statistik mendalam mengenai akun Steam mereka. Proyek ini dibangun untuk mendemonstrasikan integrasi yang mulus antara backend PHP yang kuat dan frontend reaktif.

Fitur utama meliputi:
* 🔐 **Autentikasi Aman:** Menggunakan sistem autentikasi bawaan Laravel.
* 📊 **Kalkulasi Aset:** Menghitung estimasi nilai akun berdasarkan game yang dimiliki.
* ⚡ **Performa Tinggi:** Dibangun di atas arsitektur modern Laravel + React.

---

## 🛠 Teknologi

Proyek ini dibangun menggunakan stack modern (TALL/VILT stack variant):

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | [Laravel](https://laravel.com) | Backend PHP yang ekspresif dan elegan. |
| **Frontend** | [React](https://reactjs.org) | Library JavaScript untuk membangun antarmuka pengguna. |
| **Starter Kit** | Laravel Starter | Setup modern dengan integrasi React. |
| **Testing** | [Pest](https://pestphp.com) | Framework testing PHP yang elegan. |

---

## 🚀 Instalasi

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di mesin lokal kamu (Localhost).

### Prasyarat
Pastikan kamu telah menginstal:
* PHP >= 8.2
* Composer
* Node.js & NPM

### Langkah-langkah

1.  **Clone Repositori**
    ```bash
    git clone [https://github.com/nidnightexe/steam-calc.git](https://github.com/nidnightexe/steam-calc.git)
    cd steam-calc
    ```

2.  **Install Dependencies**
    Install paket backend dan frontend:
    ```bash
    composer install
    npm install
    ```

3.  **Setup Environment**
    Salin file `.env.example` menjadi `.env` dan konfigurasi database kamu:
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

4.  **Setup Database**
    Jalankan migrasi untuk membuat tabel database:
    ```bash
    php artisan migrate
    ```

5.  **Jalankan Aplikasi**
    Kamu perlu menjalankan dua terminal terpisah:

    *Terminal 1 (Laravel Server):*
    ```bash
    php artisan serve
    ```

    *Terminal 2 (Vite Development):*
    ```bash
    npm run dev
    ```

Buka browser dan akses `http://localhost:8000`.

---

## 🧪 Pengujian (Testing)

Proyek ini menggunakan **Pest** sebagai framework pengujian. Untuk menjalankan test suite:

```bash 
php artisan test
```

Atau menggunakan binary pest langsung:

```bash 
./vendor/bin/pest
```

## 🤝 Kontribusi
Kontribusi selalu terbuka! Jika kamu memiliki ide untuk membuat Steam Calc lebih baik:
1. Fork repositori ini.
2. Buat branch fitur baru (git checkout -b fitur-keren).
3. Commit perubahan kamu (git commit -m 'Menambahkan fitur keren').
4. Push ke branch tersebut (git push origin fitur-keren).
5. Buat Pull Request.

<div align="center"> Dibuat dengan ❤️ oleh <a href="https://www.google.com/search?q=https://github.com/nidnightexe">nidnightexe</a> </div>