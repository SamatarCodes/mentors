<template>
  <section>
    <NavBar />
    <div v-if="signingUp" class="pacman">
      <img src="../assets/pacman.svg" alt="pacman loader" />
    </div>
    <form v-if="!signingUp" @submit.prevent="signup">
      <input type="hidden" />
      <h2>Sign up</h2>
      <label for="email">Email</label>
      <input
        v-model="email"
        type="email"
        size="30"
        name="email"
        id="email"
        aria-describedby="emailHelp"
        placeholder="Enter your email address"
        required
      />
      <div class="email error">{{ emailError }}</div>

      <label for="password">Password</label>
      <input
        v-model="password"
        type="password"
        name="password"
        id="password"
        aria-describedby="passwordHelp"
        placeholder="Enter a password"
        required
      />
      <div class="password error">{{ passwordError }}</div>
      <input
        v-model="confirmPassword"
        type="password"
        name="confirmPassword"
        id="confirmPassword"
        aria-describedby="passwordHelp"
        placeholder="Confirm password"
        required
      />
      <!-- confirm password error -->
      <div v-if="errorMessage" class="password error">{{ errorMessage }}</div>
      <button>Sign up</button>
    </form>
  </section>
</template>

<script>
// [x]: Clear errorMessage property if user types again
// [x]: Clear emailError property if user types
// [x]: Clear passwordError property if user types

const SIGNUP_URL = 'http://localhost:3000/mentors/signup';
import NavBar from '../components/NavBar.vue';

export default {
  name: 'Signup',
  components: {
    NavBar,
  },
  data() {
    return {
      signingUp: false,
      errorMessage: '',
      email: '',
      password: '',
      confirmPassword: '',
      emailError: '',
      passwordError: '',
    };
  },
  watch: {
    // COMMENT - if confirmPassword changes, clear the error message
    confirmPassword() {
      this.errorMessage = '';
    },
    // COMMENT - if password changes, clear the error message
    password() {
      this.passwordError = '';
    },
    // COMMENT - if email change, clear the error message
    email() {
      this.emailError = '';
    },
  },
  methods: {
    async signup() {
      // Clear the error message;
      this.errorMessage = '';
      // COMMENT - Send the data to the server if it's verified
      if (this.validUser()) {
        const body = {
          email: this.email,
          password: this.password,
        };
        // COMMENT - LOADING PACMAN
        this.signingUp = true;
        try {
          // send the data to the user
          const result = await fetch(SIGNUP_URL, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const data = await result.json();
          // Check if there's errors
          if (data.errors) {
            this.emailError = data.errors.email;
            this.passwordError = data.errors.password;
          }

          // NOTE if user is created then redirect user to homepage
          setTimeout(() => {
            this.signingUp = false;
            if (data.mentor) this.$router.push('/');
          }, 1000);
        } catch (error) {
          console.log(error);
          setTimeout(() => {
            // Show the error message here
            this.errorMessage = error.message;
            this.signingUp = false;
          }, 1000);
        }
      }
    },
    validUser() {
      // if the passwords don't match
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords must match 😡';
        return false;
      }
      // if the passwords match, then
      return true;
    },
  },
};
</script>
<style>
.pacman {
  text-align: center;
}
</style>
