"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const conn_1 = require("./db/conn");
const events_1 = require("./routes/events");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
// Define your frontend domain
const allowedOrigins = ['http://localhost:3000', 'https://yensambrama.vercel.app/'];
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};
app.use((0, cors_1.default)(corsOptions));
app.get('/', (req, res) => {
    res.send('Welcome to Express & TypeScript Server');
});
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", allowedOrigins);
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
(0, conn_1.connectDB)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/event', events_1.router);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
