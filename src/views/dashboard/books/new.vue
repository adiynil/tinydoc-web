<template>
	<layout :active="'/dashboard/books'" class="new-doc">
		<el-row>
			<el-card shadow="never" :body-style="{ padding: '15px 20px' }">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item to="/dashboard">控制台</el-breadcrumb-item>
					<el-breadcrumb-item to="/dashboard/books">知识库</el-breadcrumb-item>
					<el-breadcrumb-item :to="`/dashboard/books/${account}/${identity}`">{{ book.title }}</el-breadcrumb-item>
					<el-breadcrumb-item>{{ doc.title ? doc.title : "无标题" }}</el-breadcrumb-item>
				</el-breadcrumb>
			</el-card>
		</el-row>
		<el-row class="doc-info">
			<span style="display: inline-block; padding: 6px; font-size: 22px">
				{{ doc.title ? doc.title : "无标题" }}
			</span>
			<span style="float: right">
				<el-button type="primary" @click="onSubmit">确认添加</el-button>
				<el-button @click="goBack">退出编辑</el-button>
			</span>
		</el-row>
		<el-row :gutter="10">
			<el-col :span="17">
				<div style="margin-bottom: 10px">
					<el-input ref="title" v-model="doc.title" placeholder="请输入文档的标题..."></el-input>
				</div>
				<div style="margin-bottom: 5px">
					<span style="font-size: 14px; color: #909399">
						<span>请使用Markdown格式或纯文本进行编辑。</span>
					</span>
					<span @click="helpDrawer = true" style="cursor: pointer;font-size: 14px;color: #909399;float: right;">
						<span>帮助文档</span>
					</span>
				</div>
				<markdown-editor :onchange="editorChange" />
			</el-col>
			<el-col :span="7">
				<el-card style="margin-bottom: 10px" shadow="never" :body-style="{ padding: '15px' }">
					<p style="margin: 0 0 12px 0; font-size: 14px; color: #909399">
						设置
					</p>
					<div class="doc-options">
						<!-- <div class="option-item">
							<div class="control">
								<el-checkbox title="" v-model="autoSave" label="自动保存"></el-checkbox>
							</div>
							<div class="text">是否开启自动保存</div>
						</div> -->
						<div class="option-item">
							<div class="control">
								<el-checkbox v-model="doc.option.toc" label="开启目录"></el-checkbox>
							</div>
							<div class="text">是否开启浏览页面的侧边目录栏</div>
						</div>
						<div class="option-item">
							<div class="control">
								<el-checkbox v-model="doc.option.tocExpand" :disabled="!doc.option.toc" label="默认展开目录"></el-checkbox>
							</div>
							<div class="text">是否默认展开浏览页面的侧边目录栏</div>
						</div>
						<div class="option-item">
							<div class="control">
								<el-checkbox v-model="doc.option.is_download" label="允许下载"></el-checkbox>
							</div>
							<div class="text">是否设置为允许下载</div>
						</div>
					</div>
				</el-card>
				<el-card shadow="never" :body-style="{ padding: '15px', 'min-height': '150px' }">
					<p style="margin: 0 0 12px 0; font-size: 14px; color: #909399">
						标签
					</p>
					<div>
						<el-input
							class="input-new-tag"
							v-if="inputVisible"
							v-model="inputValue"
							ref="saveTagInput"
							size="small"
							maxlength="16"
							show-word-limit
							placeholder="输入并回车..."
							@keyup.enter.native="handleInputConfirm"
							@blur="handleInputConfirm"
						>
						</el-input>
						<el-button v-else class="button-new-tag" size="small" @click="showInput">添加新标签</el-button>
						<el-tag :key="index" v-for="(tag, index) in doc.tag" closable @close="handleClose(index)">
							{{ tag }}
						</el-tag>
					</div>
				</el-card>
			</el-col>
		</el-row>
		<div name="drawers">
			<el-drawer title="帮助文档" :visible.sync="helpDrawer" @open="openHelp" size="60%">
				<div>
					<markdown-viewer :toc="false" :initData="helpContent"></markdown-viewer>
				</div>
			</el-drawer>
		</div>
	</layout>
</template>

