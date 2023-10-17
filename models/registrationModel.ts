import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
    team: String,
    totalMembers: Number,
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event_details'
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'members', // Reference the members collection
    }],
});

const RegisterModel = mongoose.model('registrations', registrationSchema);
export default RegisterModel;