<template>
	<layout :active="'/dashboard/documents'" class="container">
		<el-row>
			<el-card shadow="never" :body-style="{ padding: '15px 20px' }">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item to="/dashboard">控制台</el-breadcrumb-item>
					<el-breadcrumb-item>我的文档</el-breadcrumb-item>
				</el-breadcrumb>
			</el-card>
		</el-row>
		<el-row>
			<span style="display: inline-block; padding: 6px; font-size: 22px">我的文档</span>
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
							<!-- <el-dropdown-item command="multiDownload" :disabled="selected.length == 0">打包下载</el-dropdown-item> -->
						</el-dropdown-menu>
					</el-dropdown>
				</span>
				<!-- <span class="right">
					<span>
						<el-button size="small" type="success" title="打包下载整个知识库">下载全部</el-button>
					</span>
				</span> -->
			</div>
			<el-card shadow="never">
				<el-row>
					<el-table
						v-if="showList"
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
						<el-table-column prop="book.title" label="所属知识库" sortable=""></el-table-column>
						<el-table-column prop="create_at" label="创建于" sortable :formatter="dateFormat"> </el-table-column>
						<el-table-column prop="last_modified" label="更新于" sortable :formatter="dateFormat"> </el-table-column>
						<el-table-column label="操作" width="140" fixed="right">
							<template slot-scope="scope">
								<el-button type="text" @click="goEdit(scope.row)">编辑</el-button>
								<el-button type="text" @click="onDelete(scope.row)">删除</el-button>
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
	import { book, doc } from "@/api";
	export default {
		components: {
			layout,
		},
		data() {
			return {
				showList: false,
				selectAll: false,
				originData: [],
				bookList: [],
				search: "",
				searchBy: ["title", "book_title"],
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
			goView(url) {
				console.log(url);
			},
			handleSelectionChange(val) {
				this.selected = val;
			},
			handleCommand(command) {
				console.log(command);
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
			onDelete(doc) {
				console.log(doc);
			},
			goEdit(doc) {
				let { account, identity } = doc.book,
					{ _id } = doc;
				this.$router.push(`/dashboard/edit/books/${account}/${identity}/${_id}`);
			},
			getDocList() {
				this.bookList.forEach(item => {
					doc.getByBook(item.account, item.identity).then(({ data }) => {
						data.forEach(doc => (doc.book = item));
						this.originData = [...this.originData, ...data];
					});
				});
				this.showList = true;
			},
			getBookList() {
				book
					.getByAccount(this.current.account)
					.then(res => {
						this.bookList = res.data;
						this.getDocList();
					})
					.catch(err => {
						console.log(err);
					});
			},
			init() {
				this.showList = false;
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
