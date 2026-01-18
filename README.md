# Sinari App - Web Client

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_Rolldown-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-Black?style=for-the-badge&logo=bun&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)

This is the Single Page Application (SPA) client for **Sinari Cell**, built with the latest React 19 ecosystem. It utilizes Vite (powered by Rolldown) for lightning-fast development and build performance.

## Tech Stack

- **Runtime & Manager:** [Bun](https://bun.sh)
- **Framework:** [React 19](https://react.dev)
- **Build Tool:** [Vite](https://vitejs.dev) (using Rolldown-Vite for extreme performance)
- **Language:** TypeScript
- **State/Data Fetching:** [TanStack Query v5](https://tanstack.com/query/latest)
- **HTTP Client:** Axios
- **Linting:** ESLint (Flat Config)

## Prerequisites

- [Bun](https://bun.sh/) installed
- The [Sinari Server](https://github.com/YOUR_USERNAME/sinari-app-server) running locally or accessible via URL.

## Installation

1. **Clone the Repository**

   ```bash
   git clone [https://github.com/YOUR_USERNAME/sinari-app-client.git](https://github.com/YOUR_USERNAME/sinari-app-client.git)
   cd sinari-app-client
   ```

2. **Install Dependencies**

   ```bash
   bun install
   ```

3. **Setup Environment Variables**
   `cp .env.example .env`

4. **Start the Server**

   ```bash
   bun run dev
   ```
