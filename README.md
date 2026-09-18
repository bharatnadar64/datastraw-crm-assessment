# 🎯 Datastraw Support CRM System

> **A live, full-stack Customer Support CRM built for the Datastraw Technologies internship assessment.**
> 
> Enables support teams to efficiently create, track, manage, and resolve customer inquiries at scale with a clean UI, robust RESTful architecture, and production-ready performance.

---

## 🔗 Live Links

- 🌐 **Frontend (Live App):** https://datastraw-crm-assessment-jbk5.vercel.app
- ⚙️ **Backend API:** https://datastraw-crm-assessment.vercel.app/
- 🎥 **Demo Video:** https://www.loom.com/share/3439c89d14ba429ba5f7adb9c1d13ab1

---

## ✨ Core Features

- **Lifecycle Tracking:** End-to-end ticket management (Open, In Progress, Closed).
- **Smart Search & Filter:** Debounced, works-as-you-type search across multiple fields (ID, Name, Email, Description) & instant status filtering.
- **Activity Tracking:** Append timestamped, chronological internal notes to any ticket.
- **Auto-Generated IDs:** System automatically issues sequential tracking IDs (e.g., `TKT-001`).

---

## 🚀 Standout Features (Built for Scale)

- 📊 **Visual Analytics Dashboard:** Real-time Recharts-powered visualization of ticket volume & status distributions.
- 🚦 **IP Rate Limiting:** Backend defensive programming (`express-rate-limit`) prevents malicious bot spamming.
- 📄 **Server-Side Pagination:** Efficient database querying using limits & skips, protecting browser memory and DB load.

---

## 🛠️ Tech Stack

**Frontend:** React.js (Vite) | Tailwind CSS | React Router DOM | Recharts  
**Backend:** Node.js | Express.js | MongoDB Atlas & Mongoose | Express-Rate-Limit

---

## 💻 Local Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB connection string (local or Atlas)

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
MONGO_URI=your_mongodb_connection_string_here
PORT=5000
```
Start server:
```bash
npm run dev
# Running on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
*Note: Ensure `API_BASE_URL` in `src/utils/api.js` points to `http://localhost:5000/api/tickets`.*

Start app:
```bash
npm run dev
# Running on http://localhost:5173
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/tickets` | Creates a new ticket *(Rate Limited)*. |
| **GET** | `/api/tickets` | Retrieves tickets *(Supports page, limit, search, status)*. |
| **GET** | `/api/tickets/:id` | Retrieves full details & notes for a specific ticket. |
| **PUT** | `/api/tickets/:id` | Updates ticket status and/or appends a new note. |

---

## 🔮 Future Improvements

**Bulk CSV Import Endpoint:** If given more time, adding a `POST /api/tickets/import` endpoint would allow parsing, validating, and bulk-inserting rows, saving agents hundreds of hours of manual data entry from legacy systems or spreadsheets.
