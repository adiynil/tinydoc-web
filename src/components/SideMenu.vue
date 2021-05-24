<template>
	<div class="sidebar">
		<el-card class="menu" shadow="never" body-style="padding:20px 0px">
			<div class="card-body">
				<div class="profile">
					<span class="avatar">
						<el-avatar shape="square" :size="50" class="avatar" :src="current.avatar"></el-avatar>
					</span>
					<div class="info">
						<span class="account">{{ current.account }}</span>
						<p style="margin-top:5px">
							<el-button style="padding: 4px 20px" class="btn" plain type="danger" @click="logout">退出登录</el-button>
						</p>
					</div>
				</div>
				<el-divider content-position="left" @click="menuNormalShow = !menuNormalShow">我的</el-divider>
				<ul ref="normal" v-show="menuNormalShow">
					<li :key="index" v-for="(item, index) in menu.normal">
						<router-link :class="active == item.url ? 'active' : ''" :to="item.url">
							<span style="margin-right: 5px" v-if="item.icon">
								<i :class="item.icon"></i>
							</span>
							<span>{{ item.name }}</span>
						</router-link>
					</li>
				</ul>
				<div v-if="current.role != 'normal'">
					<el-divider content-position="left" @click="menuAdminShow = !menuAdminShow">管理</el-divider>
					<ul ref="admin" v-show="menuAdminShow">
						<li :key="index" v-for="(item, index) in menu.admin">
							<router-link :class="active == item.url ? 'active' : ''" :to="item.url">
								<span style="margin-right: 5px" v-if="item.icon">
									<i :class="item.icon"></i>
								</span>
								<span>{{ item.name }}</span>
							</router-link>
						</li>
					</ul>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
	import { mapState, mapMutations } from "vuex";
	export default {
		name: "SideMenu",
		props: {
			active: String,
		},
		data() {
			return {
				menuNormalShow: true,
				menuAdminShow: true,
				menu: {
					normal: [
						{
							url: "/dashboard",
							name: "控制台",
							icon: "el-icon-set-up",
						},
						{
							url: "/dashboard/books",
							name: "我的知识库",
							icon: "el-icon-notebook-1",
						},
						{
							url: "/dashboard/documents",
							name: "我的文档",
							icon: "el-icon-document",
						},
						{
							url: "/dashboard/collections",
							name: "采集任务",
							icon: "el-icon-collection",
						},
						{
							url: "/dashboard/comments",
							name: "评论消息",
							icon: "el-icon-chat-line-square",
						},

						{
							url: "/dashboard/downloads",
							name: "下载记录",
							icon: "el-icon-download",
						},
						{
							url: "/dashboard/profile",
							name: "个人资料",
							icon: "el-icon-user",
						},
					],
					admin: [
						{
							url: "/dashboard/settings",
							name: "基本配置",
							icon: "el-icon-s-tools",
						},
						{
							url: "/dashboard/users",
							name: "用户管理",
							icon: "el-icon-s-custom",
						},
					],
				},
			};
		},
		computed: {
			...mapState(["current"]),
		},
		methods: {
			...mapMutations(["clearCookie"]),
			logout() {
				this.clearCookie();
				location.href = "/login";
			},
			showNormal() {},
		},
	};
</script>

<style scoped lang="scss">
	@import "@/assets/css/global.scss";
	.sidebar {
		.menu {
			.card-body {
				.profile {
					padding: 0 15px;
					.avatar {
						float: left;
					}
					.info {
						padding-left: 60px;
						.account {
							font-size: 18px;
							font-weight: bold;
							color: #606266;
							transition: color linear 0.2s;
							&:hover {
								color: #303133;
							}
						}
					}
				}
				ul {
					& > li {
						list-style: none;
						.active {
							color: #000;
							background-color: rgba(52, 196, 7, 0.1);
							border-color: #67c23a;
						}
						a {
							color: #909399;
							text-decoration: none;
							display: block;
							height: 100%;
							padding: 12px 20px;
							border-right: 4px solid transparent;
							-moz-transition: ease 0.2s;
							-o-transition: ease 0.2s;
							-webkit-transition: ease 0.2s;
							transition: ease 0.2s;
						}
						a:hover,
						a:active,
						a:focus {
							color: rgba(0, 0, 0, 0.8);
							background-color: rgba(52, 196, 7, 0.08);
						}
					}
				}
			}
		}
	}
</style>
