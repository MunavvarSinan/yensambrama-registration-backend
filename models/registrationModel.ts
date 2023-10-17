import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
    teamName: String,
    totalMembers: Number,
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event_details'
    },
    members: [
        {
            name: String,
            email: String,
            phone: String,
            year: String,
            branch: String,
            totalEventsRegistered: { type: Number, default: 0 },
        }
    ]
    // members: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'members', // Reference the members collection
    // }],
});

const RegisterModel = mongoose.model('registrations', registrationSchema);
export default RegisterModel;