"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const registrationSchema = new mongoose_1.default.Schema({
    teamName: String,
    totalMembers: Number,
    event: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'event_details'
    },
    members: [
        {
            name: String,
            email: String,
            phone_number: String,
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
const RegisterModel = mongoose_1.default.model('registrations', registrationSchema);
exports.default = RegisterModel;
