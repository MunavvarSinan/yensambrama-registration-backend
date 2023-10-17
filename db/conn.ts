import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://munavvar:dgJOtkszgMO4qE7A@yit.vmulc5n.mongodb.net/yen_sambrama?retryWrites=true&w=majority"

if (!MONGO_URI) {
    throw new Error("No mongo uri provided");
}
export async function connectDB() {
    try {
        mongoose.connect(MONGO_URI);
        const connection = mongoose.connection;
        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        })

        connection.on('error', (err) => {
            console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
            process.exit();
        })

    } catch (error) {
        console.log('Something goes wrong!');
        console.log(error);

    }
}
