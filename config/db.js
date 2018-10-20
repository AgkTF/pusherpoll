const mongoose = require('mongoose');

// Mongoose connect
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.error(err));