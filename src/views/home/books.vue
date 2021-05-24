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
				<el-menu
					default-active="/book"
					background-color="#545c64"
					text-color="#fff"
					active-text-color="#67c23a"
					router
				>
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
				<el-row>
					<el-col :span="16">
						<el-divider
							v-if="$route.query.s"
							content-position="left"
							><h1>
								{{ `搜索 ${$route.query.s} 的结果` }}
							</h1></el-divider
						>
						<el-divider v-else content-position="left"
							><h1>所有知识库</h1></el-divider
						>
					</el-col>
				</el-row>
				<el-row class="book-list" :gutter="20">
					<el-col
						class="book-item"
						:span="8"
						:xl="6"
						:md="8"
						:sm="12"
						:xs="24"
						v-for="(book, index) in currentPageData"
						:key="index"
					>
						<h2>
							<a
								:href="`/book/${book.account}/${book.identity}`"
								>{{ book.title }}</a
							>
						</h2>
						<p class="description">
							{{
								book.description
									? book.description
									: "作者很懒，没有写任何描述信息~"
							}}
						</p>
						<el-button
							type="text"
							@click="
								$router.push(
									`/book/${book.account}/${book.identity}`
								)
							"
							>阅读更多</el-button
						>
					</el-col>
				</el-row>
				<el-row>
					<el-pagination
						:current-page="pageControl.currentPage"
						:page-sizes="[12, 24, 36]"
						:page-size="pageControl.pageSize"
						:total="filterData.length"
						@size-change="pageSizeChange"
						@current-change="currentPageChange"
						:hide-on-single-page="true"
						layout="total, sizes, prev, pager, next, jumper"
						background
					>
					</el-pagination>
				</el-row>
			</div>
		</div>
	</div>
</template>

<script>
import Book from "@/api/rules/book";
export default {
	components: {},
	data() {
		return {
			pageControl: {
				currentPage: 1,
				pageSize: 12,
			},
			total: [],
			inputText: "",
		};
	},
	computed: {
		filterData() {
			return this.total.filter((data) => {
				return (
					!this.$route.query.s ||
					data.title
						.toLowerCase()
						.includes(this.$route.query.s.toLowerCase()) ||
					data.description
						.toLowerCase()
						.includes(this.$route.query.s.toLowerCase())
				);
			});
		},
		currentPageData() {
			return this.filterData.slice(
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
		init() {
			Book.getAll()
				.then((res) => {
					this.total = res.data;
				})
				.catch((err) => console.log(err));
		},
	},
	mounted() {
		this.init();
	},
};
</script>

<style scoped lang="scss">
@import "@/assets/css/home.scss";
</style>
