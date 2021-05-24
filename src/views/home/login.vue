<template>
	<div class="page">
		<div class="form-box">
			<el-card shadow="hover">
				<div class="logo">
					<a href="/" title="TinyDoc">TinyDoc</a>
				</div>
				<el-form ref="loginForm" :rules="rules" :model="form">
					<el-form-item prop="account">
						<el-input v-model="form.account" placeholder="账号/邮箱"></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input v-model="form.password" placeholder="密码" type="password"></el-input>
					</el-form-item>
					<el-form-item>
						<el-checkbox v-model="form.keepLogin">保持登录</el-checkbox>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSubmit('loginForm')" class="block">立即登录</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="text" style="float: left" @click="goForget">忘记密码</el-button>
						<el-button type="text" style="float: right" @click="goRegister">立即注册</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</div>
	</div>
</template>

<script>
	import { login } from "../../api/rules/user";
	import { mapMutations, mapState } from "vuex";
	export default {
		components: {},
		data() {
			return {
				form: {
					account: null,
					email: null,
					password: null,
					keepLogin: false,
					type: "",
				},
				rules: {
					account: [{ required: true, message: "账号/邮箱不能为空", trigger: "blur" }],
					password: [{ required: true, message: "密码不能为空", trigger: "blur" }],
				},
			};
		},
		methods: {
			onSubmit(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						if (this.form.account.indexOf("@") != -1) {
							this.form.email = this.form.account;
							this.form.type = "email";
						}
						login(this.form)
							.then(res => {
								let payload = {
									token: res.data.token,
									keep: this.form.keepLogin,
								};
								this.setToken(payload);
								this.$message({
									type: "success",
									message: "登陆成功，正在跳转...",
								});
								setTimeout(() => {
									location.href = "/dashboard";
								}, 1000);
							})
							.catch(err => {
								if (err.status == 500)
									return this.$message({
										type: "error",
										message: "服务器出错！",
									});
								for (let key in err.data) {
									setTimeout(() => {
										this.$message(err.data[key]);
									}, 500);
								}
								this.form.type = "";
							});
					} else {
						return false;
					}
				});
			},
			goRegister() {
				this.$router.push("/register");
			},
			goForget() {
				this.$router.push("/forget");
			},
			init() {
				if (this.isLogin) {
					this.$router.push("/dashboard");
				}
			},
			...mapMutations(["setToken"]),
		},
		computed: mapState(["isLogin"]),
		mounted() {
			this.init();
		},
	};
</script>

<style scoped lang="scss">
	@import "@/assets/css/global.scss";
	.page {
		background-color: #fafafa;
		width: 100%;
		height: 100%;
		.form-box {
			margin: 0 auto;
			padding-top: 130px;
			width: 400px;
			.el-card {
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
			}
		}
	}
</style>
