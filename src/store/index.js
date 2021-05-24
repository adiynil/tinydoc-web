import Vue from "vue";
import Vuex from "vuex";
import Cookie from "js-cookie";

import { SESSION, EXPIRES } from "../../config/base";
// import mutations from "./mutations";
import { current } from "../api/rules/user";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: "",
    isLogin: false,
    current: {},
  },
  mutations: {
    setToken(state, payload) {
      if (payload && payload.token) {
        state.token = payload.token;
        let option = {};
        if (payload.keep) option.expires = EXPIRES;
        Cookie.set(SESSION, payload.token, option);
      } else {
        state.token = Cookie.get(SESSION);
      }
    },
    setCurrent(state, payload) {
      if (payload) {
        state.isLogin = true;
        state.current = payload;
      }
    },
    clearCookie(state) {
      state.isLogin = false;
      state.current = null;
      Cookie.remove(SESSION);
    },
  },
  getters: {
    token: (state) => {
      let token = state.token || Cookie.get(SESSION);
      return token;
    },
  },
  actions: {
    init({ state, commit }) {
      commit("setToken");
      if (state.token) {
        current()
          .then((res) => {
            commit("setCurrent", res.data);
          })
          .catch(() => {
            commit("clearCookie");
          });
      }
    },
  },
  modules: {},
});
