require('dotenv').config();
const express = require('express');
const connectDB = require('./db/db.config.js');
const { errorHandler } = require('./middleware/error.middleware');

const authRoutes = require('./routes/auth.routes');
const roomRoutes = require('./routes/rooms.routes');
const complaintRoutes = require('./routes/complaints.routes');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/complaints', complaintRoutes);

app.use(errorHandler);

const PORT = 3000;

connectDB().then(() => {
    app.listen(PORT, () => {console.log(`Server is running at port ${PORT}`)});
});
