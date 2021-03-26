import Vue from "vue";
// import Cookie from "js-cookie";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/css/scrollbar.css";

Vue.config.productionTip = false;
Vue.use(ElementUI);
// Vue.prototype.$Cookie = Cookie;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
