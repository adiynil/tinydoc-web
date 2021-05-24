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
				<el-menu default-active="/explore" router background-color="#545c64" text-color="#fff" active-text-color="#67c23a">
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
				<div class="hot-authors">
					<el-row>
						<el-col :span="16">
							<el-divider content-position="left">
								<h1>推荐作者</h1>
							</el-divider>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col v-for="(user, index) in authors" :key="index" :span="8">
							<user-item :user="user"></user-item>
						</el-col>
					</el-row>
				</div>
				<div class="hot-books">
					<el-row>
						<el-col :span="16">
							<el-divider content-position="left">
								<h1>推荐知识库</h1>
							</el-divider>
						</el-col>
					</el-row>
					<el-row class="book-list" :gutter="20">
						<el-col class="book-item" :span="8" :xl="6" :md="8" :sm="12" :xs="24" v-for="(book, index) in bookList" :key="index">
							<h2>
								<a :href="`/book/${book.account}/${book.identity}`">{{ book.title }}</a>
							</h2>
							<p class="description">{{ book.description ? book.description : "作者很懒，没有写任何描述信息~" }}</p>
							<el-button type="text" @click="$router.push(`/book/${book.account}/${book.identity}`)">阅读更多</el-button>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import UserItem from "@/components/user";
	// eslint-disable-next-line no-unused-vars
	import { user, book, option } from "@/api";
	export default {
		components: { UserItem },
		data() {
			return {
				authors: [],
				bookList: [],
				inputText: "",
			};
		},
		methods: {
			search() {
				this.$router.push(`/book?s=${this.inputText}`);
			},
		},
		mounted() {
			option.get().then(res => {
				let userlist = res.data.find(op => op.key == "user").value;
				userlist.forEach(account => {
					user.getOne(account).then(res => {
						if (res.status == 200 && res.data) this.authors.push(res.data);
						// console.log(this.authors);
					});
				});
			});
			option.get().then(res => {
				let list = res.data.find(op => op.key == "explore").value;
				list.forEach(str => {
					str = str.split("@");
					book.getOne(str[0], str[1]).then(res => {
						if (res.status == 200 && res.data) this.bookList.push(res.data);
						// console.log(this.bookList);
					});
				});
			});
		},
	};
</script>

<style scoped lang="scss">
	@import "@/assets/css/home.scss";
</style>
