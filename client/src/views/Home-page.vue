<template>
  <div>
    <NavBar />
    <h2>Home</h2>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '../components/Nav-Bar.vue';
export default {
  name: 'Home-page',
  components: {
    NavBar,
  },
};
</script>
<style>
.navbar {
  display: flex;
  justify-content: space-between;
}
.navbar__links {
  list-style: none;
  display: flex;
  justify-content: space-between;
  flex: 0 0 200px;
}
.navbar__links li:first-child {
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
