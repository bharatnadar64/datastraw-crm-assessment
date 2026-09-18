import * as ticketService from '../services/ticketService.js';

export const createTicket = async (req, res) => {
    try {
        const { customer_name, customer_email, subject, description } = req.body;

        // Basic validation
        if (!customer_name || !customer_email || !subject || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const savedTicket = await ticketService.createTicket({
            customer_name,
            customer_email,
            subject,
            description
        });

        // The assessment requires returning only ticket_id and created_at
        res.status(201).json({
            ticket_id: savedTicket.ticket_id,
            created_at: savedTicket.created_at
        });

    } catch (error) {
        console.error('Error creating ticket:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getTickets = async (req, res) => {
    try {
        const result = await ticketService.getTickets(req.query);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching tickets:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getTicketById = async (req, res) => {
    try {
        const { ticket_id } = req.params;

        const result = await ticketService.getTicketById(ticket_id);
        if (!result) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        const { ticket, notes } = result;

        // Return the combined details exactly as specified
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
};

export const updateTicket = async (req, res) => {
    try {
        const { ticket_id } = req.params;
        const { status, notes } = req.body;

        const updatedTicket = await ticketService.updateTicket(ticket_id, { status, notes });

        if (!updatedTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Return exactly what the specification requires
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
};
