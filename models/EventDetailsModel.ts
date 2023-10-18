import mongoose from 'mongoose';
const eventDetailsSchema = new mongoose.Schema({

    id: String,
    name: String,
    venue: String,
    theme: String,
    student_coordinators: [
        {
            name: String,
            phone_number: String,
        }
    ],
    faculty_coordinators: [
        {
            name: String,
            phone_number: String,
        }
    ],
    rules: [
        { type: String }
    ],
    min_team_members: Number,
    max_team_members: Number,
    eventType: String
});
const EventModel = mongoose.model('event_details', eventDetailsSchema);

export default EventModel;
