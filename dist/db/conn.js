"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://munavvar:dgJOtkszgMO4qE7A@yit.vmulc5n.mongodb.net/yen_sambrama?retryWrites=true&w=majority";
if (!MONGO_URI) {
    throw new Error("No mongo uri provided");
}
async function connectDB() {
    try {
        mongoose_1.default.connect(MONGO_URI);
        const connection = mongoose_1.default.connection;
        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        });
        connection.on('error', (err) => {
            console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
            process.exit();
        });
    }
    catch (error) {
        console.log('Something goes wrong!');
        console.log(error);
    }
}
exports.connectDB = connectDB;
