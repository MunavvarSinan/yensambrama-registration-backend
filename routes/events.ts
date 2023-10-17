import express from 'express';
import { connectDB } from '../db/conn';
import mongoose from 'mongoose';
import MemberModel from '../models/MemberModel';
import RegisterModel from '../models/registrationModel';
import nodemailer from 'nodemailer';


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
    try {
        const { eventType, eventId, teamName, members } = req.body; // Get the event type from the request

        // Check if any member of the team is already registered for the event
        for (const memberData of members) {
            let existingMember = await MemberModel.findOne({ email: memberData.email });

            if (existingMember) {
                const isUserAlreadyRegistered = await RegisterModel.findOne({
                    members: existingMember._id, // Check if the member is in the members array
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
        } else {
            for (const memberData of members) {
                let existingMember = await MemberModel.findOne({ email: memberData.email });

                if (existingMember) {
                    if (existingMember.totalEventsRegistered && existingMember.totalEventsRegistered >= 3) {
                        return res.status(401).json({
                            message:
                                'One or more members of the team have already registered for 3 events',
                        });
                    }
                }
            }
        }

        // If no team member is already registered for the event and conditions are met, proceed with registration
        const membersArray = [] as any
        for (const memberData of members) {
            let existingMember = await MemberModel.findOne({ email: memberData.email });

            if (!existingMember) {
                // If the member doesn't exist, create a new member.
                memberData.totalEventsRegistered = 0;
                existingMember = new MemberModel(memberData);
            }

            // Save the member (if needed)
            await existingMember.save();
            membersArray.push(existingMember);

            // Increment the totalEventsRegistered count if the event type is not 'Open'
            if (eventType !== 'Open') {
                existingMember.totalEventsRegistered += 1;
                await existingMember.save();
            }
        }

        const registrationData = {
            teamName: teamName && teamName,
            totalMembers: membersArray.length,
            event: eventId, // Add the event ID to the events array
            members: membersArray // Save member IDs
        };
        const collection = mongoose.connection.db.collection('event_details');
        // Fetch the event details from the collection
        const eventIdObjectID = new mongoose.Types.ObjectId(eventId);

        const event = await collection.findOne({ _id: eventIdObjectID });

        if (event) {
            const eventName = event.name; // Replace 'name' with the actual field in your event document
            // Continue with creating and saving the registration
            const registration = new RegisterModel(registrationData);
            await registration.save().then((data) => {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'munavvarsinan987@gmail.com',
                        pass: 'lbcibaxivctdhjbd',
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
                        from: 'munavvarsinan987@gmail.com',
                        to: member.email,
                        subject: 'Registration Confirmation',
                        html: htmlContent.replace('[Participant\'s Name]', member.name),
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error(`Error sending email to ${member.email}: ${error}`);
                        } else {
                            console.log(`Email sent to ${member.email}: ${info.response}`);
                        }
                    });
                }
            });
        } else {
            // Handle the case where the event with the given ID is not found
            console.error('Event not found.');
        }

        return res.json({ message: 'Registration successfull' });
    } catch (error) {
        console.error(error);
        return res.json({ error: 'Internal Server Error' });
    }
})


export { router };