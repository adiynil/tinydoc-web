<template>
	<layout :active="'/dashboard/downloads'" class="container">
		<el-row>
			<el-card shadow="never" :body-style="{ padding: '15px 20px' }">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item to="/dashboard">控制台</el-breadcrumb-item>
					<el-breadcrumb-item>下载记录</el-breadcrumb-item>
				</el-breadcrumb>
			</el-card>
		</el-row>
		<el-row>
			<span style="display: inline-block; padding: 6px; font-size: 22px">下载记录</span>
		</el-row>
		<el-row>
			<el-card shadow="never">
				<el-row>
					<el-table ref="ListTable" :data="tableData" style="width: 100%; min-height: 539px">
						<el-table-column prop="by" label="名字" show-overflow-tooltip></el-table-column>
						<el-table-column label="类型" sortable>
							<template slot-scope="scope">
								{{ scope.row.target_type == "book" ? "知识库" : "采集" }}
							</template>
						</el-table-column>
						<el-table-column prop="name" label="对象"></el-table-column>
						<el-table-column prop="create_at" label="下载时间" sortable :formatter="dateFormat"></el-table-column>
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
	import { download } from "@/api";
	import { mapState } from "vuex";
	export default {
		components: {
			layout,
		},
		data() {
			return {
				originData: [],
				currentPage: 1,
				pageSize: 10,
				pageSizes: [10, 20, 40, 60],
			};
		},
		computed: {
			...mapState(["current"]),
			tableData() {
				return this.originData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
			},
		},
		methods: {
			handleSizeChange(size) {
				this.pageSize = size;
			},
			handleCurrentChange(page) {
				this.currentPage = page;
			},
			dateFormat(row, col, cell) {
				return utils.formatDate(cell);
			},
			init() {
				this.originData = [];
				download
					.get(this.current.account)
					.then(res => {
						this.originData = res.data;
					})
					.catch(err => console.log(err));
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