<script>
	import $ from "jquery";
	import MarkdownEditor from "@/components/MarkdownEditor.vue";
	import MarkdownViewer from "@/components/MarkdownViewer";
	import layout from "@/views/dashboard/layout";
	import { mapState } from "vuex";
	import { book, doc } from "@/api";
	export default {
		components: {
			layout,
			MarkdownEditor,
			MarkdownViewer,
		},
		data() {
			return {
				account: "",
				identity: "",
				helpContent: "",
				helpDrawer: false,
				saveTime: "",
				autoSave: true,
				saving: false,
				autoSaveTime: 1000 * 60,
				autoSaveId: "",
				inputVisible: false,
				inputValue: "",
				book: {},
				doc: {
					book_id: 1,
					account: "",
					title: "无标题",
					markdown: "",
					tag: [],
					option: {
						is_download: true,
						toc: true,
						tocExpand: true,
					},
					last_modified: "",
				},
			};
		},
		computed: {
			...mapState(["current"]),
		},
		watch: {
			autoSave(value) {
				if (value) {
					this.autoSaveId = setInterval(() => {
						this.save();
						console.log(this.autoSaveId);
					}, this.autoSaveTime);
				} else {
					clearInterval(this.autoSaveId);
				}
			},
			"doc.option.toc"(value) {
				if (!value) {
					this.doc.option.tocExpand = false;
				}
			},
		},
		methods: {
			goBack() {
				let { account, identity } = this;
				this.$router.push(`/dashboard/books/${account}/${identity}`);
			},
			async openHelp() {
				this.helpContent = await $.get("/static/help.md");
			},
			editorChange({ markdown }) {
				this.doc.markdown = markdown;
			},
			handleClose(index) {
				this.doc.tag.splice(index, 1);
			},
			showInput() {
				this.inputVisible = true;
				this.$nextTick(() => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			handleInputConfirm() {
				let inputValue = this.inputValue.trim();
				if (inputValue) {
					this.doc.tag.push(inputValue);
				}
				this.inputVisible = false;
				this.inputValue = "";
			},
			onSubmit() {
				let { book_id, account, title, markdown, option, tag } = this.doc;
				if (!title || title == "") {
					this.$message({ type: "error", message: "标题不可为空" });
					return this.$refs.title.focus();
				}
				let data = { book_id, account, title, markdown, option, tag };
				doc
					.insert(data)
					.then(({ data }) => {
						let id = data;
						let { account, identity } = this;
						this.$message({ type: "success", message: "保存成功" });
						this.$router.push(`/dashboard/edit/books/${account}/${identity}/${id}`);
					})
					.catch(err => console.log(err));
			},
			save() {
				if (!this.doc.title || this.doc.title == "") this.doc.title = "无标题";
				// this.saving = true;
				// setTimeout(() => {
				// 	this.saving = false;
				// }, 1000);
				document.title = `${this.doc.title} · TinyDoc`;
				// this.saveTime = formatDate(Date.now());
			},
			async getBook() {
				let { account, identity } = this.$route.params;
				this.account = account;
				this.doc.account = account;
				this.identity = identity;
				try {
					let { data } = await book.getOne(account, identity);
					this.book = data;
					this.doc.book_id = data._id;
				} catch (error) {
					let { status } = error;
					if (status == 500) this.$message({ type: "error", message: "服务器出错，请稍后再试" });
					else this.$router.push("/error");
				}
			},
			async init() {
				await this.getBook();
				// 注入自动保存任务
				if (this.autoSave) {
					this.autoSaveId = setInterval(() => {
						this.save();
					}, this.autoSaveTime);
				}
				// 初始化保存
				this.save();
			},
		},
		created() {
			this.init();
		},
		beforeRouteLeave(to, from, next) {
			// 停止自动保存循环
			if (!this.autoSave) {
				return this.$confirm("可能有未保存的修改，确定要离开吗？")
					.then(() => {
						clearInterval(this.autoSaveId);
						next();
					})
					.catch(() => {});
			}
			clearInterval(this.autoSaveId);
			next();
		},
	};
</script>

<style lang="scss">
	.new-doc {
		.doc-info {
			& > span + span {
				margin-left: 5px;
			}
		}
		.doc-options {
			.option-item {
				// margin-bottom: 10px;
				.text {
					font-size: 12px;
					margin-top: 2px;
					padding: 0px 24px;
					color: #909399;
				}
			}
			div + div {
				margin-top: 10px;
			}
		}
		.el-drawer__body {
			overflow: scroll;
		}
		.input-new-tag,
		.el-tag,
		.button-new-tag {
			margin-bottom: 10px;
			margin-right: 10px;
		}
		.button-new-tag {
			width: 100%;
			height: 32px;
			line-height: 30px;
			padding-top: 0;
			padding-bottom: 0;
			border-style: dashed;
		}
		.input-new-tag {
			width: 100%;
			vertical-align: bottom;
		}
	}
</style>
