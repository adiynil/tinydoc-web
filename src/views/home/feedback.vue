<template>
	<div class="page">
		<div class="container">
			<div class="sidebar">
				<div class="logo">
					<a href="#">TinyDoc</a>
				</div>
				<div class="search">
					<el-input
						class="search-text"
						v-model="inputText"
						@keyup.enter.native="search"
						placeholder="输入关键字并回车..."
						prefix-icon="el-icon-search"
					></el-input>
				</div>
				<el-menu default-active="/feedback" background-color="#545c64" text-color="#fff" active-text-color="#67c23a" router>
					<el-menu-item index="/">
						<i class="el-icon-s-home"></i>
						<span slot="title">首页</span>
					</el-menu-item>
					<el-menu-item index="/explore">
						<i class="el-icon-s-opportunity"></i>
						<span slot="title">发现</span>
					</el-menu-item>
					<el-menu-item index="/book">
						<i class="el-icon-notebook-2"></i>
						<span slot="title">知识库</span>
					</el-menu-item>
					<el-menu-item index="/feedback">
						<i class="el-icon-s-promotion"></i>
						<span slot="title">Feedback</span>
					</el-menu-item>
				</el-menu>
			</div>
			<div class="main">
				<el-row :gutter="20">
					<el-col :span="16">
						<el-form :model="form" ref="form" :rules="rules">
							<el-form-item label="名字" prop="name">
								<el-input placeholder="请输入你的名字" v-model="form.name"></el-input>
							</el-form-item>
							<el-form-item label="邮箱" prop="email">
								<el-input placeholder="请输入你的联系邮箱" v-model="form.email"></el-input>
							</el-form-item>
							<el-form-item label="电话" prop="phone">
								<el-input placeholder="请输入你的联系电话" v-model="form.phone"></el-input>
							</el-form-item>
							<el-form-item label="内容" prop="content">
								<el-input placeholder="请输入你的内容" type="textarea" :rows="12" v-model="form.content"></el-input>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="send">立即提交</el-button>
							</el-form-item>
						</el-form>
					</el-col>
					<el-col :span="8">
						<p style="color: #8f9399; padding: 310px 0 0; font-size: 14px">
							留下你的宝贵意见，你的所有信息将不会被暴露。
						</p>
					</el-col>
				</el-row>
			</div>
		</div>
	</div>
</template>

<script>
	import feedback from "@/api/rules/feedback";
	export default {
		data() {
			return {
				inputText: "",
				form: {
					name: "",
					email: "",
					phone: "",
					content: "",
				},
				rules: {
					name: [{ required: true }],
					email: [{ type: "email" }],
					content: [{ required: true }],
				},
			};
		},
		computed: {},
		methods: {
			search() {
				this.$router.push(`/book?s=${this.inputText}`);
			},
			send() {
				this.$refs.form.validate(valid => {
					if (!valid) return false;
					feedback.send(this.form).then(() => {
						this.$message({ type: "success", message: "发送成功，感谢你的反馈" });
					});
				});
			},
		},
		mounted() {},
	};
</script>

<style scoped lang="scss">
	@import "@/assets/css/home.scss";
	.el-form-item {
		margin-bottom: 10px;
	}
</style>
