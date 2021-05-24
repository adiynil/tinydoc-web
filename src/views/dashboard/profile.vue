<template>
	<layout :active="'/dashboard/profile'">
		<el-row class="container">
			<el-tabs v-model="activeTab">
				<el-tab-pane label="基本资料" name="base"></el-tab-pane>
				<el-tab-pane label="账号管理" name="account"></el-tab-pane>
				<el-tab-pane label="选项" name="option"></el-tab-pane>
				<!-- <el-tab-pane label="头像管理" name="account"></el-tab-pane> -->
			</el-tabs>
			<el-card v-if="activeTab == 'base'" shadow="never">
				<div class="main">
					<el-row :gutter="10">
						<el-col :span="8">
							<div class="avatar">
								<el-avatar shape="square" :size="200" :src="current.avatar"></el-avatar>

								<p>
									你的头像是由<a target="_blank" href="http://en.gravatar.com/">Gravatar</a>自动生成的，如果要修改请前往<a
										target="_blank"
										href="http://en.gravatar.com/"
										>Gravatar官网</a
									>，你不知道<a target="_blank" href="http://en.gravatar.com/support/what-is-gravatar/">什么是Gravatar？</a>
								</p>
							</div>
						</el-col>
						<el-col :span="16">
							<div class="form">
								<el-form ref="form" :model="form">
									<el-form-item label="真实名字">
										<el-input v-model="form.name"></el-input>
									</el-form-item>
									<el-form-item label="网站">
										<el-input v-model="form.site"></el-input>
									</el-form-item>
									<el-form-item label="个人介绍">
										<el-input type="textarea" v-model="form.description"></el-input>
									</el-form-item>
									<el-form-item>
										<el-button type="primary" @click="onSubmit">保存修改</el-button>
									</el-form-item>
								</el-form>
							</div>
						</el-col>
					</el-row>
				</div>
			</el-card>
			<el-card v-if="activeTab == 'account'" shadow="never">
				<div>
					<el-form :model="form">
						<el-form-item label="账号">
							<el-input v-model="form.account" disabled></el-input>
						</el-form-item>
						<el-form-item label="邮箱">
							<span class="valid" v-if="current.option.is_email_active">已验证</span>
							<span class="invalid" v-if="!current.option.is_email_active">未验证</span>
							<el-input v-model="form.email">
								<el-button v-if="!current.option.is_email_active" slot="append" @click="reValid">重新验证</el-button>
							</el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="openDialog(false)">修改邮箱</el-button>
							<el-button type="danger" @click="openDialog(true)">修改密码</el-button>
						</el-form-item>
					</el-form>
				</div>
				<div style="margin-top: 40px; font-size: 14px;color: #909399">
					<p>上次登录：{{ format(current.last_login) }}</p>
					<p>注册时间：{{ format(current.create_at) }}</p>
				</div>
			</el-card>
			<el-card v-if="activeTab == 'option'" shadow="never">
				<el-form>
					<el-form-item label="是否公开邮箱">
						<el-switch v-model="form.option.is_public_email"></el-switch>
					</el-form-item>
					<el-form-item label="是否公开名字">
						<el-switch v-model="form.option.is_name_public"></el-switch>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="default" @click="saveOption">保存修改</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</el-row>
		<div name="dialogs">
			<el-dialog :visible.sync="showDialog" width="40%">
				<el-form v-if="isChangePass" :model="changeForm" ref="passform" :rules="rules1">
					<el-form-item prop="password">
						<el-input placeholder="请输入原密码" type="password" v-model="changeForm.password"></el-input>
					</el-form-item>
					<el-form-item prop="newPass">
						<el-input placeholder="请输入新密码" type="password" v-model="changeForm.newPass"></el-input>
					</el-form-item>
					<el-form-item prop="checkPass">
						<el-input placeholder="请输入确认密码" type="password" v-model="changeForm.checkPass"></el-input>
					</el-form-item>
				</el-form>
				<el-form v-if="!isChangePass" :model="changeForm" ref="emailform" :rules="rules2">
					<el-form-item prop="email">
						<el-input placeholder="请输入新邮箱" v-model="changeForm.email"></el-input>
					</el-form-item>
				</el-form>

				<span slot="footer">
					<el-button size="small" @click="showDialog = false">取消</el-button>
					<el-button size="small" v-if="isChangePass" type="primary" @click="changePass">确定修改</el-button>
					<el-button size="small" v-else type="primary" @click="changeEmail">确定修改</el-button>
				</span>
			</el-dialog>
		</div>
	</layout>
</template>

