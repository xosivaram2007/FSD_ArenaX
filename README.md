# 🏆 ArenaX: Elite Sports Management OS

![Tournament Banner](https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=1200)

> **ArenaX** is a high-performance, production-grade MERN stack ecosystem designed for the next generation of sports organization. From local leagues to global championships, manage everything with surgical precision.

---

## ⚡ Core Capabilities

### 🛡️ Personnel Command Center (`Admin`)
*   **Database Oversight**: Full CRUD control over the entire userbase.
*   **Role Orchestration**: Dynamically promote or demote users across Admin, Manager, and Supervisor tiers.
*   **Account Termination**: Secure user deletion for maintainance and security.

### 🏆 Tournament Lifecycle Management
*   **Event Creation**: Instant deployment of sport-specific brackets (Basketball, Football, Cricket, etc.).
*   **Dynamic Scheduling**: Precision fixture management with date-time locking.
*   **Total Cleanup**: Nuclear delete options to prune old events and all associated metadata.

### 📊 Live Analytics & Standings
*   **Real-time Scoring**: Instant score propagation across all user dashboards.
*   **Automated Leaderboards**: Algorithmic standing calculations based on Wins, Losses, and Draws.

---

## 🛠️ Technical Architecture

### 🌐 Frontend (React.js)
*   **Stack**: Vite + React + Tailwind CSS
*   **Aesthetic**: "Sports SKEW" Design System — Ultra-modern, high-contrast, dark-mode prioritized.
*   **State**: Context API for global `Auth` and persistent session management.
*   **Icons**: Lucide React for consistent, high-fidelity visual cues.

### ⚙️ Backend (Node.js & Express)
*   **Security**: Stateless **JWT (JSON Web Tokens)** + `bcrypt` hashing.
*   **Middleware**: Tiered Access Control (Protect -> Authorize Role).
*   **Integrity**: Mongoose Schema-driven validation with automatic population.

### 🗄️ Database (MongoDB)
*   **Collections**: `Users`, `Tournaments`, `Teams`, `Matches`, `Standings`.
*   **Relationships**: Deep linking via `ObjectId` references with cascade cleanup.

---

## 🚀 Rapid Deployment

### 1. Environment Setup
Create a `.env` in the `backend/` directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
PORT=5000
```

### 2. Initialization
```bash
# Install dependencies
npm install

# Build & Run Backend
cd backend
npm run dev

# Run Frontend
cd ../frontend
npm run dev
```

---

## 🧪 Testing Protocol

*   **API Suitability**: Test all endpoints via **Postman** using the mapped suites.
*   **Validation Testing**: Verify chronological date constraints and unique email indexing.
*   **RBAC Verification**: Ensure Managers cannot access Personnel DB or delete overarching Tournaments.

---

## ✨ System Aesthetics
Designed to WOW. The UI utilizes:
*   🌑 **Glassmorphism**: Translucent panels for depth.
*   🔥 **Vibrant Accents**: High-saturation red and indigo for action items.
*   🌀 **Micro-animations**: Smooth transitions and hover scaling for a premium feel.

---

**Built with ❤️ for the future of sports management.** 🚀
