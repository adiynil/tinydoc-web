<template>
	<layout :active="'/dashboard/comments'" class="container">
		<el-row>
			<el-card shadow="never" :body-style="{ padding: '15px 20px' }">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item to="/dashboard">控制台</el-breadcrumb-item>
					<el-breadcrumb-item>评论消息</el-breadcrumb-item>
				</el-breadcrumb>
			</el-card>
		</el-row>
		<el-row>
			<span style="display: inline-block; padding: 6px; font-size: 22px">评论消息</span>
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
			</div>
			<el-card shadow="never">
				<el-row>
					<el-table ref="ListTable" :data="tableData" style="width: 100%; min-height: 709px" @selection-change="handleSelectionChange">
						<el-table-column type="selection" width="50"></el-table-column>
						<el-table-column prop="name" label="名字" show-overflow-tooltip></el-table-column>
						<el-table-column prop="content" label="内容"></el-table-column>
						<el-table-column prop="create_at" label="发布于" sortable :formatter="dateFormat"> </el-table-column>
						<el-table-column prop="belongs" label="所属于" sortable> </el-table-column>
						<el-table-column label="操作" width="80" fixed="right">
							<template slot-scope="scope">
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
						:total="originData.length"
					>
					</el-pagination>
				</el-row>
			</el-card>
		</el-row>
	</layout>
</template>

<script>
	import layout from "@/views/dashboard/layout";
	import utils from "@/assets/js/utils";
	import comment from "@/api/rules/comment";
	import book from "@/api/rules/book";
	import { mapState } from "vuex";
	export default {
		components: {
			layout,
		},
		data() {
			return {
				selectAll: false,
				bookList: [],
				originData: [],
				searchBy: ["title"],
				currentPage: 1,
				pageSize: 10,
				pageSizes: [10, 20, 40, 60],
				selected: [],
			};
		},
		computed: {
			...mapState(["current"]),
			tableData() {
				return this.originData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
			},
		},
		watch: {
			selectAll(flag) {
				this.$refs.ListTable.clearSelection();
				if (flag) {
					this.$refs.ListTable.toggleAllSelection();
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
			// eslint-disable-next-line no-unused-vars
			onDelete(id) {
				this.$confirm("确定要删除吗？").then(() => {
					let list = [id];
					comment.remove(list).then(() => {
						this.$message({ type: "success", message: "删除成功" });
						this.init();
					});
				});
			},
			multiDelete() {
				this.$confirm("确定要删除吗？").then(() => {
					let list = [];
					this.selected.forEach(item => list.push(item._id));
					comment.remove(list).then(() => {
						this.$message({ type: "success", message: "删除成功" });
						this.init();
					});
				});
			},
			getBookList() {
				book
					.getByAccount(this.current.account)
					.then(res => {
						this.bookList = res.data;
						this.getCommentList();
					})
					.catch(() => {});
			},
			getCommentList() {
				this.bookList.forEach(book => {
					comment.get(book._id).then(res => {
						res.data.forEach(item => (item.belongs = book.title));
						this.originData = [...this.originData, ...res.data];
					});
				});
			},
			init() {
				this.originData = [];
				this.getBookList();
			},
		},
		mounted() {
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
