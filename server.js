require('dotenv').config();
const app = require("./index");
const connectDB = require("./config/db"); // import db.js

// Connect to MongoDB before starting server
connectDB.once('open', () => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5050;
    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    });
});

connectDB.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});
