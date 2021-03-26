import Vue from "vue";
import VueRouter from "vue-router";
import Viewer from "../views/Viewer.vue";
import Editor from "../views/Editor.vue";
import User from "../views/User.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/view/:account/:id",
    name: "Viewer",
    component: Viewer,
  },
  {
    path: "/admin/edit/:account/:id",
    name: "Editor",
    component: Editor,
  },
  {
    path: "/user/:account",
    name: "User",
    component: User,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
