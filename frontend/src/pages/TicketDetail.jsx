// @ts-nocheck
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";

export default function TicketDetail() {
  const { id } = useParams(); // Gets the ticket_id from the URL
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for updating
  const [status, setStatus] = useState("");
  const [newNote, setNewNote] = useState("");
  const [updating, setUpdating] = useState(false);

  // Fetch ticket details on mount
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) throw new Error("Ticket not found");
        const data = await response.json();

        setTicket(data);
        setStatus(data.status); // Set initial status for the dropdown
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  // Handle Status Change & Note Submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes: newNote }),
      });

      if (!response.ok) throw new Error("Failed to update ticket");

      // Refresh the ticket data to show the new note and status
      const updatedResponse = await fetch(`${API_BASE_URL}/${id}`);
      const updatedData = await updatedResponse.json();

      setTicket(updatedData);
      setNewNote(""); // Clear the note input
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return <div className="text-center py-10">Loading ticket details...</div>;
  if (error)
    return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!ticket) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button
        onClick={() => navigate("/")}
        className="text-gray-500 hover:text-gray-900 transition-colors font-medium text-sm mb-2 inline-block"
      >
        &larr; Back to Tickets
      </button>

      {/* Ticket Info Card */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {ticket.subject}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Ticket ID: {ticket.ticket_id}
            </p>
          </div>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
            {ticket.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <span className="font-semibold text-gray-700">Customer:</span>{" "}
            {ticket.customer_name}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Email:</span>{" "}
            {ticket.customer_email}
          </div>
        </div>

        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Description
          </h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {ticket.description}
          </p>
        </div>
      </div>

      {/* Update & Notes Section */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Update Ticket</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Change Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-full md:w-1/3"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Add Note
            </label>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Type an internal note..."
              rows="3"
              className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={updating || (!newNote && status === ticket.status)}
            className="bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? "Saving..." : "Save Update"}
          </button>
        </form>
      </div>

      {/* Activity / Notes History */}
      {ticket.notes && ticket.notes.length > 0 && (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Activity History
          </h2>
          <div className="space-y-4">
            {ticket.notes.map((note, index) => (
              <div
                key={index}
                className="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <p className="text-xs text-gray-500 mb-1">
                  {new Date(note.created_at).toLocaleString()}
                </p>
                <p className="text-gray-800 text-sm whitespace-pre-wrap">
                  {note.note_text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
