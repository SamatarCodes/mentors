<template>
  <section>
    <NavBar />
    <form @submit.prevent="login">
      <input type="hidden" />
      <h2>Login</h2>
      <label for="email">Email</label>
      <input
        v-model="email"
        type="email"
        name="email"
        id="email"
        placeholder="Enter your email address"
        required
      />
      <div class="email error"></div>

      <label for="password">Password</label>
      <input
        v-model="password"
        type="password"
        name="password"
        id="password"
        placeholder="Enter a password"
        required
      />
      <div class="password error">{{ errorMessage }}</div>
      <button>login</button>
    </form>
  </section>
</template>

// NOTE things that needs to be done here // [ ] Add vue-cookies

<script>
// [x] Always add the LOGIN URL
const LOGIN_URL = 'http://localhost:3000/mentors/login';
import NavBar from '../components/NavBar.vue';

// COMMENT - require Joi validation
const Joi = require('joi');

const schema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .min(3)
    .required(),
  password: Joi.string().min(6).trim().required(),
});

export default {
  name: 'Login',
  components: {
    NavBar,
  },
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  watch: {
    // COMMENT - if email or password changes, clear the error message
    email() {
      this.errorMessage = '';
    },
    password() {
      this.errorMessage = '';
    },
  },
  methods: {
    validateUser() {
      // 1. Make sure user's inputs are validated before we send it to the backend
      const result = schema.validate({
        email: this.email,
        password: this.password,
      });
      // if there's no errors, return true
      if (!result.error) {
        return true;
      }
      // if there's errors, display it to the user before sending it to the backend
      if (result.error.message.includes('password')) {
        this.errorMessage = 'Password is invalid';
      }
      // if we got here, it's because there's an error message
      return false;
    },
    async login() {
      // 2. if user's input is validated, we can now send it back to the database
      if (this.validateUser()) {
        const body = {
          email: this.email,
          password: this.password,
        };

        // COMMENT - send it back to the database
        try {
          const result = await fetch(LOGIN_URL, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await result.json();

          // COMMENT - check if there's error messages
          if (data.errors) {
            this.errorMessage = data.errors;
          }
          // COMMENT - if there's mentor property - redirect to homepage
          if (data.mentor) {
            location.assign('/');
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    },
  },
};
</script>
