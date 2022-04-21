// NOTE - This is where all our routes are defined

import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home-page.vue';
import Login from '../views/Login-page.vue';
import Signup from '../views/Signup-page.vue';
import Dashboard from '../views/Dashboard-page.vue';

const loggedInRedirectDashboard = (to, from, next) => {
  // if there is a token, redirect to dashboard
  if (localStorage.token) {
    next('/dashboard');
  } else {
    // let them go to the signup page
    next();
  }
};

const isLoggedIn = (to, from, next) => {
  if (!localStorage.token) {
    // if they don't have a token
    next('/login');
  } else {
    // if they have a token? Then let them through
    next();
  }
};

const routes = [
  // PAGES
  {
    path: '/',
    name: 'Home-page',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login-page',
    component: Login,
    beforeEnter: loggedInRedirectDashboard,
  },
  {
    path: '/signup',
    name: 'Signup-page',
    component: Signup,
    beforeEnter: loggedInRedirectDashboard,
  },
  {
    path: '/dashboard',
    name: 'Dashboard-page',
    component: Dashboard,
    beforeEnter: isLoggedIn,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
