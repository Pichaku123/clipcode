# <clipcode/> — Algorithm & Snippet Tracker

`clipcode` is a professional, self-contained development notebook and dashboard designed to help programmers track LeetCode/Codeforces practice problems, index algorithmic design patterns, and catalog reusable code snippets. 

Built with a unified, custom dark-theme UI, it provides analytics on problem difficulty, platform origins, revisit review tracking, and code language distributions.

---

## 🛠️ Stack & Architecture

### 📂 Directory Structure
```
clipcode/
├── frontend/           # React client application (Vite-powered)
│   ├── src/
│   │   ├── components/ # Reusable UI (Sidebar, FilterBar, EmptyState, cards)
│   │   ├── pages/      # List & Detail views (Dashboard, Snippets, Problems, Patterns)
│   │   └── hooks/      # Local client data fetching wrappers
│   └── package.json
└── server/             # Express.js REST API
    ├── src/
    │   ├── controllers/# Business logic execution API controllers
    │   ├── routes/     # Express route handlers
    │   └── generated/  # Local Prisma Client output folder
    ├── prisma/         # Prisma schema and seed scripts
    └── package.json
```

### 💻 Technologies
* **Frontend**: React, Vite, React Router, Axios, Custom Vanilla CSS dark-mode theme, React Syntax Highlighter.
* **Backend**: Node.js, Express.js.
* **Database**: PostgreSQL (hosted on Neon.tech), managed by Prisma ORM.

---

## ⚙️ Local Installation & Setup

 Follow these instructions to initialize backend and frontend environments:

### 1. Database Configuration
1. Navigate to the `server/` directory.
2. Ensure you have a `.env` file containing your Neon or PostgreSQL database URI:
   ```env
   DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@YOUR_HOST-pooler.aws.neon.tech/neondb?sslmode=require&connect_timeout=30&pool_timeout=30"
   DIRECT_URL="postgresql://neondb_owner:YOUR_PASSWORD@YOUR_HOST.aws.neon.tech/neondb?sslmode=require"
   PORT=5000
   ```
   > [!NOTE]
   > The `&connect_timeout=30` and `&pool_timeout=30` parameters are recommended for Neon serverless databases to tolerate cold-start compute node wake-up delays and prevent `P1001` timeout failures.

### 2. Backend Installation & Migrations
From inside the `server/` directory:
```bash
# Install dependencies
npm install

# Connect and push the Prisma Schema database models
npx prisma db push

# Seed the database with the default dev user and initial patterns/snippets
node prisma/seed.js

# Start the Express server
npm start
```
The API server will launch at `http://localhost:5000`.

### 3. Frontend Installation & Startup
From inside the `frontend/` directory:
1. Ensure your API base URL is configured correctly. By default, the frontend is pre-configured to query `http://localhost:5000/api` inside `src/api/client.js`.
2. Follow these commands:
   ```bash
   # Install client-side dependencies
   npm install

   # Start the local Vite development server
   npm run dev
   ```
The application will be accessible at `http://localhost:5173` (registering route `/` directly to your new developer dashboard).

---

## 📸 Screenshots & Visuals
*(Place your dashboard, problems list, and syntax highlighting screenshots here!)*

* **Developer Dashboard**
  ![Dashboard Screenshot](./screenshots/dashboard.png)
* **Algorithmic Patterns List & Problems**
  ![Patterns List](./screenshots/patterns.png)

---

## 🧩 Key Features & Workflows
* **Dashboard Analytics**: Check success rates, difficulty dot tables, and track patterns displaying missing code coverage guides.
* **Inline Creation & Deletion**: Add algorithms patterns and link them inline when creating snippets and practice problems.
* **Responsive Reflows**: Mobile and tablet screen viewports reflow navigation layout automatically into a clean top-header panel.

---

## 🚀 Roadmap & Future TODOs
- [ ] **TODO**: Audit `useApi` client call sites before demo day to verify error handling bounds.
- [ ] Implement JWT / Bcrypt Authentication for multi-user catalogs.
- [ ] Add editable tagging modules.
