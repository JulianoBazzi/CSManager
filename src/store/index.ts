import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    game: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setGame(state, game) {
      state.game = game;
    },
  },
  actions: {
  },
  modules: {
  },
});
