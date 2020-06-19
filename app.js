const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');

// Init Express
const app = express();

app.use(cookieSession({ maxAge: 24 * 60 * 60 * 1000, keys: [process.env.COOKIE_KEY]}));

app.use(passport.initialize());
app.use(passport.session());

// Make use of .env for config
require('dotenv').config();

// App middleware
app.use(express.json()) // enable this to receive JSON data from client
app.use(morgan('dev')) // visualize api requests

// Import Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const todoRoutes = require('./routes/todo.routes');

// Use Routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', todoRoutes);

// Connect to MongoDb
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => console.log('DB connected ...'))
.catch(err => console.log('DB connection error', err))


// Establish Port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))