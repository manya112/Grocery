import mongoose from "mongoose";
import dns from "dns";

// Custom DNS setup for Windows lookup to MongoDB Atlas
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
    // fallback if custom DNS set fails
}

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error("❌ MONGO_URI is missing in server/.env");
            return;
        }

        console.log("🔄 Connecting to MongoDB Atlas Cluster...");
        const conn = await mongoose.connect(uri);
        console.log(`--------------------------------------------------`);
        console.log(`✅ MONGO DB CONNECTED SUCCESSFULLY!`);
        console.log(`   Host: ${conn.connection.host}`);
        console.log(`   Database Name: ${conn.connection.name}`);
        console.log(`--------------------------------------------------`);
    } catch (error) {
        console.error(`--------------------------------------------------`);
        console.error(`❌ MONGODB CONNECTION FAILED!`);
        console.error(`   Error details: ${error.message}`);
        console.error(`   Please verify MongoDB Atlas Database Access User & Password in server/.env`);
        console.error(`--------------------------------------------------`);
    }
};

export default connectDB;
