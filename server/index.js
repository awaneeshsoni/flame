import mongoose from 'mongoose';
import express from "express"
import cors from "cors"
import { configDotenv } from 'dotenv';
import auth from "./routes/auth.js"
import video from "./routes/video.js"
import workspace from './routes/workspace.js';
import user from "./routes/user.js"
import webhooks from "./routes/webhooks.js"

configDotenv();
const PORT = process.env.PORT || 5000;

const app = express();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

connectDB(); 

const corsOptions = {
    origin: ['https://flameio.vercel.app',
        'https://flame-lemon.vercel.app', 
        'http://localhost:5173', 
        'https://flameio.contentarc.co', 
        'https://flame.contentarc.co', 
        'https://flameio.com', 
        'https://www.flameio.com'],  
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
};

app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));
app.use(
    "/api/webhooks/lemonsqueezy",
    express.raw({ type: "application/json" }) 
);
app.use(express.json());

app.get('/', (req, res) => res.send('API Running'));
app.use('/api/auth', auth);
app.use('/api/workspace', workspace );
app.use('/api/video', video);
app.use('/api/user', user);
app.use('/api/webhooks', webhooks);


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
