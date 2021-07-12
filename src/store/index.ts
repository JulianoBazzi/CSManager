import IStoreDTO from '@/dtos/IStoreDTO';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    game: null,
  } as IStoreDTO,
  mutations: {
    initialiseStore(state) {
      if (localStorage.getItem('game')) {
        state.game = localStorage.getItem('game');
      }
    },
    setUser(state, user) {
      state.user = user;
    },
    setGame(state, game) {
      if (game === 'null' || game === null) {
        localStorage.removeItem('game');
      } else {
        localStorage.setItem('game', game);
      }
      state.game = game;
    },
  },
  actions: {
  },
  modules: {
  },
});
