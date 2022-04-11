// NOTE - This is where all our routes are defined

import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home-page.vue';
import Login from '../views/Login-page.vue';
import Signup from '../views/Signup-page.vue';

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
  },
  {
    path: '/signup',
    name: 'Signup-page',
    component: Signup,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
