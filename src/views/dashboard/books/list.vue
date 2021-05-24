<template>
	<layout :active="'/dashboard/books'" class="container">
		<el-row>
			<el-card shadow="never" :body-style="{ padding: '15px 20px' }">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item to="/dashboard">控制台</el-breadcrumb-item>
					<el-breadcrumb-item to="/dashboard/books">知识库</el-breadcrumb-item>
				</el-breadcrumb>
			</el-card>
		</el-row>
		<el-row>
			<span style="display: inline-block; padding: 6px; font-size: 22px">个人知识库</span>
			<span style="float: right">
				<el-input style="width: 220px; margin-right: 10px" prefix-icon="el-icon-search" placeholder="搜索" clearable v-model="searchText"></el-input>
				<el-button @click="openAdd">
					<span>新建知识库</span>
				</el-button>
			</span>
		</el-row>
		<el-row>
			<div class="filters">
				<p>
					<span>
						<el-popover placement="bottom-start" trigger="click">
							<span slot="reference" class="el-dropdown-link"> 按时间排序<i class="el-icon-arrow-down el-icon--right"></i> </span>
							<div>
								<el-radio-group v-model="timeSort">
									<el-radio class="block" label="positive">正序</el-radio>
									<el-radio style="margin-top: 10px" class="block" label="reverse">倒序</el-radio>
								</el-radio-group>
							</div>
						</el-popover>
					</span>
					<span>
						<el-popover placement="bottom-start" trigger="click">
							<span slot="reference" class="el-dropdown-link"> 按名称排序<i class="el-icon-arrow-down el-icon--right"></i> </span>
							<div>
								<el-radio-group v-model="nameSort">
									<el-radio class="block" label="positive">正序</el-radio>
									<el-radio style="margin-top: 10px" class="block" label="reverse">倒序</el-radio>
								</el-radio-group>
							</div>
						</el-popover>
					</span>
					<span>
						<el-popover placement="bottom-start" trigger="click">
							<span slot="reference" class="el-dropdown-link"> 按是否私密查看<i class="el-icon-arrow-down el-icon--right"></i> </span>
							<div>
								<el-checkbox-group v-model="publicFilter">
									<el-checkbox label="public">
										<span>公开</span>
									</el-checkbox>
									<el-checkbox style="margin-top: 10px" class="block" label="private">
										<span>个人</span>
									</el-checkbox>
								</el-checkbox-group>
							</div>
						</el-popover>
					</span>
				</p>
			</div>
		</el-row>
		<el-row style="min-height: 648px" v-loading="loadingBookList" :gutter="10">
			<el-col v-for="(book, index) in currentPageBooks" class="book" :key="index" :span="8">
				<el-card class="book-item" shadow="never" :body-style="{ padding: '20px 20px 10px' }">
					<div>
						<span class="title" @click="$router.push('/dashboard/books/' + current.account + '/' + book.identity)">
							<span><i class="el-icon-notebook-2"></i></span>
							<span class="content">{{ book.title }}</span>
						</span>
						<span class="status">
							<span v-if="!book.is_public">
								<i class="el-icon-lock" title="私有"></i>
							</span>
							<span v-else>
								<span v-if="book.is_comment">
									<i class="el-icon-chat-line-square" title="允许评论"></i>
								</span>
								<span v-if="book.is_download">
									<i class="el-icon-download" title="允许下载"></i>
								</span>
							</span>
						</span>
					</div>
					<p v-if="book.description" class="description">
						{{ book.description }}
					</p>
					<p v-else class="description">
						<i class="el-icon-edit"></i>
						<span>尝试给这个知识库添加点描述信息吧~</span>
					</p>
					<p class="options">
						<el-dropdown placement="bottom-start" trigger="click" @command="handleCommand">
							<span class="el-dropdown-link"> 选项<i class="el-icon-arrow-down el-icon--right"></i> </span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item :command="{ action: 'openUpdate', data: book }">管理知识库 </el-dropdown-item>
								<el-dropdown-item :command="{ action: 'goView', data: book }">浏览知识库 </el-dropdown-item>
								<el-dropdown-item :command="{ action: 'onDelete', data: book }">删除知识库 </el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</p>
				</el-card>
			</el-col>
		</el-row>
		<el-row>
			<el-pagination
				@size-change="sizeChange"
				@current-change="currentChange"
				:current-page.sync="pageConf.currentPage"
				:page-sizes="pageConf.pageSizes"
				:page-size="pageConf.pageSize"
				layout="total, sizes, ->, jumper, prev, pager, next"
				:total="filterBooks.length"
				:hide-on-single-page="true"
				background
			>
			</el-pagination>
		</el-row>
		<div name="dialogs">
			<el-dialog :visible.sync="editDialog" width="50%">
				<div class="pop-form">
					<el-form :model="form" :rules="rules" ref="editForm">
						<el-form-item prop="title" label="名称">
							<el-input v-model="form.title" placeholder="知识库名称" required></el-input>
						</el-form-item>
						<el-form-item prop="identity" label="唯一标识">
							<el-input :disabled="!isAdd" size="default" v-model="form.identity" placeholder="唯一标识" required>
								<template slot="prepend">{{ host + current.account + "/" }}</template>
								<el-button v-if="isAdd" slot="append" type="primary" size="default" icon="el-icon-refresh-left" @click="generateIdentity"></el-button>
							</el-input>
						</el-form-item>
						<el-form-item class="item-label" prop="label" label="标签">
							<el-input
								class="input-new-tag"
								v-if="inputVisible"
								v-model="inputValue"
								ref="saveTagInput"
								placeholder="输入并回车..."
								size="small"
								@keyup.enter.native="handleInputConfirm"
								@blur="handleInputConfirm"
							>
							</el-input>
							<el-button v-else class="button-new-tag" size="small" @click="showInput">添加新标签</el-button>
							<el-tag :key="index" v-for="(tag, index) in form.label" closable @close="handleClose(index)">
								{{ tag.name }}
							</el-tag>
						</el-form-item>
						<el-form-item prop="description" label="描述">
							<el-input type="textarea" rows="4" v-model="form.description" placeholder="知识库的描述信息"></el-input>
						</el-form-item>
						<el-collapse accordion>
							<el-collapse-item>
								<template slot="title"> 高级设置<i class="el-icon-s-operation head-icon"></i> </template>
								<el-form-item label="是否公开" prop="is_public">
									<el-switch v-model="form.is_public"> </el-switch>
								</el-form-item>
								<el-form-item label="是否允许评论" prop="is_comment">
									<el-switch v-model="form.is_comment"> </el-switch>
								</el-form-item>
								<el-form-item label="是否允许下载" prop="is_download">
									<el-switch v-model="form.is_download"> </el-switch>
								</el-form-item>
							</el-collapse-item>
						</el-collapse>
					</el-form>
				</div>
				<span slot="footer">
					<el-button size="small" @click="editDialog = false">取消</el-button>
					<el-button type="primary" size="small" @click="onSubmit">确定</el-button>
				</span>
			</el-dialog>
		</div>
	</layout>
