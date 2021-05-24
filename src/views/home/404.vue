<template>
	<div class="page">
		<div class="container">
			<div class="main">
				<div>
					<div class="logo">
						<a href="#">TinyDoc</a>
					</div>
					<h1>404 Not Found</h1>
					<p>你请求的页面不存在！</p>
					<div class="setting">
						<div>
							<el-button type="text" @click="goBack">返回上一页</el-button>
						</div>
						<div>
							<el-button type="text" @click="goHome">返回首页</el-button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "",
		components: {},
		data() {
			return {};
		},
		methods: {
			goBack() {
				window.history.back(-1);
			},
			goHome() {
				this.$router.push("/");
			},
		},
	};
</script>

<style scoped lang="scss">
	@import "@/assets/css/global.scss";
	.container {
		.main {
			width: 400px;
			margin: 100px auto 0;
			text-align: center;
			.logo {
				padding: 20px;
				text-align: center;
				a {
					font-weight: bold;
					font-style: italic;
					color: $theme;
					font-size: 30px;
					text-decoration: none;
					transition: color 0.5s;
					&:hover {
						color: rgb(103, 194, 58, 0.8);
					}
				}
			}
			h1 {
				font-size: 24px;
				font-weight: normal;
			}
			p {
				font-size: 16px;
				color: $lighter-text-color;
				padding: 20px 0;
			}
			.setting {
				text-align: center;
			}
		}
	}
</style>
