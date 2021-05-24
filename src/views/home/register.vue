<template>
	<div class="page">
		<div class="form-box">
			<el-card shadow="hover">
				<div class="logo">
					<a href="/">TinyDoc</a>
				</div>
				<el-form ref="registerForm" :rules="rules" :model="form">
					<el-form-item prop="email">
						<el-input v-model="form.email" placeholder="输入邮箱"></el-input>
					</el-form-item>
					<el-form-item prop="account">
						<el-input v-model="form.account" placeholder="输入账号"></el-input>
					</el-form-item>
					<el-form-item prop="password"> <el-input v-model="form.password" placeholder="输入密码" type="password"></el-input> </el-form-item
					><el-form-item prop="checkPass">
						<el-input v-model="form.checkPass" placeholder="确认密码" type="password"></el-input>
					</el-form-item>
					<el-form-item>
						<el-checkbox v-model="form.autoLogin">注册成功直接登录</el-checkbox>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSubmit('registerForm')" class="block">立即创建</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="text" style="float: left" @click="goForget">忘记密码</el-button>
						<el-button type="text" style="float: right" @click="goLogin">马上登录</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</div>
	</div>
</template>

<script>
	import { user } from "../../api";
	import { mapMutations, mapState } from "vuex";
	export default {
		components: {},
		data() {
			var validateAccount = (rule, value, callback) => {
				if (!value) {
					return callback(new Error("账号不能为空"));
				} else if (
					["admin", "user", "email", "super", "normal", "list", "account", "password", "insert", "update", "login", "register"].includes(value)
				) {
					return callback(new Error("账号不被允许"));
				} else {
					callback();
				}
			};
			var validatePassword = (rule, value, callback) => {
				if (!value) {
					callback(new Error("请输入密码"));
				} else {
					if (this.form.checkPass !== "") {
						this.$refs.registerForm.validateField("checkPass");
					}
					callback();
				}
			};
			var validateCheckPass = (rule, value, callback) => {
				if (!value) {
					callback(new Error("请再次输入密码"));
				} else {
					if (this.form.password != value) callback(new Error("两次输入密码不一致"));
					else callback();
				}
			};
			return {
				form: {
					email: null,
					account: null,
					password: null,
					checkPass: null,
					autoLogin: false,
				},
				rules: {
					email: [{ required: true, type: "email", message: "请输入有效邮箱", trigger: "blur" }],
					account: [
						{ validator: validateAccount, trigger: "blur" },
						{ type: "string", pattern: /^[a-zA-Z][a-zA-Z0-9-_]{4,15}$/g, message: "账号须以字母开头，5-16位长度，支持字母数字组合", trigger: "blur" },
					],
					password: [
						{ validator: validatePassword, trigger: "blur" },
						{ min: 6, max: 18, message: "密码长度为6-18位", trigger: "blur" },
					],
					checkPass: [
						{ validator: validateCheckPass, trigger: "blur" },
						{ min: 6, max: 18, message: "密码长度为6-18位", trigger: "blur" },
					],
				},
			};
		},
		methods: {
			onSubmit(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						user
							.register(this.form)
							.then(() => {
								if (this.form.autoLogin) {
									this.$message({
										type: "success",
										message: "注册成功，正在登陆...",
									});
									user.login(this.form).then(res => {
										let payload = {
											token: res.data.token,
										};
										this.setToken(payload);
										location.href = "/dashboard";
									});
								} else {
									this.$message({
										type: "success",
										message: "注册成功!",
									});
									location.href = "/login";
								}
							})
							.catch(err => {
								for (let key in err.data) {
									setTimeout(() => {
										this.$message(err.data[key]);
									}, 500);
								}
							});
					} else {
						return false;
					}
				});
			},
			goLogin() {
				this.$router.push("/login");
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
		computed: {
			...mapState(["isLogin"]),
		},
		// watch: {
		//   $route: "init",
		// },
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
			padding-top: 60px;
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
