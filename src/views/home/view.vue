<template>
	<div class="page">
		<div class="book-meta">
			<el-row class="head">
				<h1 class="title">{{ book.title }}</h1>
				<p>{{ book.description }}</p>
			</el-row>
			<el-row>
				<span style="margin-right: 10px">
					<el-button plain size="small" type="primary" @click="goBack" icon="el-icon-arrow-left">返回</el-button>
				</span>
				<span>
					<el-select size="small" v-model="selected" placeholder="目录" @change="selectChange">
						<el-option v-for="item in docList" :key="item._id" :label="item.title" :value="item._id"></el-option>
					</el-select>
				</span>
			</el-row>
			<div style="margin-top:10px">
				<el-tag style="margin-right:10px" v-for="(tag, index) in currentDoc.tag" :key="index" size="medium">{{ tag }}</el-tag>
			</div>
		</div>

		<markdown-viewer
			v-if="ifViewerSourceDataLoaded"
			:toc="currentDoc.option.toc"
			:tocExpand="currentDoc.option.tocExpand"
			:initData="currentDoc.markdown"
		/>
	</div>
</template>

<script>
	import MarkdownViewer from "@/components/MarkdownViewer.vue";
	import { book, doc } from "@/api";

	export default {
		components: {
			MarkdownViewer,
		},
		data() {
			return {
				account: "",
				identity: "",
				ifViewerSourceDataLoaded: false,
				currentDoc: {},
				book: {},
				selected: "",
				docList: [],
			};
		},
		methods: {
			selectChange(id) {
				let { account, identity } = this;
				this.$router.push(`/book/${account}/${identity}/${id}`);
			},
			goBack() {
				let { account, identity } = this;
				this.$router.push(`/book/${account}/${identity}`);
			},
			init() {
				this.ifViewerSourceDataLoaded = false;
				let { account, identity, id } = this.$route.params;
				this.account = account;
				this.identity = identity;
				book.getOne(account, identity).then(res => {
					this.book = res.data;
					document.title = res.data.title;
					doc.getByBook(account, identity).then(res => {
						this.docList = res.data;
						this.selected = id;
						this.currentDoc = this.docList.find(item => item._id == id);
						this.ifViewerSourceDataLoaded = true;
					});
				});
			},
		},
		mounted() {
			this.init();
		},
		computed: {},
		watch: {
			"$route.params.id"() {
				this.init();
			},
		},
	};
</script>

<style scoped lang="scss">
	.book-meta {
		padding: 30px 400px 0px 40px;
		.el-row + .el-row {
			margin-top: 20px;
		}
		.head {
			p {
				color: #909399;
				font-size: 14px;
			}
			.title {
				color: #303133;
				font-size: 18px;
				margin-bottom: 10px;
			}
		}
	}
	.block {
		display: block;
	}
</style>
