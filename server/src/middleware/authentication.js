const jwt = require('jsonwebtoken');
const Mentor = require('../models/Mentor');
// ---------------------------------------------------------------

// What are we trying to do here?
// 1. When user logs in, they have to be authenticated
//    Grab the token and find the userID

// 2. After you find the userID, check if that user exists `
//    If that user exist, see if that token is in the array of tokens
//
const authentication = async (req, res, next) => {
  try {
    // 1. When user logs in, they have to be authenticated

    //const token = req.header('Authorization').split(' ')[1];
    // Get access to the token from the token
    const token = req.cookies.jwt;
    // Verify the token and find thet user ID
    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    // Grab the id of the user
    const id = decodedToken.id;

    // Find the user in the document
    const mentor = await Mentor.findOne({ id: id, 'tokens.token': token });
    // if we don't find a user with that token, throw an error
    if (!mentor) throw new Error();

    // add the mentor to the request
    req.mentor = mentor;
    req.token = token;
    next();
  } catch (error) {
    res.redirect('/mentors/login');
    // res.status(401).json({ error: 'Please authenticate' });
  }
};

module.exports = authentication;
