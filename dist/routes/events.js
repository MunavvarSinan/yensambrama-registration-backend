"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const MemberModel_1 = __importDefault(require("../models/MemberModel"));
const registrationModel_1 = __importDefault(require("../models/registrationModel"));
const nodemailer_1 = __importDefault(require("nodemailer"));
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
    try {
        const { eventType, eventId, teamName, members } = req.body; // Get the event type from the request
        // Check if any member of the team is already registered for the event
        for (const memberData of members) {
            let existingMember = await MemberModel_1.default.findOne({ email: memberData.email });
            if (existingMember) {
                const isUserAlreadyRegistered = await registrationModel_1.default.findOne({
                    members: existingMember._id,
                    event: eventId, // Check if the event is already in events array
                });
                if (isUserAlreadyRegistered) {
                    return res.status(401).json({
                        message: 'One or more members of the team are already registered for the event',
                    });
                }
            }
        }
        // Check event type and totalEventsRegistered for members
        if (eventType === 'Open') {
            // The event type is 'Open', so don't increment totalEventsRegistered
        }
        else {
            for (const memberData of members) {
                let existingMember = await MemberModel_1.default.findOne({ email: memberData.email });
                if (existingMember) {
                    if (existingMember.totalEventsRegistered && existingMember.totalEventsRegistered >= 3) {
                        return res.status(401).json({
                            message: 'One or more members of the team have already registered for 3 events',
                        });
                    }
                }
            }
        }
        // If no team member is already registered for the event and conditions are met, proceed with registration
        const membersArray = [];
        for (const memberData of members) {
            let existingMember = await MemberModel_1.default.findOne({ email: memberData.email });
            if (!existingMember) {
                // If the member doesn't exist, create a new member.
                memberData.totalEventsRegistered = 0;
                existingMember = new MemberModel_1.default(memberData);
                existingMember.phone_number = memberData.phone_number;
            }
            // Increment the totalEventsRegistered count if the event type is not 'Open'
            if (eventType !== 'Open') {
                existingMember.totalEventsRegistered += 1;
            }
            // Save the member (if needed)
            await existingMember.save();
            membersArray.push(existingMember);
        }
        const collection = mongoose_1.default.connection.db.collection('event_details');
        // Fetch the event details from the collection
        const eventIdObjectID = new mongoose_1.default.Types.ObjectId(eventId);
        const event = await collection.findOne({ _id: eventIdObjectID });
        console.log(membersArray);
        if (event) {
            const eventName = event.name;
            const registrationData = {
                teamName: teamName && teamName,
                totalMembers: membersArray.length,
                event: eventId,
                members: membersArray, // Save member IDs
            };
            // Continue with creating and saving the registration
            const registration = new registrationModel_1.default(registrationData);
            await registration.save().then((data) => {
                const transporter = nodemailer_1.default.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'yensambrama2023.yit@gmail.com',
                        pass: 'crguvsucxicwobzj',
                    }
                });
                // Define your HTML content with the event name
                const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Yensambrama 2023 Registration Confirmation</title>
        </head>
        <body>
            <p>Dear [Participant's Name],</p>
            <p>We appreciate your registration for <strong> ${eventName} </strong> at Yensambrama 2023. Your presence adds to the event's vibrancy. For any queries, kindly contact your respective coordinators. We look forward to seeing you there!</p>
            <p>Warm regards,</p>
            <p>Yensambrama Tech Team 2023</p>
        </body>
        </html>
        `;
                for (const member of membersArray) {
                    const mailOptions = {
                        from: 'yensambrama2023.yit@gmail.com',
                        to: member.email,
                        subject: 'Registration Confirmation',
                        html: htmlContent.replace('[Participant\'s Name]', member.name),
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error(`Error sending email to ${member.email}: ${error}`);
                        }
                        else {
                            console.log(`Email sent to ${member.email}: ${info.response}`);
                        }
                    });
                }
            });
        }
        else {
            // Handle the case where the event with the given ID is not found
            console.error('Event not found.');
            return res.status(404).json({ error: 'Event not found' });
        }
        return res.json({ message: 'Registration successfull' });
    }
    catch (error) {
        console.error(error);
        return res.json({ error: 'Internal Server Error' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        const eventIdObjectID = new mongoose_1.default.Types.ObjectId(eventId);
        // Find all registrations related to the given event ID
        const registrations = await registrationModel_1.default.find({ event: eventIdObjectID });
        console.log(registrations);
        res.json(registrations);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
