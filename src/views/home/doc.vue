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
				<el-menu default-active="/book" background-color="#545c64" text-color="#fff" active-text-color="#67c23a" router>
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
				<el-row class="book-list" :gutter="20">
					<el-col class="book-item" :span="14">
						<h2>{{ book.title }}</h2>
						<p class="author">
							<el-link type="primary" :underline="false" href="">@{{ book.account }}</el-link>
						</p>
						<p class="description">{{ book.description }}</p>
						<p class="tags">
							<el-tag v-for="(tag, index) in book.label" :key="index" size="small">{{ tag.name }}</el-tag>
						</p>
						<div>
							<el-button type="primary" size="small" @click="goRead">开始阅读</el-button>
							<el-button v-if="book.is_download" type="default" size="small" @click="download">打包下载</el-button>
						</div>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="24">
						<el-divider content-position="left">目录</el-divider>
						<el-table
							style="width: 100%;min-height:647px"
							:show-header="true"
							:data="currentPageData"
							highlight-current-row
							:default-sort="{ prop: 'create_at', order: 'ascending' }"
						>
							<el-table-column label="标题">
								<template slot-scope="scope">
									<el-link target="_blank" :href="`/book/${book.account}/${book.identity}/${scope.row._id}`">{{ scope.row.title }}</el-link>
								</template>
							</el-table-column>
							<el-table-column :formatter="dateFormat" prop="create_at" label="创建于" sortable width="180"></el-table-column>
							<el-table-column :formatter="dateFormat" prop="last_modified" label="更新于" sortable width="180"></el-table-column>
						</el-table>
					</el-col>
				</el-row>
				<el-row>
					<el-pagination
						:current-page.sync="pageControl.currentPage"
						:page-sizes="[12, 24, 36]"
						:page-size="pageControl.pageSize"
						:total="total.length"
						@size-change="pageSizeChange"
						@current-change="currentPageChange"
						layout="total, sizes, ->, jumper, prev, pager, next"
						background
					>
					</el-pagination>
				</el-row>
				<el-row v-if="book.is_comment">
					<el-col :span="14" :offset="5">
						<el-divider content-position="left">评论</el-divider>
						<el-form :model="commentForm" :rules="rules" ref="commentForm">
							<el-form-item prop="name">
								<el-input placeholder="请输入你的名字" v-model="commentForm.name"></el-input>
							</el-form-item>
							<el-form-item prop="email">
								<el-input placeholder="请输入你的邮箱" v-model="commentForm.email"></el-input>
							</el-form-item>
							<el-form-item prop="site">
								<el-input placeholder="请输入你的网址" v-model="commentForm.site"></el-input>
							</el-form-item>
							<el-form-item prop="content">
								<el-input placeholder="请输入评论内容" type="textarea" :rows="4" v-model="commentForm.content"></el-input>
							</el-form-item>
							<el-form-item>
								<el-button class="block" type="primary" size="medium" @click="onComment">确定</el-button>
							</el-form-item>
						</el-form>
					</el-col>
				</el-row>
				<el-row v-if="book.is_comment">
					<el-col :span="14" :offset="5">
						<el-timeline>
							<div v-if="comment.length > 0">
								<el-timeline-item
									v-for="(item, index) in comment"
									:key="index"
									:timestamp="`发表于 ${timestampFormat(item.create_at)}`"
									placement="top"
								>
									<CommentItem :avatar="item.avatar" :site="item.site" :name="item.name">{{ item.content }}</CommentItem>
								</el-timeline-item>
							</div>
							<div v-else>
								<el-timeline-item timestamp="评论区空空如也~"> </el-timeline-item>
							</div>
						</el-timeline>
					</el-col>
				</el-row>
			</div>
		</div>
	</div>
</template>

<script>
	import CommentItem from "@/components/CommentItem";
	import { formatDate } from "@/assets/js/utils";
	import { book, doc, comment, download } from "@/api";
	export default {
		components: { CommentItem },
		data() {
			return {
				pageControl: {
					currentPage: 1,
					pageSize: 12,
				},
				book: {},
				total: [],
				inputText: "",
				comment: [],
				commentForm: {
					name: "",
					email: "",
					site: "",
					content: "",
				},
				rules: {
					name: [{ required: true, message: "请输入名字" }],
					email: [{ type: "email", required: true, message: "请输入有效邮箱" }],
					site: [{ type: "url", message: "请输入有效链接" }],
					content: [{ required: true, message: "请输入评论内容" }],
				},
			};
		},
		computed: {
			currentPageData() {
				return this.total.slice(
					(this.pageControl.currentPage - 1) * this.pageControl.pageSize,
					this.pageControl.currentPage * this.pageControl.pageSize
				);
			},
		},
		methods: {
			search() {
				this.$router.push(`/book?s=${this.inputText}`);
			},
			currentPageChange(page) {
				this.pageControl.currentPage = page;
			},
			pageSizeChange(size) {
				this.pageControl.pageSize = size;
			},
			dateFormat(row, col, cell) {
				return formatDate(cell);
			},
			timestampFormat(date) {
				return formatDate(date);
			},
			goRead() {
				let { account, identity } = this.book;
				let _id = this.total[0]._id;
				this.$router.push(`/book/${account}/${identity}/${_id}`);
			},
			download() {
				let target_id = this.book._id,
					target_type = "book",
					by = "游客",
					account = this.book.account,
					name = this.book.title;
				let data = { target_type, target_id, by, account, name };
				download
					.pack(data)
					.then(res => {
						download.go(res.data);
					})
					.catch(err => {
						console.log(err);
					});
			},
			onComment() {
				this.$refs.commentForm.validate(valid => {
					if (!valid) return false;
					let { name, email, site, content } = this.commentForm,
						book_id = this.book._id;
					let data = { book_id, name, email, site, content };
					comment
						.insert(data)
						.then(() => {
							this.$message({ type: "success", message: "评论成功" });
							this.commentForm.content = "";
							this.getCommentList(book_id);
						})
						.catch(err => console.log(err));
				});
			},
			getCommentList(id) {
				comment
					.get(id)
					.then(res => {
						this.comment = res.data;
					})
					.catch(err => {
						console.log(err);
					});
			},
			getDocList() {
				let { account, identity } = this.book;
				doc.getByBook(account, identity).then(res => {
					this.total = res.data;
				});
			},
			init() {
				let { account, identity } = this.$route.params;
				book
					.getOne(account, identity)
					.then(res => {
						this.book = res.data;
						document.title = res.data.title;
						this.getDocList();
						this.getCommentList(res.data._id);
					})
					.catch(err => {
						let { status } = err;
						if (status == 404) this.$router.push("/error");
					});
			},
		},
		created() {
			this.init();
		},
	};
</script>

<style scoped lang="scss">
	@import "@/assets/css/home.scss";
</style>
