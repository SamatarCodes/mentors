const mongoose = require('mongoose');
const { Schema } = mongoose;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// ----------------------------------------------------------------
const mentorSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      lowercase: true,
      trim: true,
      // validate(value) {
      //   // if we provide invalid email address
      //   if (!validator.isEmail(value)) {
      //     throw new Error('Invalid Email');
      //   }
      // },
      validate: [isEmail, 'Please enter a valid Email'],
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minLength: [6, 'Minimum password length is 6 characters'],
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error('Password cannot contain password');
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);
// ----------------------------------------------------------------
// METHODS - on instance
mentorSchema.methods.generateAuthToken = async function () {
  const mentor = this;
  const token = jwt.sign({ id: mentor.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1hr',
  });

  // add the new generated token to the token array;
  // concat on new item
  mentor.tokens = mentor.tokens.concat({ token: token });
  //  mentor.tokens = mentor.tokens.concac

  // save it to make sure the token shows up in the database
  await mentor.save();
  return token;
};

// ----------------------------------------------------------------
// MIDDLEWARE - HASH passwords
// Let's create a pre hook before user is saved to database
mentorSchema.pre('save', async function (next) {
  // this => document
  // User => Model
  const mentor = this;
  // if password is modified, hash it again
  if (mentor.isModified('password')) {
    const salt = await bcrypt.genSalt();
    mentor.password = await bcrypt.hash(mentor.password, salt);
  }
  next();
});

// ----------------------------------------------------------------
// STATICS -MODEL METHODS
mentorSchema.statics.login = async (email, password) => {
  // find the user by email
  const mentor = await Mentor.findOne({ email });

  // If you don't find the user, throw an Error
  if (!mentor) throw new Error('Unable to login');

  // if we do find a matching email, compare the password against it
  if (mentor) {
    const isMatch = await bcrypt.compare(password, mentor.password);
    if (isMatch) {
      return mentor;
    } else {
      throw new Error('Unable to login');
    }
  }
};
// ----------------------------------------------------------------
// Let's create a model based on this Schema
const Mentor = mongoose.model('mentor', mentorSchema);

module.exports = Mentor;
