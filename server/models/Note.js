import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    ticket_id: { type: String, required: true }, // Acts as a foreign key linking to TKT-001[cite: 1]
    note_text: { type: String, required: true }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false }
});

export default mongoose.model('Note', noteSchema);