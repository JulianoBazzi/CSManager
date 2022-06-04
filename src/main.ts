import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import VueSweetalert2 from 'vue-sweetalert2';
import VueMeta from 'vue-meta';
import router from '@/router';
import store from '@/store';
import AppError from '@/errors/AppError';
import App from '@/App.vue';
import 'sweetalert2/dist/sweetalert2.min.css';
import supabase from '@/services/supabase';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueSweetalert2);
Vue.use(VueMeta);

Vue.config.productionTip = false;

Vue.config.errorHandler = (err: Error, vm: Vue, info: string) => {
  if (err instanceof AppError) {
    vm.$bvToast.toast(err.message, {
      title: err.title,
      variant: err.variant,
      solid: true,
    });
    return;
  }

  vm.$bvToast.toast(`${info}: ${err.message}`, {
    title: 'Ocorreu um erro',
    variant: 'danger',
    solid: true,
  });
};

const app = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

const user = supabase.auth.user();

if (user) {
  app.$store.commit('setUser', user);
  app.$store.commit('initialiseStore');
}
