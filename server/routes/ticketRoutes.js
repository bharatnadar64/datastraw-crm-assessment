// @ts-nocheck
import express from 'express';
import Ticket from '../models/Ticket.js';
import Note from '../models/Note.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Define the rate limit rule
const createTicketLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 ticket creations per window
    message: { message: 'Too many tickets created from this IP, please try again after 15 minutes.' }
});

// POST /api/tickets
router.post('/', createTicketLimiter, async (req, res) => {
    try {
        const { customer_name, customer_email, subject, description } = req.body;

        // Basic validation
        if (!customer_name || !customer_email || !subject || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }

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

        // The assessment requires returning only ticket_id and created_at
        res.status(201).json({
            ticket_id: savedTicket.ticket_id,
            created_at: savedTicket.created_at
        });

    } catch (error) {
        console.error('Error creating ticket:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET /api/tickets
router.get('/', async (req, res) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
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
            return res.status(200).json({ tickets, totalPages: 1, currentPage: 1 });
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

        res.status(200).json({
            tickets,
            totalPages: Math.ceil(totalTickets / limitNumber),
            currentPage: pageNumber
        });
    } catch (error) {
        console.error('Error fetching tickets:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET /api/tickets/:ticket_id
router.get('/:ticket_id', async (req, res) => {
    try {
        const { ticket_id } = req.params;

        // Find the ticket
        const ticket = await Ticket.findOne({ ticket_id });
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Find associated notes using the ticket_id foreign key
        const notes = await Note.find({ ticket_id })
            .select('note_text created_at -_id')
            .sort({ created_at: -1 });

        // Return the combined details exactly as specified[cite: 1]
        res.status(200).json({
            ticket_id: ticket.ticket_id,
            customer_name: ticket.customer_name,
            customer_email: ticket.customer_email,
            subject: ticket.subject,
            description: ticket.description,
            status: ticket.status,
            notes: notes
        });
    } catch (error) {
        console.error('Error fetching ticket details:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// PUT /api/tickets/:ticket_id
router.put('/:ticket_id', async (req, res) => {
    try {
        const { ticket_id } = req.params;
        const { status, notes } = req.body;

        // 1. Find the ticket
        const ticket = await Ticket.findOne({ ticket_id });
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
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

        // 4. Return exactly what the specification requires[cite: 1]
        res.status(200).json({
            success: true,
            updated_at: updatedTicket.updated_at
        });

    } catch (error) {
        console.error('Error updating ticket:', error.message);
        // Handle Mongoose validation errors (like invalid status)
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;