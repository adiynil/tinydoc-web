const rules = [
	{
		path: "/",
		component: () => import("@/views/home/index.vue"),
		meta: {
			title: "首页 · TinyDoc",
		},
	},
	{
		path: "/login",
		component: () => import("@/views/home/login.vue"),
		meta: {
			title: "登录 · TinyDoc",
		},
	},
	{
		path: "/forget",
		component: () => import("@/views/home/forget.vue"),
		meta: {
			title: "找回密码 · TinyDoc",
		},
	},
	{
		path: "/emailvalid",
		component: () => import("@/views/home/validemail.vue"),
		meta: {
			title: "验证邮箱 · TinyDoc",
		},
	},
	{
		path: "/register",
		component: () => import("@/views/home/register.vue"),
		meta: {
			title: "注册 · TinyDoc",
		},
	},
	{
		path: "/explore",
		component: () => import("@/views/home/explore.vue"),
		meta: {
			title: "发现 · TinyDoc",
		},
	},
	{
		path: "/feedback",
		component: () => import("@/views/home/feedback.vue"),
		meta: {
			title: "Feedback · TinyDoc",
		},
	},
	{
		path: "/submit/:code",
		component: () => import("@/views/home/submit.vue"),
	},
	{
		path: "/book",
		component: () => import("@/views/home/books.vue"),
		meta: {
			title: "知识库 · TinyDoc",
		},
	},
	{
		path: "/book/:account/:identity",
		component: () => import("@/views/home/doc.vue"),
	},
	{
		path: "/book/:account/:identity/:id",
		component: () => import("@/views/home/view.vue"),
	},
	{
		path: "/dashboard",
		component: () => import("@/views/dashboard/index.vue"),
		meta: {
			title: "控制台 · TinyDoc",
			auth: true,
		},
	},
	{
		path: "/dashboard/profile",
		component: () => import("@/views/dashboard/profile.vue"),
		meta: {
			title: "个人资料 · TinyDoc",
			auth: true,
		},
	},
	{
		path: "/dashboard/comments",
		component: () => import("@/views/dashboard/comment.vue"),
		meta: {
			title: "评论消息 · TinyDoc",
			auth: true,
		},
	},
	{
		path: "/dashboard/downloads",
		component: () => import("@/views/dashboard/download.vue"),
		meta: {
			title: "下载记录 · TinyDoc",
			auth: true,
		},
	},
	{
		path: "/dashboard/books",
		component: () => import("@/views/dashboard/books/list.vue"),
		meta: {
			title: "知识库 · TinyDoc",
			auth: true,
		},
	},
	{
		path: "/dashboard/books/:account/:identity",
		component: () => import("@/views/dashboard/books/docs.vue"),
		meta: {
			auth: true,
		},
	},
	{
		path: "/dashboard/edit/books/:account/:identity/:id",
		meta: {
			auth: true,
		},
		component: () => import("@/views/dashboard/books/edit.vue"),
	},
	{
		path: "/dashboard/new/books/:account/:identity",
		meta: {
			auth: true,
		},
		component: () => import("@/views/dashboard/books/new.vue"),
	},
	{
		path: "/dashboard/collections",
		component: () => import("@/views/dashboard/collection/list.vue"),
		meta: {
			title: "采集任务 · TinyDoc",
			auth: true,
		},
	},
	{
		path: "/dashboard/collections/:code",
		component: () => import("@/views/dashboard/collection/detail.vue"),
		meta: {
			auth: true,
		},
	},
	{
		path: "/dashboard/documents",
		component: () => import("@/views/dashboard/document.vue"),
		meta: {
			title: "我的文档 · TinyDoc",
			auth: true,
		},
	},
	{
		path: "/dashboard/settingS",
		component: () => import("@/views/dashboard/setting.vue"),
		meta: {
			title: "基本配置 · TinyDoc",
			auth: true,
		},
	},
	{
		path: "/dashboard/users",
		component: () => import("@/views/dashboard/user.vue"),
		meta: {
			title: "用户管理 · TinyDoc",
			auth: true,
		},
	},
	{
		path: "/error",
		component: () => import("@/views/home/404.vue"),
		meta: {
			title: "404 · TinyDoc",
		},
	},
	{
		path: "*",
		redirect: "/error",
	},
];

export default rules;
