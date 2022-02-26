import IStoreDTO from '@/dtos/IStoreDTO';
import gamesJson from '@/assets/games.json';
import mapsJson from '@/assets/maps.json';

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    game: null,
    gamesType: [],
    mapsType: [],
  } as IStoreDTO,
  mutations: {
    initialiseStore(state) {
      if (localStorage.getItem('game')) {
        state.game = localStorage.getItem('game');
      }

      if (gamesJson) {
        gamesJson.forEach((game) => {
          state.gamesType.push({
            value: game.id,
            text: game.name,
            shortText: game.shortName,
          });
        });
      }

      if (mapsJson) {
        mapsJson.forEach((map) => {
          state.mapsType.push({
            value: map.id,
            text: map.name['pt-BR'],
          });
        });
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
  getters: {
    getGameTypeShortName: (state) => (id: string) => state.gamesType
      .find((game) => game.value === id)?.shortText,

    getGameTypeName: (state) => (id: string) => state.gamesType
      .find((game) => game.value === id)?.text,

    getMapTypeName: (state) => (id: string) => state.mapsType
      .find((map) => map.value === id)?.text,
  },
});
