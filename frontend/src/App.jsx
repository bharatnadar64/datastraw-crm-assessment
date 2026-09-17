import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import CreateTicket from "./pages/CreateTicket.jsx";
import TicketDetail from "./pages/TicketDetail.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight">
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
            className="bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 shadow-sm transition-all"
          >
            + New Ticket
          </Link>
        </nav>

        {/* Main Content Area */}
        <main className="max-w-6xl mx-auto p-6 md:p-8">
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
