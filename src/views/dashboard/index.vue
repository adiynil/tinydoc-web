<template>
	<layout :active="'/dashboard'">
		<el-row>
			<el-card shadow="never" :body-style="{ padding: '15px 20px' }">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item to="/dashboard">
						<span>控制台</span>
					</el-breadcrumb-item>
				</el-breadcrumb>
			</el-card>
		</el-row>
		<el-row class="panel" v-if="isLogin">
			<el-card shadow="never">
				<el-row>
					<p class="title">
						<span class="current">{{ current.account }}</span>
						<span class="message">欢迎来到控制台</span>
					</p>
					<p class="sub-title">马上开始你的创作吧</p>
				</el-row>

				<el-row :gutter="10">
					<el-col :span="8">
						<div class="action">
							<i style="color: #67c23a" class="el-icon-notebook-1"></i>
							<p class="top">知识库</p>
							<p class="sub">知识库创建、管理</p>
							<p>
								<el-link type="primary" href="/dashboard/books">立即开始</el-link>
							</p>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="action">
							<i style="color: #409eff" class="el-icon-collection"></i>
							<p class="top">采集任务</p>
							<p class="sub">我发起的采集任务</p>
							<p>
								<el-link type="primary" href="/dashboard/collections">立即前往</el-link>
							</p>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="action">
							<i style="color: #e6a23c" class="el-icon-document"></i>
							<p class="top">我的文档</p>
							<p class="sub">我创建的所有文档</p>
							<p>
								<el-link type="primary" href="/dashboard/documents">立即查看</el-link>
							</p>
						</div>
					</el-col>
				</el-row>
			</el-card>
		</el-row>
		<el-row class="latest">
			<el-card shadow="never" :body-style="{ padding: '20px' }">
				<el-tabs tab-position="left" v-model="activeTab">
					<el-tab-pane name="latest_edit">
						<span slot="label">
							<i style="margin-right: 4px" class="el-icon-document-checked"></i>
							<span>最近编辑</span>
						</span>
						<div class="tab-content">
							<div v-if="docList.length == 0" class="empty">
								<i class="el-icon-warning-outline"></i>
								<p>Ops，这里空空如也~</p>
							</div>
							<div v-else class="content">
								<div class="item" v-for="(item, index) in docList" :key="index">
									<p>
										<el-link type="primary" :href="`/dashboard/edit/books/${item.book.account}/${item.book.identity}/${item._id}`">{{
											item.title
										}}</el-link>
									</p>
									<p>
										<span>
											<span class="label">保存于</span>
											<span>{{ format(item.last_modified) }}</span>
										</span>
										<span>
											<span class="label label-right">所属于</span>
											<span>
												<el-link type="default" :href="`/dashboard/books/${item.book.account}/${item.book.identity}`">{{ item.book.title }}</el-link>
											</span>
										</span>
										<span>
											<span class="label label-right">创建于</span>
											<span>{{ format(item.create_at) }}</span>
										</span>
									</p>
								</div>
								<div class="more">
									<el-button type="primary" plain round @click="$router.push('/dashboard/documents')"> 查看更多 </el-button>
								</div>
							</div>
						</div>
					</el-tab-pane>
					<el-tab-pane name="lastest_collect">
						<span slot="label">
							<i style="margin-right: 4px" class="el-icon-document"></i>
							<span>最近采集</span>
						</span>
						<div class="tab-content">
							<div v-if="collectList.length == 0" class="empty">
								<i class="el-icon-warning-outline"></i>
								<p>Ops，这里空空如也~</p>
							</div>
							<div v-else class="content">
								<div class="item" v-for="(item, index) in collectList" :key="index">
									<p>
										<span>{{ item.name }}</span>
										<span class="label label-right">于</span>
										<span class="">{{ format(item.create_at) }}</span>
									</p>
									<p>
										<span class="label">向采集任务</span>
										<span>
											<el-link type="primary" :href="`/dashboard/collections/${item.collection.code}`">{{ item.collection.title }}</el-link>
										</span>
										<span class="label label-right">提交了文档</span>
									</p>
								</div>
								<div class="more">
									<el-button type="primary" plain round @click="$router.push('/dashboard/collections')"> 查看更多 </el-button>
								</div>
							</div>
						</div>
					</el-tab-pane>
					<el-tab-pane name="lastest_comment">
						<span slot="label">
							<i style="margin-right: 4px" class="el-icon-chat-line-square"></i>
							<span>最新评论</span>
						</span>
						<div class="tab-content">
							<div v-if="commentList.length == 0" class="empty">
								<i class="el-icon-warning-outline"></i>
								<p>Ops，这里空空如也~</p>
							</div>
							<div v-else class="content">
								<div class="item" v-for="(item, index) in commentList" :key="index">
									<p>
										<span>{{ item.name }}</span>
										<span class="label label-right">在知识库</span>
										<span>
											<el-link type="primary" :href="`/dashboard/books/${item.book.account}/${item.book.identity}`">{{ item.book.title }}</el-link>
										</span>
										<span class="label label-right">中评论：</span>
									</p>
									<p>
										<span>{{ item.content }}</span>
									</p>
								</div>
								<div class="more">
									<el-button type="primary" plain round @click="$router.push('/dashboard/comments')"> 查看更多 </el-button>
								</div>
							</div>
						</div>
					</el-tab-pane>
				</el-tabs>
			</el-card>
		</el-row>
	</layout>
</template>

