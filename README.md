# Sinari App - Web Client

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)

This is the Single Page Application (SPA) client for **Sinari** (Fullstack Store Management & Service Tracking). Built with the latest React 19 ecosystem, it utilizes Vite for fast development and delivers a highly responsive, animated, and accessible user interface.

## Tech Stack

- **Runtime & Manager:** [Bun](https://bun.sh)
- **Framework:** React 19
- **Build Tool:** Vite
- **Language:** TypeScript
- **Routing:** React Router v7
- **State & Data Fetching:** TanStack Query v5 + Axios
- **Styling & UI:** Tailwind CSS v4, Radix UI Primitives, Framer Motion
- **Forms & Validation:** React Hook Form + Zod
- **Features:** React PDF (Invoice Generation), Recharts (Dashboard Charts), i18next (Localization)

## Key Features

- **Interactive Dashboard (RBAC):** Role-Based Access Control interface for Owners, Admins, and Technicians to manage inventory and services efficiently.
- **Service Tracking:** Public-facing feature allowing customers to track their repair status in real-time.
- **Dynamic PDF Generation:** Automated invoice and receipt creation directly from the browser using `@react-pdf/renderer`.
- **Google OAuth Login:** Seamless and secure authentication utilizing `@react-oauth/google` and `jwt-decode`.
- **Internationalization (i18n):** Multi-language support seamlessly integrated with `react-i18next`.
- **Modern UI/UX:** Fully responsive design with dark/light mode (`next-themes`), beautiful toast notifications (`sonner`), and smooth page transitions (`framer-motion`).
- **Data Visualization:** Interactive analytics and statistics powered by `recharts`.

## Prerequisites

Before running this project, ensure you have the following installed:

- [Bun](https://bun.sh/) (latest version recommended)
- The [Sinari Server](https://github.com/Rhzslya/sinari-app-server) running locally or accessible via a deployed URL.

## Installation

1. **Clone the Repository**

   ```bash
   git clone [https://github.com/Rhzslya/sinari-app-client.git](https://github.com/Rhzslya/sinari-app-client.git)
   cd sinari-app-client
   ```

2. **Install Dependencies**

   ```bash
   bun install
   ```

3. **Setup Environment Variables**

   ```bash
   cp .env.example .env
   ```

4. **Start the Server**
   ```bash
   bun run dev
   ```

## Build for Production

```bash
bun run build
```
