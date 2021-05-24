<template>
	<layout :active="'/dashboard/collections'" class="collect_detail">
		<el-row>
			<el-card shadow="never" :body-style="{ padding: '15px 20px' }">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item to="/dashboard">控制台</el-breadcrumb-item>
					<el-breadcrumb-item to="/dashboard/collections">采集任务</el-breadcrumb-item>
					<el-breadcrumb-item>{{ collection.title }}</el-breadcrumb-item>
				</el-breadcrumb>
			</el-card>
		</el-row>
		<el-row>
			<span style="display: inline-block; padding: 6px; font-size: 22px">{{ collection.title }}</span>
			<span style="float: right">
				<el-input style="width: 220px" prefix-icon="el-icon-search" placeholder="搜索" clearable v-model="search"></el-input>
				<el-button style="margin-left: 10px" @click="$router.push('/dashboard/collections')">
					<span>返回列表</span>
				</el-button>
			</span>
		</el-row>
		<el-row>
			<el-row>
				<div style="margin-bottom: 15px">
					<span>
						<el-checkbox v-model="selectAll" size="small" label="全选"></el-checkbox>
					</span>
					<span style="margin-left: 10px">
						<el-dropdown @command="handleCommand" trigger="click" placement="bottom-start">
							<el-button type="info" size="mini">
								<span>选中项</span>
								<i class="el-icon-arrow-down el-icon--right"></i>
							</el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item :command="{ action: 'multiDelete', data: selected }" :disabled="selected.length == 0">批量删除</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</span>
					<span class="right">
						<span>
							<el-button size="small" type="success" title="下载所有文档" @click="multiDownload">下载全部</el-button>
						</span>
					</span>
				</div>
			</el-row>
			<el-card shadow="never" :body-style="{ padding: '20px' }">
				<el-row>
					<el-table
						:data="tableData"
						ref="dataTable"
						style="width: 100%; min-height: 709px"
						@selection-change="selectionChange"
						highlight-current-row
					>
						<el-table-column type="selection" width="50"></el-table-column>
						<el-table-column prop="name" label="名称"> </el-table-column>
						<el-table-column prop="remark" label="备注" show-overflow-tooltip> </el-table-column>
						<el-table-column prop="create_at" :formatter="dateFormatter" sortable label="提交时间"> </el-table-column>
						<el-table-column label="操作" fixed="right">
							<template slot-scope="scope">
								<el-dropdown trigger="click" placement="bottom-start" @command="handleCommand">
									<el-button type="text" class="el-dropdown-link"> 选项<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item :command="{ action: 'onPreview', data: scope.row }">预览</el-dropdown-item>
										<el-dropdown-item :command="{ action: 'onDelete', data: scope.row }">删除</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</template>
						</el-table-column>
					</el-table>
				</el-row>
				<el-row>
					<el-pagination
						@size-change="sizeChange"
						@current-change="currentChange"
						:current-page.sync="pageConf.currentPage"
						:page-sizes="pageConf.pageSizes"
						:page-size="pageConf.pageSize"
						layout="total, sizes, ->, jumper, prev, pager, next"
						:total="filterData.length"
						background
					>
					</el-pagination>
				</el-row>
			</el-card>
		</el-row>
		<div name="drawers">
			<el-drawer title="预览" :visible.sync="previewDrawer" size="60%">
				<div style="height: 100%" v-loading="previewDrawerLoading">
					<markdown-viewer v-if="!previewDrawerLoading" :initData="previewDoc" :toc="false"></markdown-viewer>
				</div>
			</el-drawer>
		</div>
	</layout>
</template>

<script>
	import layout from "@/views/dashboard/layout";
	import MarkdownViewer from "@/components/MarkdownViewer";
	import { customAlphabet } from "nanoid";
	import { mapState } from "vuex";
	import { formatDate } from "@/assets/js/utils";
	import { collection, collectdoc, download } from "@/api";
	// eslint-disable-next-line no-unused-vars
	let nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 12);
	export default {
		components: { layout, MarkdownViewer },
		data() {
			return {
				search: "",
				selectAll: false,
				previewDrawer: false,
				previewDrawerLoading: true,
				previewDoc: "",
				collection: {},
				pageConf: {
					pageSize: 10,
					currentPage: 1,
					pageSizes: [10, 20, 40, 60],
				},
				collected: [],
				selected: [],
			};
		},
		computed: {
			...mapState(["current"]),
			filterData() {
				let search = this.search.toLowerCase();
				return this.collected.filter(item => !search || item.name.toLowerCase().includes(search) || item.remark.toLowerCase().includes(search));
			},
			tableData() {
				return this.filterData.slice((this.pageConf.currentPage - 1) * this.pageConf.pageSize, this.pageConf.currentPage * this.pageConf.pageSize);
			},
		},
		watch: {
			selectAll(flag) {
				this.$refs.dataTable.clearSelection();
				if (flag) {
					this.$refs.dataTable.toggleAllSelection();
				}
			},
		},
		methods: {
			sizeChange(size) {
				this.pageConf.pageSize = size;
			},
			currentChange(page) {
				this.pageConf.currentPage = page;
			},
			selectionChange(val) {
				this.selected = val;
			},
			dateFormatter(row, col, cell) {
				return formatDate(cell);
			},
			handleCommand(command) {
				this[command.action].call(this, command.data);
			},
			onPreview(doc) {
				this.previewDrawerLoading = true;
				this.previewDoc = doc.content;
				this.previewDrawer = true;
				setTimeout(() => {
					this.previewDrawerLoading = false;
				}, 1000);
			},
			onDelete(doc) {
				this.$confirm("确定要删除吗")
					.then(() => {
						collectdoc
							.remove([doc._id])
							.then(() => {
								this.init();
								this.$message({ type: "success", message: "删除成功" });
							})
							.catch(err => console.log(err));
					})
					.catch(() => {});
			},
			multiDownload() {
				let target_id = this.collection._id,
					target_type = "collection",
					by = this.current.account,
					account = this.collection.account,
					name = this.collection.title;
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
			multiDelete(array) {
				this.$confirm("确定要删除吗")
					.then(() => {
						let data = [];
						array.forEach(item => data.push(item._id));
						collectdoc
							.remove(data)
							.then(() => {
								this.init();
								this.$message({ type: "success", message: "删除成功" });
							})
							.catch(err => console.log(err));
					})
					.catch(() => {});
			},
			init() {
				let { code } = this.$route.params;
				collection
					.getByCode(code)
					.then(res => {
						document.title = res.data.title + " · TinyDoc";
						this.collection = res.data;
						collectdoc
							.getById(res.data._id)
							.then(res => {
								this.collected = res.data;
							})
							.catch(err => console.log(err));
					})
					.catch(err => console.log(err));
			},
		},
		mounted() {
			this.init();
		},
	};
</script>

<style lang="scss">
	.collect_detail {
		.el-dropdown-link {
			margin-left: 10px;
			cursor: pointer;
			color: #409eff;
		}
		.el-icon-arrow-down {
			font-size: 12px;
		}
		.el-drawer__body {
			overflow: scroll;
		}
	}
</style>
