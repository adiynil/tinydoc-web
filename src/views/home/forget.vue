<template>
	<div class="page">
		<div class="container">
			<div class="main">
				<div>
					<h1>找回密码</h1>
					<p>请输入注册时候的账号或者绑定的邮箱</p>
					<p>
						<el-input v-model="accountOrEmail" placeholder="账号或者邮箱" size="normal" clearable></el-input>
					</p>
					<p>
						<el-button type="primary" size="default" @click="onSubmit">确认找回</el-button>
					</p>
					<div class="setting">
						<el-button type="text" style="float: left" @click="goBack">返回上一页</el-button>
						<el-button type="text" style="float: right" @click="goHome">返回首页</el-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import User from "@/api/rules/user";
	export default {
		data() {
			return {
				accountOrEmail: "",
			};
		},
		methods: {
			goBack() {
				window.history.back(-1);
			},
			goHome() {
				this.$router.push("/");
			},
			onSubmit() {
				let value = this.accountOrEmail;
				let data = {
					type: "",
					account: "",
					email: "",
				};
				if (value.indexOf("@") != -1) {
					data.type = "email";
					data.email = value;
				} else {
					data.account = value;
				}
				User.forgetPass(data)
					.then(() => {
						this.$message({
							type: "success",
							message: "重置密码邮件已经发送成功，请前往你的邮箱查收",
						});
					})
					.catch(err => {
						if (err.status == 500)
							return this.$message({
								type: "error",
								message: "服务器出错",
							});
						for (let key in err.data) {
							setTimeout(() => {
								this.$message(err.data[key]);
							}, 500);
						}
					});
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
				height: 40px;
			}
		}
	}
</style>
