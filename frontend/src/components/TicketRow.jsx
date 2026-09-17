// @ts-nocheck
import { Link } from "react-router-dom";

export default function TicketRow({ ticket }) {
  // Helper to color-code statuses
  const getStatusColor = (status) => {
    if (status === "Open") return "bg-yellow-100 text-yellow-800";
    if (status === "In Progress") return "bg-blue-100 text-blue-800";
    if (status === "Closed") return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition">
      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
        {ticket.ticket_id}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {ticket.customer_name}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
        {ticket.subject}
      </td>
      <td className="px-6 py-4 text-sm">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${getStatusColor(ticket.status)}`}
        >
          {ticket.status}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {new Date(ticket.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 text-sm text-right">
        <Link
          to={`/ticket/${ticket.ticket_id}`}
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          View
        </Link>
      </td>
    </tr>
  );
}
