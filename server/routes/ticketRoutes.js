import express from 'express';
import rateLimit from 'express-rate-limit';
import * as ticketController from '../controllers/ticketController.js';

const router = express.Router();

// Define the rate limit rule
const createTicketLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 ticket creations per window
    message: { message: 'Too many tickets created from this IP, please try again after 15 minutes.' }
});

// POST /api/tickets
router.post('/', createTicketLimiter, ticketController.createTicket);

// GET /api/tickets
router.get('/', ticketController.getTickets);

// GET /api/tickets/:ticket_id
router.get('/:ticket_id', ticketController.getTicketById);

// PUT /api/tickets/:ticket_id
router.put('/:ticket_id', ticketController.updateTicket);

export default router;