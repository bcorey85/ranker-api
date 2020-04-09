const express = require('express');
const app = express();
const cors = require('cors');
const dbConnect = require('./config/db');
const port = process.env.PORT || 3001;

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const rankRoutes = require('./routes/rankRoutes');

dbConnect();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/rank', rankRoutes);

app.listen(port, () => console.log(`App started on ${port}`));
