"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
exports.router = router;
router.get('/', async (req, res) => {
    try {
        const collection = mongoose_1.default.connection.db.collection('event_details');
        // Retrieve data from the collection
        const data = await collection.find({}).toArray();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/', async (req, res) => {
    console.log(req.body);
});
