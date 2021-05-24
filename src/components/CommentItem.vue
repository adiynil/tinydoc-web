<template>
	<div class="component">
		<div class="comment-item">
			<div>
				<div style="float: left; height: 36px">
					<el-avatar size="medium" :src="avatar" fit="fill"></el-avatar>
				</div>
				<div style="height: 36px; margin-left: 45px">
					<div style="color: #606266">{{ name }}</div>
					<div>
						<el-link v-if="site" :href="site" target="_blank">
							<i>{{ site }}</i>
						</el-link>
						<el-link v-else :href="defaultSite" target="_blank">{{ defaultSite }}</el-link>
					</div>
				</div>
			</div>
			<div style="margin-top: 10px; color: #303133; border-top: 1px solid #eee">
				<p style="padding: 10px 0 0 45px">
					<slot></slot>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				defaultSite: "https://fateguy.com",
			};
		},
		props: {
			avatar: {
				type: String,
			},
			name: {
				type: String,
				default: "匿名用户",
			},
			site: {
				type: String,
			},
		},
	};
</script>

<style scoped lang="scss">
	.comment-item {
		padding: 10px;
		border: 1px solid #eee;
		border-radius: 2px;
	}
</style>