</template>

<script>
	import layout from "@/views/dashboard/layout";
	import { mapState } from "vuex";
	import { book } from "@/api";
	import { customAlphabet } from "nanoid";
	let nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 8);

	export default {
		components: {
			layout,
		},
		data() {
			return {
				loadingBookList: true,
				searchText: "",
				timeSort: "reverse",
				nameSort: "",
				publicFilter: ["public", "private"],
				pageConf: {
					pageSize: 12,
					currentPage: 1,
					pageSizes: [12, 18, 24],
				},
				books: [],
				editDialog: false,
				isAdd: false,
				inputVisible: false,
				inputValue: "",
				host: window.location.protocol + "//" + window.location.host + "/book/",
				form: {
					id: "",
					title: "",
					label: [],
					identity: "",
					description: "",
					is_public: true,
					is_comment: true,
					is_download: false,
				},
				rules: {
					title: [{ required: true, message: "知识库名称是必须的", trigger: "blur" }],
					identity: [{ required: true, message: "唯一标识是必须的", trigger: "blur" }],
				},
			};
		},
		watch: {
			timeSort(newVal) {
				if (newVal == "positive") {
					this.books.sort((a, b) => (new Date(a.create_at) > new Date(b.create_at) ? 1 : -1));
				} else {
					this.books.sort((a, b) => (new Date(b.create_at) > new Date(a.create_at) ? 1 : -1));
				}
			},
			nameSort(newVal) {
				if (newVal == "positive") {
					this.books.sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
				} else {
					this.books.sort((a, b) => b.title.localeCompare(a.title, "zh-CN"));
				}
			},
		},
		computed: {
			...mapState(["current", "isLogin"]),
			filterBooks() {
				let list = this.books.filter(
					book =>
						!this.searchText ||
						book.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
						book.description.toLowerCase().includes(this.searchText.toLowerCase())
				);
				if (this.publicFilter.length == 2) return list;
				if (this.publicFilter.includes("public")) return list.filter(book => book.is_public == true);
				if (this.publicFilter.includes("private")) return list.filter(book => book.is_public == false);
				return [];
			},
			currentPageBooks() {
				return this.filterBooks.slice((this.pageConf.currentPage - 1) * this.pageConf.pageSize, this.pageConf.currentPage * this.pageConf.pageSize);
			},
		},
		methods: {
			sizeChange(size) {
				this.pageConf.pageSize = size;
			},
			currentChange(page) {
				this.pageConf.currentPage = page;
			},
			goView(book) {
				let host = window.location.protocol + "//" + window.location.host;
				window.open(host + "/book/" + book.account + "/" + book.identity, "_blank");
			},
			generateIdentity() {
				this.form.identity = nanoid();
			},
			handleClose(index) {
				this.form.label.splice(index, 1);
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
					let label = { name: inputValue };
					this.form.label.push(label);
				}
				this.inputVisible = false;
				this.inputValue = "";
			},
			onSubmit() {
				if (!this.isAdd) return this.onUpdate();
				this.$refs["editForm"].validate(valid => {
					if (!valid) return false;
					let { title, label, description, is_public, is_comment, is_download } = this.form;
					let data = { title, label, description, is_public, is_comment, is_download };
					book
						.insertOne(this.current.account, this.form.identity, data)
						.then(() => {
							this.$message({ type: "success", message: "添加成功" });
							this.init();
							this.editDialog = false;
						})
						.catch(err => {
							if (err.data.message) return this.$message(err.data.message);
							this.$message("未知错误");
						});
				});
			},
			handleCommand(command) {
				this[command.action].call(this, command.data);
			},
			async openAdd() {
				this.isAdd = true;
				this.editDialog = true;
				await this.$nextTick(() => {
					this.$refs["editForm"].resetFields();
				});
				this.generateIdentity();
			},
			async openUpdate(book) {
				this.isAdd = false;
				this.editDialog = true;
				await this.$nextTick(() => {
					this.$refs["editForm"].resetFields();
				});
				this.form.id = book._id;
				this.form.title = book.title;
				this.form.label = book.label;
				this.form.identity = book.identity;
				this.form.description = book.description;
				this.form.is_public = book.is_public;
				this.form.is_comment = book.is_comment;
				this.form.is_download = book.is_download;
			},
			onUpdate() {
				book
					.updateOne(this.form.id, this.form)
					.then(() => {
						this.$message({ type: "success", message: "更新成功" });
						this.init();
						this.editDialog = false;
					})
					.catch(err => {
						if (err.status == 500)
							return this.$message({
								type: "error",
								message: "服务器出错",
							});
						for (let key in err.data) {
							setTimeout(() => {
								this.$message(err.data[key]);
							}, 500);
						}
					});
			},
			onDelete(book) {
				this.$confirm("确认删除？")
					.then(() => {
						this.delete([book._id]);
					})
					.catch(() => {});
			},
			delete(list) {
				book
					.deleteOne(list[0])
					.then(() => {
						this.$message({ type: "success", message: "删除成功" });
						this.init();
					})
					.catch(err => {
						if (err.status == 500)
							return this.$message({
								type: "error",
								message: "服务器出错",
							});
						for (let key in err.data) {
							setTimeout(() => {
								this.$message(err.data[key]);
							}, 500);
						}
					});
			},
			getBookList() {
				book
					.getByAccount(this.current.account)
					.then(res => {
						this.books = res.data;
						// 默认排序
						this.books.sort((a, b) => (new Date(b.create_at) > new Date(a.create_at) ? 1 : -1));
						this.loadingBookList = false;
					})
					.catch(err => {
						this.loadingBookList = false;
						let { message } = err.data;
						if (err.status == 500) return this.$message({ type: "error", message: "服务器出错" });
						if (err.status == 404) return this.$message("你还没有知识库，请先添加吧");

						this.$message(message);
					});
			},
			init() {
				this.getBookList();
			},
		},
		mounted() {
			this.init();
		},
	};
