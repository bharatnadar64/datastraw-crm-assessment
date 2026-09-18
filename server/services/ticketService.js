import Ticket from '../models/Ticket.js';
import Note from '../models/Note.js';

export const createTicket = async (ticketData) => {
    const { customer_name, customer_email, subject, description } = ticketData;

    // Generate a sequential ticket ID (e.g., TKT-001)
    const ticketCount = await Ticket.countDocuments();
    const ticket_id = `TKT-${String(ticketCount + 1).padStart(3, '0')}`;

    const newTicket = new Ticket({
        ticket_id,
        customer_name,
        customer_email,
        subject,
        description
    });

    const savedTicket = await newTicket.save();
    return savedTicket;
};

export const getTickets = async (queryParams) => {
    const { status, search, page = 1, limit = 10 } = queryParams;
    let query = {};

    if (status) query.status = status;

    if (search) {
        query.$or = [
            { customer_name: { $regex: search, $options: 'i' } },
            { ticket_id: { $regex: search, $options: 'i' } },
            { customer_email: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    // If limit is set to 'all', fetch everything (useful for the dashboard)
    if (limit === 'all') {
        const tickets = await Ticket.find(query)
            .select('ticket_id customer_name subject status created_at -_id')
            .sort({ created_at: -1 });
        return { tickets, totalPages: 1, currentPage: 1 };
    }

    // Calculate pagination variables
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch paginated tickets and the total count
    const tickets = await Ticket.find(query)
        .select('ticket_id customer_name subject status created_at -_id')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limitNumber);

    const totalTickets = await Ticket.countDocuments(query);

    return {
        tickets,
        totalPages: Math.ceil(totalTickets / limitNumber),
        currentPage: pageNumber
    };
};

export const getTicketById = async (ticket_id) => {
    // Find the ticket
    const ticket = await Ticket.findOne({ ticket_id });
    if (!ticket) {
        return null;
    }

    // Find associated notes using the ticket_id foreign key
    const notes = await Note.find({ ticket_id })
        .select('note_text created_at -_id')
        .sort({ created_at: -1 });

    return {
        ticket,
        notes
    };
};

export const updateTicket = async (ticket_id, updateData) => {
    const { status, notes } = updateData;

    // 1. Find the ticket
    const ticket = await Ticket.findOne({ ticket_id });
    if (!ticket) {
        return null;
    }

    // 2. Update status if provided
    if (status) {
        // Mongoose will validate this against the ['Open', 'In Progress', 'Closed'] enum
        ticket.status = status;
    }

    // Save the ticket to trigger the updated_at timestamp change
    const updatedTicket = await ticket.save();

    // 3. Add a new note if provided in the request body
    if (notes) {
        const newNote = new Note({
            ticket_id: ticket.ticket_id,
            note_text: notes
        });
        await newNote.save();
    }

    return updatedTicket;
};
