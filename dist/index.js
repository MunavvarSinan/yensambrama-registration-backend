"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const conn_1 = require("./db/conn");
const events_1 = require("./routes/events");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
const corsOptions = {
    origin: ['https://yensambrama.vercel.app', 'http://localhost:3000'],
};
app.use((0, cors_1.default)(corsOptions)); // Enable CORS for all routes
app.use(body_parser_1.default.json()); // Parse JSON request bodies
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('Welcome to Express & TypeScript Server');
});
(0, conn_1.connectDB)();
app.use('/api/event', events_1.router);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
