const { Router } = require('express');
// Create new instance of that Router
const router = Router();

const Mentor = require('../models/Mentor');
const authentication = require('../middleware/authentication');

// ----------------------------------------------------------------

// Handle sign up errors
const handleErrors = (error) => {
  let errors = { email: '', password: '' };
  // console.log(error.message, error.code);
  // validation errors
  if (error.message.includes('mentor validation failed')) {
    console.log(error.errors);
    // Object.values(error.errors);
    // We dont want the key but we want the value of each key
    Object.values(error.errors).forEach(({ properties }) => {
      console.log(properties.message);
      errors[properties.path] = properties.message;
    });
  }
  if (error.code === 11000) {
    errors.email = 'This email is already registered';
    return errors;
  }
  return errors;
};
// ----------------------------------------------------------------
// COMMENT - HOMEPAGE
router.get('/home', authentication, (req, res) => {
  res.render('home');
});

// COMMENT- GET - SIGN UP
router.get('/signup', (req, res) => {
  res.render('signup');
});

// ----------------------------------------------------------------
// * GET - LOGIN
router.get('/login', (req, res) => {
  res.render('login');
});
// ----------------------------------------------------------------

// COMMENT - SIGN UP
router.post('/signup', async (req, res) => {
  // Get the email/password first
  const { email, password } = req.body;
  // Try to register user's email and password to the database
  try {
    // try to save it to the database;
    const mentor = await Mentor.create(req.body);
    // Generate new token after user is registered
    const token = await mentor.generateAuthToken();

    // Now, place that token inside a cookie and send it back as part of the response
    res.cookie('jwt', token, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    // send a response to user
    //  res.status(201).json({ mentor, token });
    // if in the frontend, we get this back, it means its successfull

    res.status(201).json({ mentor: mentor.id });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
});

// ----------------------------------------------------------------
// ! LOGIN USER

router.post('/login', async (req, res) => {
  // Get the email/password first

  try {
    // login user - find the user in the database and log them in if found
    const mentor = await Mentor.login(req.body.email, req.body.password);
    // create token for the user and they are logged in as long as they have this token

    // THIS IS SAVED TO THE DATABASE
    const token = await mentor.generateAuthToken();

    // add that token inside a cookie
    // As long as user has this token, they are considered as logged in
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });
    // res.status(200).json({ mentor, token });
    res.status(200).json({ token });
  } catch (error) {
    // Send back this errors
    res.status(403).json({ errors: error.message });
  }
});
// ----------------------------------------------------------------

// * Read profile
router.get('/me', authentication, (req, res) => {
  res.status(200).json({ profile: req.mentor });
});

// ----------------------------------------------------------------
// * Logout one device (token)
router.post('/logout', authentication, async (req, res) => {
  try {
    req.mentor.tokens = req.mentor.tokens.filter((token) => {
      return token.token !== req.token;
    });

    // Remove the token from the token array
    // let's save it back to the database
    req.mentor.save();

    // Change the cookie and make sure it expires quickly
    res.cookie('jwt', '', { maxAge: 1 });
    // Send a response back to the client/user
    res.status(200).json({ mentor: req.mentor.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: error.message });
  }
});

module.exports = router;
