import Cookie from "js-cookie";
import { SESSION, EXPIRES } from "../../config/base";

export default {
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
};