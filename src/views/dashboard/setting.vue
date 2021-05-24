<template>
	<layout :active="'/dashboard/settings'">
		<el-row class="container">
			<el-tabs v-model="activeTab">
				<el-tab-pane label="首页知识库" name="home"></el-tab-pane>
				<el-tab-pane label="推荐用户" name="user"></el-tab-pane>
				<el-tab-pane label="推荐知识库" name="explore"></el-tab-pane>
			</el-tabs>
			<el-card v-if="activeTab == 'home'" shadow="never">
				<div>
					<p style="">首页推荐知识库</p>
					<p style="color:#909399;font-size:14px;margin:5px 0 10px">格式为“account@identity”，以英文逗号相隔</p>
					<p style="margin-bottom:10px">
						<el-input type="textarea" :rows="5" v-model="home"></el-input>
					</p>
					<p>
						<el-button type="primary" @click="onSubmit('home')">保存</el-button>
					</p>
				</div>
			</el-card>
			<el-card v-if="activeTab == 'user'" shadow="never">
				<div>
					<p style="">发现页推荐用户</p>
					<p style="color:#909399;font-size:14px;margin:5px 0 10px">格式为“account”，以英文逗号相隔</p>
					<p style="margin-bottom:10px">
						<el-input type="textarea" :rows="5" v-model="user"></el-input>
					</p>
					<p>
						<el-button type="primary" @click="onSubmit('user')">保存</el-button>
					</p>
				</div>
			</el-card>
			<el-card v-if="activeTab == 'explore'" shadow="never">
				<div>
					<p style="">发现页推荐知识库</p>
					<p style="color:#909399;font-size:14px;margin:5px 0 10px">格式为“account@identity”，以英文逗号相隔</p>
					<p style="margin-bottom:10px">
						<el-input type="textarea" :rows="5" v-model="explore"></el-input>
					</p>
					<p>
						<el-button type="primary" @click="onSubmit('explore')">保存</el-button>
					</p>
				</div>
			</el-card>
		</el-row>
	</layout>
</template>

<script>
	import layout from "@/views/dashboard/layout";
	import { mapState } from "vuex";
	// import { formatDate } from "@/assets/js/utils";
	// eslint-disable-next-line no-unused-vars
	import { option } from "@/api";
	export default {
		components: {
			layout,
		},
		data() {
			return {
				activeTab: "home",
				user: "",
				explore: "",
				home: "",
			};
		},
		computed: {
			...mapState(["current"]),
		},
		methods: {
			onSubmit(target) {
				let value = this[target].split(",");
				let key = target;
				let data = { key, value };
				option
					.update(data)
					.then(() => {
						this.$message({ type: "success", message: "保存成功" });
					})
					.catch(err => console.log(err));
			},
			init() {
				option.get().then(res => {
					let home = res.data.find(e => e.key == "home").value;
					let user = res.data.find(e => e.key == "user").value;
					let explore = res.data.find(e => e.key == "explore").value;
					this.home = home.join(",");
					this.user = user.join(",");
					this.explore = explore.join(",");
				});
			},
		},
		mounted() {
			this.init();
		},
	};
</script>

<style scoped lang="scss">
	.el-tag + .el-tag {
		margin-left: 10px;
	}
	.button-new-tag {
		margin-left: 10px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}
	.input-new-tag {
		width: 90px;
		margin-left: 10px;
		vertical-align: bottom;
	}
</style>
