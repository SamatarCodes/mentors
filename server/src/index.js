require('dotenv').config();
// Load mongoose module
const express = require('express');
const mongoose = require('mongoose');
const mentors = require('./routers/mentorRoute');
const volleyball = require('volleyball');
const cookieParser = require('cookie-parser');
const authentication = require('./middleware/authentication');
const cors = require('cors');

const corsOptions = {
  // let the client side localhost access to this backend server
  origin: 'http://localhost:8080',
};
// ----------------------------------------------------------------

const app = express();
// Middleware for public folder routes
app.use(express.static('public'));

// View engine configuration
app.set('view engine', 'ejs');
app.use(volleyball);
// CORS
app.use(cors(corsOptions));
// Use cookie-parser middleware to parse cookies
app.use(cookieParser());
// ----------------------------------------------------------------
// Define port - we gonna use heroku later
const port = process.env.PORT || 3000;

app.use(express.json());
// app.use('/mentors', mentors);
app.use('/mentors', mentors);
// Protected routes
app.use('/mentors/list', authentication, (req, res) => {
  res.render('list');
});

// ----------------------------------------------------------------
// Connect mongoose
const connectionURL = `mongodb+srv://mongodblesson:hLheELK9WCYjBN1L@cluster0.y07mk.mongodb.net/node-auth?retryWrites=true&w=majority`;

mongoose
  .connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) =>
    app.listen(port, () => {
      console.log('Connected to MongoDB');
    })
  )
  .catch((error) => {
    console.log(error);
  });
// ----------------------------------------------------------------