<script>
	import layout from "@/views/dashboard/layout";
	import { mapState } from "vuex";
	import user from "@/api/rules/user";
	import { formatDate } from "@/assets/js/utils";
	export default {
		components: {
			layout,
		},
		data() {
			const validatePassword = (rule, value, callback) => {
				if (!value) {
					callback(new Error("请输入密码"));
				} else {
					if (this.changeForm.checkPass !== "") {
						this.$refs.passform.validateField("checkPass");
					}
					callback();
				}
			};
			const validateCheckPass = (rule, value, callback) => {
				if (!value) {
					callback(new Error("请再次输入密码"));
				} else {
					if (this.changeForm.newPass != value) callback(new Error("两次输入密码不一致"));
					else callback();
				}
			};
			return {
				ableToReValid: true,
				showDialog: false,
				isChangePass: false,
				activeTab: "base",
				form: {
					account: "",
					email: "",
					name: "",
					site: "",
					description: "",
					option: {},
				},
				changeForm: {
					account: "",
					email: "",
					password: "",
					newPass: "",
					checkPass: "",
				},
				rules1: {
					password: [{ required: true, message: "请输入原密码", trgger: "blur" }],
					newPass: [
						{ validator: validatePassword, trigger: "blur" },
						{ min: 6, max: 18, message: "密码长度为6-18位", trigger: "blur" },
					],
					checkPass: [
						{ validator: validateCheckPass, trigger: "blur" },
						{ min: 6, max: 18, message: "密码长度为6-18位", trigger: "blur" },
					],
				},
				rules2: {
					email: [{ required: true, type: "email", message: "请输入有效邮箱", trgger: "blur" }],
				},
			};
		},
		computed: {
			...mapState(["current", "isLogin"]),
		},
		methods: {
			format(time) {
				return formatDate(time);
			},
			reValid() {
				if (!this.ableToReValid)
					return this.$message({
						type: "warning",
						message: "请求频繁，请稍后再进行操作",
					});
				this.ableToReValid = false;
				setTimeout(() => {
					this.ableToReValid = true;
				}, 1000 * 60);
				let { account } = this.form;
				let data = { account };
				user
					.reValidEmail(data)
					.then(() => {
						this.$message({ type: "success", message: "验证邮件重新发送成功" });
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
			async openDialog(flag) {
				this.showDialog = true;
				this.isChangePass = flag;
				await this.$nextTick(() => {
					if (flag) this.$refs.passform.resetFields();
					else this.$refs.emailform.resetFields();
				});
			},
			changeEmail() {
				let { account, email } = this.changeForm;
				let data = { account, email };
				this.$refs.emailform.validate(valid => {
					if (valid) {
						user
							.changeEmail(data)
							.then(() => {
								this.$message({
									type: "success",
									message: "修改成功，请重新验证你的邮箱",
								});
								this.form.email = email;
								this.showDialog = false;
							})
							.catch(err => {
								let { message } = err.data;
								message = message ? message : "未知错误";
								if (err.status == 500)
									this.$message({
										type: "error",
										message: "服务器出错，请稍后再试",
									});
								else this.$message(message);
							});
					} else {
						return false;
					}
				});
			},
			changePass() {
				let { account, password, newPass } = this.changeForm;
				let data = { account, password, newPass };
				this.$refs.passform.validate(valid => {
					if (valid) {
						user
							.changePass(data)
							.then(() => {
								this.$message({
									type: "success",
									message: "修改成功",
								});
								this.showDialog = false;
							})
							.catch(err => {
								let { message } = err.data;
								message = message ? message : "未知错误";
								if (err.status == 500)
									this.$message({
										type: "error",
										message: "服务器出错，请稍后再试",
									});
								else this.$message(message);
							});
					} else {
						return false;
					}
				});
			},
			saveOption() {
				let { account, option } = this.form;
				delete option.is_email_active;
				let data = { account, option };
				user
					.update(data)
					.then(() => {
						this.init();
						this.$message({
							type: "success",
							message: "修改成功",
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
			onSubmit() {
				let { account, name, site, description } = this.form;
				let data = { account, site, name, description };
				user
					.update(data)
					.then(() => {
						this.init();
						this.$message({
							type: "success",
							message: "修改成功",
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
			init() {
				// this.form.account = this.current.account;
				// this.changeForm.account = this.current.account;
				// this.form.email = this.current.email;
				// this.form.name = this.current.name;
				// this.form.site = this.current.site;
				// this.form.description = this.current.description;
				// this.form.option = this.current.option;
				user.current().then(res => {
					let { account, email, name, site, description, option } = res.data;
					this.form.account = account;
					this.changeForm.account = account;
					this.form.email = email;
					this.form.name = name;
					this.form.site = site;
					this.form.description = description;
					this.form.option = option;
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
			.avatar {
				text-align: center;
				& > p {
					margin-top: 5px;
					color: $lighter-text-color;
					font-size: 14px;
					a {
						color: #66b1ff;
						text-decoration: none;
					}
				}
			}
		}
		.valid {
			font-size: 14px;
			color: green;
		}
		.invalid {
			font-size: 14px;
			color: red;
			span {
				color: $lighter-text-color;
				margin-left: 10px;
			}
		}
	}
</style>
