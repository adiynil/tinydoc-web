import Vue from "vue";
import Vuex from "vuex";
import Cookie from "js-cookie";

import { SESSION } from "../../config/base";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: null,
  },
  mutations: {
    setToken(state, token) {
      if (token) {
        state.token = token;
        Cookie.set(SESSION, token);
      } else {
        state.token = Cookie.get(SESSION);
      }
    },
  },
  getters: {
    token: (state) => {
      return state.token || Cookie.get(SESSION);
    },
  },
  actions: {},
  modules: {},
});