</script>

<style scoped lang="scss">
	@import "@/assets/css/global.scss";
	.container {
		.filters {
			padding: 4px;
			.el-dropdown-link {
				font-size: 14px;
				cursor: pointer;
				color: #409eff;
			}
			.el-icon-arrow-down {
				font-size: 12px;
			}
			span + span {
				margin-left: 20px;
			}
		}
		.book {
			margin-bottom: 10px;
			position: relative;
			.book-item {
				transition: linear 0.1s;
				-webkit-transition: linear 0.1s;
				-moz-transition: linear 0.1s;
				-ms-transition: linear 0.1s;
				-o-transition: linear 0.1s;
				&:hover {
					background-color: rgba(0, 165, 255, 0.01);
				}
				.options {
					text-align: right;
					cursor: default;
					transition: linear 0.3s;
					.el-dropdown-link {
						cursor: pointer;
						color: #409eff;
					}
					.el-icon-arrow-down {
						font-size: 12px;
					}
				}
				.title {
					cursor: pointer;
					& > span {
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
						color: #303133;
						text-decoration: none;
						font-size: 18px;
						vertical-align: baseline;
						transition: linear 0.1s;
						-webkit-transition: linear 0.1s;
						-moz-transition: linear 0.1s;
						-ms-transition: linear 0.1s;
						-o-transition: linear 0.1s;
					}
					& > span > i {
						font-size: 32px;
						margin-right: 5px;
						vertical-align: sub;
						color: #00a2ff;
					}
				}
				.description {
					height: 38px;
					i {
						margin-right: 5px;
					}
				}
				.status {
					float: right;
					font-size: 20px;
					i {
						cursor: help;
						opacity: 0.6;
						vertical-align: bottom;
						transition: linear 0.2s;
						-webkit-transition: linear 0.2s;
						-moz-transition: linear 0.2s;
						-ms-transition: linear 0.2s;
						-o-transition: linear 0.2s;
						&:hover {
							opacity: 1;
						}
					}
					span + span {
						margin-left: 5px;
					}
				}
				p {
					font-size: 14px;
					color: #909399;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
				div + p,
				p + p {
					margin-top: 10px;
				}
			}
		}
		.pop-form {
			.el-form-item {
				margin-bottom: 10px;
			}
			.head-icon {
				margin-left: 5px;
			}
			.label-button {
				padding: 5px 10px;
				margin-left: 10px;
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
				height: 32px;
				vertical-align: bottom;
			}
		}
	}
</style>
