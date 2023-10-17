
import express, { Express, Request, Response, Application } from 'express';
import { connectDB } from './db/conn';
import { router as eventRoutes } from './routes/events';
import cors from 'cors';

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/event', eventRoutes);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
