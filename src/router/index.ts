import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import firebase from 'firebase';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Maps from '../views/Maps.vue';
import Players from '../views/Players.vue';
import Sweepstakes from '../views/Sweepstakes.vue';
import Login from '../views/Login.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/players',
    name: 'Players',
    component: Players,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/maps',
    name: 'Maps',
    component: Maps,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/sweepstakes',
    name: 'Sweepstakes',
    component: Sweepstakes,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((page) => page.meta.requiresAuth);

  if (requiresAuth && !firebase.auth().currentUser) {
    // next('/login');
  }

  next();
});

export default router;
