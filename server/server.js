require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const session = require("./models/session");
const sessionRoutes=require("./routes/sessionRoute");
const questionRoutes=require("./routes/questionRoute");
const {generateConceptExplanations,generateInterviewQuestions}=require("./controllers/aiControllers")
const {protect }=require("./middlewares/authMiddleware")

const app = express();  

const authRoutes = require("./routes/authRoutes");
app.use(cors({
    origin:"*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


connectDB(); // Connect to MongoDB


// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions",questionRoutes);

app.use("/api/ai/generate-question",protect ,generateInterviewQuestions);
app.use("/api/ai/generate-explanation",protect ,generateConceptExplanations);


//server upload folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads'),{}));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});