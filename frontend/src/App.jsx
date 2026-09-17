import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import CreateTicket from "./pages/CreateTicket.jsx";
import TicketDetail from "./pages/TicketDetail.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Datastraw Support
          </Link>
          <div className="hidden sm:flex space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Tickets
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Dashboard
            </Link>
          </div>
          <Link
            to="/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            + New Ticket
          </Link>
        </nav>

        {/* Main Content Area */}
        <main className="max-w-5xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreateTicket />} />
            <Route path="/ticket/:id" element={<TicketDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
