<template>
	<div class="page">
		<div class="container">
			<div class="main">
				<div>
					<h1 v-if="validing"><i style="margin-right:10px" class="el-icon-loading"></i>邮箱验证中...</h1>
					<div v-else>
						<h1 v-if="ifSuccess"><i style="margin-right:10px" class="el-icon-loading"></i>验证成功，跳转中...</h1>
						<h1 v-else>{{ errMessage }}</h1>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { validEmail } from "@/api/rules/user";
	import { mapMutations } from "vuex";
	export default {
		name: "",
		components: {},
		data() {
			return {
				validing: true,
				ifSuccess: true,
				errMessage: "",
			};
		},
		methods: {
			...mapMutations(["clearCookie"]),
			goBack() {
				window.history.back(-1);
			},
			goHome() {
				this.$router.push("/");
			},
			init() {
				let { token } = this.$route.query;
				console.log(token);
				validEmail({ token })
					.then(() => {
						this.ifSuccess = true;
						setTimeout(() => {
							this.validing = false;
						}, 1000);
						setTimeout(() => {
							this.clearCookie();
							this.$router.push("/login");
						}, 1000);
					})
					.catch(err => {
						this.ifSuccess = false;
						if (err.status == 500) {
							this.errMessage = "服务器出错，请稍后再试";
						} else {
							this.errMessage = "验证失败，" + err.data.message;
						}
						setTimeout(() => {
							this.validing = false;
						}, 1000);
					});
			},
		},
		mounted() {
			this.init();
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
				height: 40px;
			}
		}
	}
</style>