<script>
	import layout from "@/views/dashboard/layout";
	import { mapState } from "vuex";
	import { formatDate } from "@/assets/js/utils";
	import { doc, collectdoc, collection, comment, book } from "@/api";
	export default {
		components: { layout },
		data() {
			return {
				activeTab: "latest_edit",
				docList: [],
				collectList: [],
				commentList: [],
			};
		},
		computed: {
			...mapState(["current", "isLogin"]),
		},
		methods: {
			format(d) {
				return formatDate(d);
			},
			// init() {
			// 	let { account } = this.current;
			// 	book.getByAccount(account).then(res => {
			// 		res.data.forEach(_book => {
			// 			comment.get(_book._id).then(res => {
			// 				res.data.forEach(cm => (cm.book = _book));
			// 				this.commentList = [...this.commentList, ...res.data];
			// 			});
			// 			doc.getByBook(_book.account, _book.identity).then(res => {
			// 				res.data.forEach(d => (d.book = _book));
			// 				this.docList = [...this.docList, ...res.data];
			// 			});
			// 		});
			// 	});
			// 	collection.getByAccount(account).then(res => {
			// 		res.data.forEach(_collection => {
			// 			collectdoc.getById(_collection._id).then(res => {
			// 				res.data.forEach(cd => (cd.collection = _collection));
			// 				this.collectList = [...this.collectList, ...res.data];
			// 			});
			// 		});
			// 	});
			// },
			async init() {
				let { account } = this.current;
				let book_res = await book.getByAccount(account);
				// for循环强制同步
				for (let i = 0; i < book_res.data.length; i++) {
					let comment_res = await comment.get(book_res.data[i]._id);
					comment_res.data.forEach(cm => (cm.book = book_res.data[i]));
					this.commentList = [...this.commentList, ...comment_res.data];
				}
				// 按创建时间排序
				this.commentList.sort((b, a) => {
					return new Date(a.create_at).getTime() - new Date(b.create_at).getTime() > 0 ? 1 : -1;
				});
				this.commentList = this.commentList.slice(0, 5);
				// for循环强制同步
				for (let i = 0; i < book_res.data.length; i++) {
					let doc_res = await doc.getByBook(book_res.data[i].account, book_res.data[i].identity);
					doc_res.data.forEach(d => (d.book = book_res.data[i]));
					this.docList = [...this.docList, ...doc_res.data];
				}
				// 按更新时间排序
				this.docList.sort((b, a) => {
					return new Date(a.last_modified).getTime() - new Date(b.last_modified).getTime() > 0 ? 1 : -1;
				});
				this.docList = this.docList.slice(0, 5);
				// 采集列表
				let collection_res = await collection.getByAccount(account);
				// for循环强制同步执行
				for (let i = 0; i < collection_res.data.length; i++) {
					// collection_res.data[i]
					let collect_res = await collectdoc.getById(collection_res.data[i]._id);
					collect_res.data.forEach(cd => (cd.collection = collection_res.data[i]));
					this.collectList = [...this.collectList, ...collect_res.data];
				}
				// 排序
				this.collectList.sort((b, a) => {
					return new Date(a.create_at).getTime() - new Date(b.create_at).getTime() > 0 ? 1 : -1;
				});
				this.collectList = this.collectList.slice(0, 5);
			},
		},
		mounted() {
			this.init();
		},
	};
</script>

<style scoped lang="scss">
	.panel {
		p + p {
			margin-top: 5px;
		}
		.el-row + .el-row {
			margin-top: 20px;
		}
		.title {
			font-size: 18px;
			.current {
				color: #606266;
				&:hover {
					color: #303133;
				}
			}
			.message {
				color: #303133;
				&::before {
					content: " · ";
				}
			}
		}
		.sub-title {
			font-size: 14px;
			color: #909399;
		}
		.action {
			padding: 12px;
			border: 1px solid rgba(0, 0, 0, 0.1);
			border-radius: 4px;
			background-color: rgba(238, 238, 238, 0.2);
			transition: linear 0.25s;
			&:hover {
				border-color: rgba(0, 0, 0, 0.15);
				background-color: rgba(238, 238, 238, 0.05);
				i {
					opacity: 1;
				}
			}
			i {
				font-size: 32px;
				float: left;
				height: 64px;
				padding: 16px 10px 16px 2px;
				opacity: 0.6;
				transition: linear 0.15s;
			}
			.top {
				color: #303133;
			}
			.sub {
				font-size: 14px;
				color: #909399;
			}
		}
	}
	.latest {
		.tab-content {
			height: auto;
			padding: 0 10px;
			.empty {
				height: 50px;
				color: #909399;
				margin: 0 auto;
				text-align: center;
				position: relative;
				top: 50%; /*偏移*/
				transform: translateY(-50%);
				i {
					font-size: 22px;
					margin-bottom: 5px;
				}
				p {
					font-size: 14px;
				}
			}
			.content {
				.item + .item {
					margin-top: 20px;
				}
				.item {
					padding: 15px;
					border: 1px solid #eee;
					p {
						font-size: 14px;
						& > .el-link {
							font-size: 16px;
						}
						.label {
							color: #909399;
							margin-right: 5px;
						}
						.label-right {
							margin-left: 5px;
						}
						span {
							color: #606266;
							.el-link {
								vertical-align: initial;
							}
						}
					}
					p + p {
						margin-top: 5px;
					}
				}
			}
			.more {
				margin-top: 20px;
				text-align: center;
				.el-button {
					padding: 8px 30px;
				}
			}
		}
	}
</style>
