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
    members: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'members', // Reference the members collection
        }],
});
const RegisterModel = mongoose_1.default.model('registrations', registrationSchema);
exports.default = RegisterModel;
