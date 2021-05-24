module.exports = {
	// 部署路径  / => http://my-app.com/  /myapp => http://my-app.com/myapp
	publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
	// 生成的生产环境构建文件的目录
	outputDir: "dist",
	// 放置生成的静态资源 (js、css、img、fonts) 的目录 (相对于 outputDir)
	assetsDir: "static",
	// 指定生成的 index.html 的输出路径 (相对于 outputDir)
	indexPath: "index.html",
	// 是否在生成的静态资源文件名中包含 hash 以便更好的控制缓存
	filenameHashing: true,
	// 是否使用包含运行时编译器的 Vue 构建版本
	runtimeCompiler: false,
	// 是否生成source map
	productionSourceMap: false,
	// css
	css: {
		sourceMap: false,
	},
	// 开发环境
	devServer: {
		// host: "localhost",
		// port: "8080",
		// 将任何未知请求 (没有匹配到静态文件的请求) 代理到目标主机
		// proxy: "http://localhost:5000",
		//
		// or
		//
		// proxy: {
		//   "/api": {
		//     target: "http://localhost:5000",
		//     changeOrigin: true,
		//     ws: true,
		//     pathRewrite: {
		//       "^/api": "",
		//     },
		//   },
		// },
	},
};
