# 💰 Expense Tracker App

A full-stack personal finance management application built with the **MERN stack** (MongoDB, Express, React, Node.js). Track your income and expenses, visualize spending patterns with interactive charts, and get AI-powered financial insights via an integrated **Gemini chatbot**.

> 🔗 **Live Demo:** [expense-tracker-app-alpha-ebon.vercel.app](https://expense-tracker-app-alpha-ebon.vercel.app)

---

## ✨ Features

### 📊 Dashboard
- **Financial Overview** — View total income, total expenses, and remaining balance at a glance
- **Expense Breakdown Chart** — Interactive doughnut chart (Chart.js) showing spending by category
- **Recent Transactions** — Quick view of the latest transactions with category icons
- **Editable Monthly Income** — Update your monthly income directly from the dashboard

### 💳 Transaction Management
- **Add Transactions** — Log income or expense entries with amount, category, date, and description
- **Edit Transactions** — Modify existing transaction details
- **Delete Transactions** — Remove transactions with ownership verification
- **View All Transactions** — Paginated list of all transactions, sorted by date (newest first)
- **Category Support** — Organize transactions by categories (Food, Rent, Shopping, Transport, Entertainment, etc.)

### 🤖 AI Financial Assistant (Gemini Chatbot)
- **Context-Aware Insights** — The chatbot analyzes your last 60 days of transactions to provide personalized advice
- **Spending Trend Analysis** — Compare month-over-month spending and identify spikes
- **Actionable Recommendations** — Receive specific, data-driven suggestions to optimize your finances
- **Powered by Google Gemini 1.5 Flash** — Fast and intelligent financial analysis

### 🔐 Authentication & Security
- **JWT-based Authentication** — Secure token-based auth with HTTP-only cookies
- **Password Hashing** — Bcrypt encryption for all stored passwords
- **Protected Routes** — All financial data routes require authentication
- **Ownership Verification** — Users can only access and modify their own transactions
- **Rate Limiting** — API rate limiting to prevent abuse
- **Centralized Error Handling** — Consistent error responses across all endpoints

### 📈 Analytics
- **Category-wise Breakdown** — MongoDB aggregation pipeline for category spending analysis
- **Monthly Summary** — Income vs. expense comparison over the last 6 months

### 🎨 UI/UX
- **Dark Glassmorphism Theme** — Premium dark mode with frosted glass effects
- **Framer Motion Animations** — Smooth page transitions and micro-interactions
- **Responsive Design** — Optimized for desktop and mobile devices
- **Sidebar Navigation** — Clean layout with collapsible sidebar
- **React Icons** — Consistent iconography throughout the app

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library |
| **Vite** | Build tool & dev server |
| **React Router v6** | Client-side routing |
| **Chart.js / react-chartjs-2** | Data visualization (doughnut charts) |
| **Framer Motion** | Animations & transitions |
| **Tailwind CSS** | Utility-first styling |
| **MUI (Material UI)** | UI components |
| **React Icons** | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT (jsonwebtoken)** | Authentication tokens |
| **Bcrypt** | Password hashing |
| **Google Generative AI** | Gemini chatbot integration |
| **cookie-parser** | Cookie handling |
| **express-rate-limit** | API rate limiting |
| **CORS** | Cross-origin resource sharing |

---

## 📁 Project Structure

```
Expense-Tracker-App/
├── Api/                          # Backend (Express + MongoDB)
│   ├── controllers/
│   │   ├── auth.controller.js        # Sign up, sign in, logout
│   │   ├── chat.controller.js        # AI chatbot (Gemini)
│   │   ├── profile.controller.js     # Get/update user profile
│   │   └── transaction.controller.js # CRUD + analytics
│   ├── middleware/
│   │   ├── auth.middleware.js         # JWT verification
│   │   └── errorHandler.middleware.js # Centralized error handler
│   ├── models/
│   │   ├── Transaction.js            # Transaction schema
│   │   └── User.js                   # User schema
│   ├── routes/
│   │   ├── auth.routes.js            # /api/signup, /api/signin, /api/logout
│   │   ├── chat.routes.js            # /api/chat
│   │   ├── profile.routes.js         # /api/profile
│   │   └── transaction.routes.js     # /api/transactions, /api/transaction/:id
│   ├── .env.example                  # Environment variable template
│   ├── index.js                      # Server entry point
│   └── package.json
│
├── Frontend/                     # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chatbot/              # AI chatbot component
│   │   │   ├── Layout/               # App layout with sidebar
│   │   │   └── ProtectedRoute.jsx    # Auth guard for routes
│   │   ├── context/
│   │   │   └── UserContext.jsx       # Global user state (React Context)
│   │   ├── pages/
│   │   │   ├── AddTransaction/       # Add new income/expense
│   │   │   ├── AllTransactions/      # View all transactions (paginated)
│   │   │   ├── Auth/                 # Sign In & Sign Up pages
│   │   │   ├── Dashboard/            # Main dashboard with charts
│   │   │   └── EditTransaction/      # Edit existing transaction
│   │   ├── App.jsx                   # Root component with routes
│   │   └── main.jsx                  # App entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/signup` | Register a new user |
| `POST` | `/api/signin` | Login & receive auth cookie |
| `POST` | `/api/logout` | Clear auth cookie |

### Transactions (🔒 Protected)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/transactions?page=1&limit=10` | List all transactions (paginated) |
| `GET` | `/api/transaction/:id` | Get a single transaction |
| `POST` | `/api/transaction` | Create a new transaction |
| `PUT` | `/api/transaction/:id` | Update a transaction |
| `DELETE` | `/api/transaction/:id` | Delete a transaction |
| `GET` | `/api/analytics?year=2026&month=2` | Get spending analytics |

### Profile (🔒 Protected)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/profile` | Get user profile |
| `PUT` | `/api/profile` | Update monthly income |

### AI Chat (🔒 Protected)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | Send a message to the AI financial assistant |

### Health Check
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/test` | Server health check |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** account ([MongoDB Atlas](https://www.mongodb.com/atlas) for cloud)
- **Google Gemini API key** ([Get one here](https://aistudio.google.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/nandinikashyap1902/Expense-Tracker-App.git
cd Expense-Tracker-App
```

### 2. Backend Setup

```bash
cd Api
npm install
```

Create a `.env` file in the `Api/` directory (use `.env.example` as a reference):

```env
# MongoDB connection string (from MongoDB Atlas)
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

# JWT secret — make this long and random
SECRET_KEY=your_super_secret_jwt_key_here

# Google Gemini API key
GEMINI_API_KEY=your_gemini_api_key_here

# App environment
NODE_ENV=development

# Server port (optional — defaults to 5000)
PORT=5000
```

> 💡 **Tip:** Generate a strong JWT secret with:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

Start the backend:

```bash
npm run dev     # Development (with nodemon hot-reload)
npm start       # Production
```

### 3. Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend/` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 🌐 Deployment

### Frontend — Vercel
The frontend is deployed on [Vercel](https://vercel.com/). Set the `VITE_API_URL` environment variable to your backend URL.

### Backend — Render / Railway
The backend can be deployed on [Render](https://render.com/) or [Railway](https://railway.app/). Ensure all environment variables from `.env.example` are configured in your hosting dashboard.

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 🙋‍♀️ Author

**Nandini Kashyap**

- GitHub: [@nandinikashyap1902](https://github.com/nandinikashyap1902)

---

<p align="center">
  Made with ❤️ using the MERN Stack + Gemini AI
</p>
