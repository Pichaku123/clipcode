# <clipcode/> &mdash; Algorithmic Workspace & Analytics

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-398200?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](./LICENSE)

`clipcode` is a professional, self-contained development notebook and analytics tracker designed to help software engineers structure their Data Structures and Algorithms (DSA) preparation. 

It enables users to index foundational coding patterns (such as Sliding Window or Two Pointers), associate them with coding exercises on platforms like LeetCode and Codeforces, and catalog language-specific reference implementations.

---

## 🚀 Why clipcode?

- **Centralized Reference Notebook**: Keep your study logs, problem trackers, and reference code snippets linked together in a single workspace.
- **Dynamic Metrics**: The developer dashboard compiles real-time success ratios, difficulty columns, platform origins, and coverage warnings (notifying you of defined patterns that lack code examples).
- **Responsive Layout Design**: Fully adaptive layout. Reflows from a vertical desktop sidebar into a mobile header navbar automatically.
- **Syntax Highlighting**: Supports C++, Python, Java, and JavaScript preview styling out-of-the-box.

---

## 🛠️ Stack & Architecture

### 📂 Repository Structure
```
clipcode/
├── frontend/           # React Single Page App (Vite-powered)
│   ├── src/
│   │   ├── components/ # Reusable UI (Sidebar, FilterBar, EmptyState, cards)
│   │   ├── pages/      # List & Detail views (Dashboard, Snippets, Problems, Patterns)
│   │   └── hooks/      # useApi data fetching hook
│   └── package.json
└── server/             # Express.js REST API
    ├── src/
    │   ├── controllers/# Business logic routes controllers
    │   └── generated/  # Generated Prisma Client output
    ├── prisma/         # Prisma Models & Seed scripts
    └── package.json
```

---

## ⚙️ Getting Started

Follow these steps to configure your local developer workspace:

### 1. Database Setup
1. Navigate to the `server/` directory and ensure a `.env` file exists:
   ```env
   DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@YOUR_HOST-pooler.aws.neon.tech/neondb?sslmode=require&connect_timeout=30&pool_timeout=30"
   DIRECT_URL="postgresql://neondb_owner:YOUR_PASSWORD@YOUR_HOST.aws.neon.tech/neondb?sslmode=require"
   PORT=5000
   ```
   > [!NOTE]
   > The `&connect_timeout=30` and `&pool_timeout=30` parameters prevent cold-start `P1001` connection errors when query queries wake serverless database instances like Neon.

### 2. Backend Initialization
From inside the `server/` directory:
```bash
# Install NPM dependencies
npm install

# Connect and sync database models
npx prisma db push

# Seed the database with helper schemas and dev user accounts
node prisma/seed.js

# Launch the API server
npm start
```
The server runs on [http://localhost:5000](http://localhost:5000).

### 3. Frontend Initialization
From inside the `frontend/` directory:
1. Confirm API routing: base endpoints are configured to query `http://localhost:5000/api` inside `src/api/client.js` (you can override VITE_API_URL in local environment files).
2. Execute the following:
   ```bash
   # Install UI dependencies
   npm install

   # Start local dev server
   npm run dev
   ```
The app runs locally on [http://localhost:5173](http://localhost:5173) (launching the Dashboard directly at `/`).

---

## 📸 Screenshots
*(Embed screenshots here!)*

* **Workspace Dashboard**
  ![Dashboard Screenshot](./screenshots/dashboard.png)
* **Code Snippets Library**
  ![Snippets Library](./screenshots/snippets.png)

---

## 🤝 Community & Support

* **Get Help**: If you run into issues or have questions, please open a thread in the [GitHub Issues](https://github.com/Priyanshu/clipcode/issues) log.
* **Troubleshooting**: For common cold-start or database issues, audit your credentials or verify network bounds.

---

## ✍️ Contribution & License

- **Authors & Maintainers**: Maintained by Priyanshu and open-source contributors.
- **Contributions**: Contributions are welcome! Please review standard workflow guidelines in [CONTRIBUTING.md](./CONTRIBUTING.md) before opening pull requests.
- **License**: Distributed under the MIT License. See [LICENSE](./LICENSE) for terms.
