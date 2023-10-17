"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const eventDetailsSchema = new mongoose_1.default.Schema({
    id: String,
    name: String,
    venue: String,
    theme: String,
    student_coordinators: [
        {
            type: mongoose_1.default.Types.ObjectId
        }
    ],
    faculty_coordinators: [
        {
            type: mongoose_1.default.Types.ObjectId
        }
    ],
    rules: [
        { type: String }
    ],
    min_team_members: Number,
    max_team_members: Number,
    eventType: String
});
const EventModel = mongoose_1.default.model('event_details', eventDetailsSchema);
exports.default = EventModel;
