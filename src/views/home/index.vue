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
				<el-menu default-active="/" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" active-text-color="#67c23a" router>
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
					<!-- <el-col :span="18">
            <div class="feature">
              <h1>开源、共享、微型知识库</h1>
              <p>个人笔记与知识创作，团队协同与知识沉淀，文档归档和分享</p>
              <div>
                <el-button type="primary" @click="goRegister"
                  >立即开始</el-button
                >
              </div>
            </div>
          </el-col> -->
					<el-col :span="24">
						<el-card v-if="!isLogin" class="login" shadow="never">
							<div class="card-body">
								<div>
									<el-button type="primary" plain @click="goLogin">立即登录</el-button>
									<!-- </div>
                <div> -->
									<el-button type="success" @click="goRegister">马上加入</el-button>
								</div>
							</div>
						</el-card>
						<el-card v-if="isLogin" class="logout" shadow="never">
							<div slot="header">
								<span>欢迎你，</span><span>{{ current.account }}</span>
								<el-button style="float: right; padding: 3px 0" type="text" @click="clearCookie">注销</el-button>
							</div>
							<div class="card-body">
								<ul>
									<li><a href="/dashboard">进入控制台</a></li>
									<li><a href="/dashboard/books">我的知识库</a></li>
									<li><a href="/dashboard/profile">个人中心</a></li>
								</ul>
							</div>
						</el-card>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="16">
						<el-divider content-position="left"><h1>推荐知识库</h1></el-divider>
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
</template>

<script>
	import { mapState, mapMutations } from "vuex";
	import { book, option } from "@/api";
	export default {
		components: {},
		data() {
			return {
				inputText: "",
				bookList: [],
			};
		},
		methods: {
			goLogin() {
				this.$router.push("/login");
			},
			goRegister() {
				this.$router.push("/register");
			},
			search() {
				this.$router.push(`/book?s=${this.inputText}`);
			},
			getBookSummary(desc) {
				return desc.length > 60 ? desc.toString().substring(0, 60) + "..." : desc.toString().substring(0, 60);
			},
			...mapMutations(["clearCookie"]),
		},
		computed: mapState(["isLogin", "current"]),
		mounted() {
			option.get().then(res => {
				let list = res.data.find(op => op.key == "home").value;
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
