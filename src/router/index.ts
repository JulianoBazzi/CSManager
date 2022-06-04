import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import supabase from '@/services/supabase';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Maps from '../views/Maps.vue';
import Players from '../views/Players.vue';
import Sweepstake from '../views/Sweepstake.vue';
import Sweepstakes from '../views/Sweepstakes.vue';
import SweepstakeNew from '../views/SweepstakeNew.vue';
import Login from '../views/Login.vue';
import EmailConfirmation from '../views/EmailConfirmation.vue';
import ChangePassword from '../views/ChangePassword.vue';
import ForgotMyPassword from '../views/ForgotMyPassword.vue';
import Profile from '../views/Profile.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Início',
    component: Home,
  },
  {
    path: '/players',
    name: 'Players',
    component: Players,
    meta: {
      title: 'Jogadores',
      requiresAuth: true,
    },
  },
  {
    path: '/maps',
    name: 'Maps',
    component: Maps,
    meta: {
      title: 'Mapas',
      requiresAuth: true,
    },
  },
  {
    path: '/sweepstakes/new',
    name: 'NewSweepstake',
    component: SweepstakeNew,
    meta: {
      title: 'Novo Sorteio',
      requiresAuth: true,
    },
  },
  {
    path: '/sweepstakes/:id',
    name: 'Sweepstake',
    component: Sweepstake,
    props: true,
    meta: {
      title: 'Sorteio',
    },
  },
  {
    path: '/sweepstakes',
    name: 'Sweepstakes',
    component: Sweepstakes,
    meta: {
      title: 'Sorteios',
      requiresAuth: true,
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: 'Meu Perfil',
      requiresAuth: true,
    },
  },
  {
    path: '/changePassword',
    name: 'ChangePassword',
    component: ChangePassword,
    meta: {
      title: 'Alterar Senha',
      requiresAuth: true,
    },
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: 'Sobre',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Login',
    },
  },
  {
    path: '/emailConfirmation',
    name: 'EmailConfirmation',
    component: EmailConfirmation,
    meta: {
      title: 'Confirmação de E-mail',
      emailConfirmation: true,
    },
  },
  {
    path: '/forgotMyPassword',
    name: 'ForgotMyPassword',
    component: ForgotMyPassword,
    meta: {
      title: 'Esqueci Minha Senha',
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  let documentTitle = to.path === '/' || !to.meta?.title ? `${process.env.VUE_APP_TITLE}` : `${to.meta?.title} - ${process.env.VUE_APP_TITLE}`;
  if (to.params.title) {
    documentTitle = `${to.params.title} - ${documentTitle}`;
  }
  document.title = documentTitle;

  const requiresAuth = to.matched.some((page) => page.meta.requiresAuth);
  const user = supabase.auth.user();

  if (requiresAuth && !user) {
    next('/login');
  }

  if (user && !user.email_confirmed_at) {
    const emailConfirmation = to.matched.some((page) => page.meta.emailConfirmation);
    if (!emailConfirmation) {
      next('/emailConfirmation');
    }
  }

  next();
});

export default router;
