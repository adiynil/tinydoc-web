/* eslint-disable no-unused-vars */
import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import { current } from "@/api/rules/user";

import rules from "./rules";

Vue.use(VueRouter);

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes: rules,
});

router.beforeEach((to, from, next) => {
	if (to.meta.title) {
		document.title = to.meta.title;
	}
	to.query.from = from.fullPath;
	// next();
	// 权限认证 vuex 或者 localStorage
	if (!to.meta.auth) return next();
	if (!store.getters.token) return next("/login");
	current()
		.then(() => next())
		.catch(() => next("/login"));
});

// 路由取消或者重复报错处理
const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
	if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
	return originalPush.call(this, location).catch(err => err);
};
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
	if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject);
	return originalReplace.call(this, location).catch(err => err);
};

export default router;
