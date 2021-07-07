import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import firebase from 'firebase';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Maps from '../views/Maps.vue';
import Players from '../views/Players.vue';
import Sweepstakes from '../views/Sweepstakes.vue';
import Login from '../views/Login.vue';
import EmailConfirmation from '../views/EmailConfirmation.vue';

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
  {
    path: '/emailConfirmation',
    name: 'EmailConfirmation',
    component: EmailConfirmation,
    meta: {
      emailConfirmation: true,
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((page) => page.meta.requiresAuth);
  const user = firebase.auth().currentUser;

  if (requiresAuth && !user) {
    next('/login');
  }

  if (user && !user.emailVerified) {
    const emailConfirmation = to.matched.some((page) => page.meta.emailConfirmation);
    if (!emailConfirmation) {
      next('/emailConfirmation');
    }
  }

  next();
});

export default router;
