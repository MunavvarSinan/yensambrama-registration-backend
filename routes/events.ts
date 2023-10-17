import express from 'express';
import { connectDB } from '../db/conn';
import mongoose from 'mongoose';
import EventModel from '../models/EventDetailsModel';
import MemberModel from '../models/MemberModel';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const collection = mongoose.connection.db.collection('event_details');
        // Retrieve data from the collection
        const data = await collection.find({}).toArray();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', async (req, res) => {
    console.log(req.body);
})


export { router };