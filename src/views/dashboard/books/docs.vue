<template>
	<layout :active="'/dashboard/books'" class="container">
		<el-row>
			<el-card shadow="never" :body-style="{ padding: '15px 20px' }">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item to="/dashboard">控制台</el-breadcrumb-item>
					<el-breadcrumb-item to="/dashboard/books">知识库</el-breadcrumb-item>
					<el-breadcrumb-item>{{ book.title }}</el-breadcrumb-item>
				</el-breadcrumb>
			</el-card>
		</el-row>
		<el-row>
			<span style="display: inline-block; padding: 6px; font-size: 22px">{{ book.title }}</span>
			<span style="float: right">
				<el-input style="width: 220px; margin-right: 10px" prefix-icon="el-icon-search" placeholder="搜索" clearable v-model="search"></el-input>
				<el-button @click="goNew">
					<span>添加文档</span>
				</el-button>
			</span>
		</el-row>
		<el-row class="book-info">
			<div class="description">
				<p v-if="book.description" class="description">
					{{ book.description }}
				</p>
				<p v-else>
					<i class="el-icon-edit"></i>
					<span>尝试给这个知识库添加点描述信息吧~</span>
				</p>
			</div>
		</el-row>

		<el-row>
			<div class="action-bar">
				<span>
					<el-checkbox v-model="selectAll" size="small" label="全选"></el-checkbox>
				</span>
				<span>
					<el-dropdown @command="handleCommand" trigger="click" placement="bottom-start">
						<el-button type="info" size="mini">
							<span>选中项</span>
							<i class="el-icon-arrow-down el-icon--right"></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="multiDelete" :disabled="selected.length == 0">批量删除</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</span>
				<span class="right">
					<span>
						<el-button :disabled="originData.length == 0" size="small" type="success" title="打包下载整个知识库" @click="download"
							>下载全部</el-button
						>
					</span>
				</span>
			</div>
			<el-card shadow="never">
				<el-row>
					<el-table
						ref="docListTable"
						:data="tableData"
						style="width: 100%; min-height: 709px"
						@selection-change="handleSelectionChange"
						:default-sort="{ prop: 'create_at', order: 'descending' }"
					>
						<el-table-column type="selection" width="50">
							<template slot="header">header</template>
						</el-table-column>
						<el-table-column prop="title" label="标题" show-overflow-tooltip> </el-table-column>
						<el-table-column prop="create_at" label="创建于" sortable :formatter="dateFormat" width="140"> </el-table-column>
						<el-table-column prop="last_modified" label="更新于" sortable :formatter="dateFormat" width="140"> </el-table-column>
						<el-table-column label="操作" width="140" fixed="right">
							<template slot-scope="scope">
								<el-button type="text" @click="goEdit(scope.row._id)">编辑</el-button>
								<el-button type="text" @click="onDelete(scope.row._id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-row>
				<el-row>
					<el-pagination
						background
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page="currentPage"
						:page-sizes="pageSizes"
						:page-size="pageSize"
						:hide-on-single-page="true"
						layout="total, sizes, ->, jumper, prev, pager, next"
						:total="filterData.length"
					>
					</el-pagination>
				</el-row>
			</el-card>
		</el-row>
	</layout>
</template>

<script>
	import layout from "@/views/dashboard/layout";
	import { mapState } from "vuex";
	import utils from "@/assets/js/utils";
	import { book, doc, download } from "@/api";
	export default {
		components: {
			layout,
		},
		data() {
			return {
				selectAll: false,
				originData: [],
				book: {},
				account: this.$route.params.account,
				identity: this.$route.params.identity,
				search: "",
				searchBy: ["title"],
				currentPage: 1,
				pageSize: 10,
				pageSizes: [10, 20, 40, 60],
				selected: [],
			};
		},
		computed: {
			...mapState(["current"]),
			filterData() {
				if (!this.search) return this.originData;
				return this.originData.filter(data => {
					var flag = false;
					this.searchBy.forEach(col => {
						if (data[col].toLowerCase().includes(this.search.toLowerCase())) flag = true;
					});
					return flag;
				});
			},
			tableData() {
				return this.filterData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
			},
		},
		watch: {
			selectAll(flag) {
				this.$refs.docListTable.clearSelection();
				if (flag) {
					this.$refs.docListTable.toggleAllSelection();
				}
			},
		},
		methods: {
			handleSelectionChange(val) {
				this.selected = val;
			},
			handleCommand(command) {
				this[command]();
			},
			handleSizeChange(size) {
				this.pageSize = size;
			},
			handleCurrentChange(page) {
				this.currentPage = page;
			},
			dateFormat(row, col, cell) {
				return utils.formatDate(cell);
			},
			onDelete(id) {
				this.$confirm("确定要删除吗")
					.then(() => {
						doc
							.remove([id])
							.then(() => {
								this.init();
								this.$message({ type: "success", message: "删除成功" });
							})
							.catch(err => console.log(err));
					})
					.catch(() => {});
			},
			multiDelete() {
				this.$confirm("确定要删除这些吗")
					.then(() => {
						let list = [];
						this.selected.forEach(doc => list.push(doc._id));
						doc
							.remove(list)
							.then(() => {
								this.init();
								this.$message({ type: "success", message: "删除成功" });
							})
							.catch(err => console.log(err));
					})
					.catch(() => {});
			},
			download() {
				let target_id = this.book._id,
					target_type = "book",
					by = this.current.account,
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
			goEdit(id) {
				let { account, identity } = this;
				this.$router.push(`/dashboard/edit/books/${account}/${identity}/${id}`);
			},
			goNew() {
				let { account, identity } = this;
				this.$router.push(`/dashboard/new/books/${account}/${identity}`);
			},
			async getBook() {
				let { account, identity } = this;
				try {
					let _book = await book.getOne(account, identity);

					this.book = _book.data;
					this.getDoc();
					document.title = this.book.title + " · TinyDoc";
				} catch (error) {
					console.log(error);
				}
			},
			getDoc() {
				let { account, identity } = this;
				doc.getByBook(account, identity).then(({ data }) => {
					this.originData = data;
				});
			},
			init() {
				let { account, identity } = this.$route.params;
				this.account = account;
				this.identity = identity;
				this.getBook();
			},
		},
		created() {
			this.init();
		},
	};
</script>

<style scoped lang="scss">
	.action-button {
		padding: 5px 8px;
	}
	.book-info {
		.description {
			width: 500px;
			p {
				display: inline-block;
				margin: 11px 4px;
				font-size: 14px;
				color: #909399;
				i {
					margin-right: 5px;
				}
			}
		}
	}
	.action-bar {
		margin-bottom: 15px;
		span + span {
			margin-left: 10px;
		}
	}
</style>
