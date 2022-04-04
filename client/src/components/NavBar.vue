<template>
  <div class="home">
    <nav class="navbar">
      <h2><a href="/">Mentor</a></h2>
      <ul class="navbar__links">
        <!-- <li><a href="/login">Login</a></li> -->
        <router-link to="/login" class="navbar__links--login"
          >Login</router-link
        >
        <!-- <li class="signup"><a href="/signup">Sign up</a></li> -->
        <router-link class="signup" to="/signup">Sign up </router-link>
      </ul>
    </nav>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Navbar',
  components: {},
};
</script>
<style>
.navbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}
.navbar__links {
  list-style: none;
  display: flex;
  justify-content: space-between;
  flex: 0 0 200px;
}
.navbar__links--login {
  margin-top: 10px;
}
.signup {
  background-color: #fee996;
  border: 0;
  border-radius: 36px;
  padding: 10px 16px;
  letter-spacing: 2px;
}
</style>
