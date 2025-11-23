# Steam Calc 🎮

**Steam Calc** is a web application designed to calculate and visualize Steam profile statistics. It provides insights into account value, playtime data, and game library details using the Steam Web API.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📸 Screenshots

<table border="0">
  <tr>
    <td width="50%" align="center">
      <b>Login</b><br><br>
      <img src="./public/login.png" alt="Login" width="100%">
    </td>
    <td width="50%" align="center">
      <b>Dashboard</b><br><br>
      <img src="./public/dashboard.png" alt="Dashboard" width="100%">
    </td>
  </tr>
</table>

## ✨ Features

* **Account Valuation:** Calculate the total value of a Steam library (lowest prices vs. current prices).
* **Playtime Analytics:** View total hours played and average playtime per game.
* **Profile Insights:** Display user avatar, bans status, and creation date.
* **Responsive Design:** Optimized for both desktop and mobile usage.

## 🛠️ Tech Stack

This project is built using the following technologies:

* **Backend:**
  <br>
  ![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
  ![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)

* **Frontend:**
  <br>
  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

* **UI Components:**
  <br>
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Shadcn UI](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

* **API:**
  <br>
  ![Steam API](https://img.shields.io/badge/Steam_API-1b2838?style=for-the-badge&logo=steam&logoColor=white)

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

Ensure you have the following installed:
* PHP >= 8.2
* Composer
* Node.js & NPM
* Git

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/nidnightexe/steam-calc.git](https://github.com/nidnightexe/steam-calc.git)
    cd steam-calc
    ```

2.  **Install Backend Dependencies**
    ```bash
    composer install
    ```

3.  **Install Frontend Dependencies**
    ```bash
    npm install
    ```

4.  **Environment Setup**
    Copy the example environment file and generate the application key:
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

5.  **Steam API Configuration**
    Open the `.env` file and add your Steam API Key. You can get one [here](https://steamcommunity.com/dev/apikey).
    ```env
    STEAM_API_KEY=your_steam_api_key_here
    ```

6.  **Run Migrations (Optional/If needed)**
    ```bash
    php artisan migrate
    ```

7.  **Run the Application**
    You need to run both the backend server and the frontend bundler (Vite):

    *Terminal 1:*
    ```bash
    php artisan serve
    ```

    *Terminal 2:*
    ```bash
    npm run dev
    ```

    Access the app at `http://localhost:8000`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📝 License

This project is licensed under the [MIT License](LICENSE).