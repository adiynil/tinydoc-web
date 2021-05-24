<template>
	<layout :active="'/dashboard/collections'" class="container">
		<el-row>
			<el-card shadow="never" :body-style="{ padding: '15px 20px' }">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item to="/dashboard">控制台</el-breadcrumb-item>
					<el-breadcrumb-item to="/dashboard/collections">采集任务</el-breadcrumb-item>
				</el-breadcrumb>
			</el-card>
		</el-row>
		<el-row>
			<span style="display: inline-block; padding: 6px; font-size: 22px">采集任务</span>
			<span style="float: right">
				<el-input style="width: 220px; margin-right: 10px" prefix-icon="el-icon-search" placeholder="搜索" clearable v-model="searchText"></el-input>
				<el-button @click="openAdd">
					<span>新建采集</span>
				</el-button>
			</span>
		</el-row>
		<el-row>
			<el-card shadow="never" :body-style="{ padding: '20px' }">
				<el-row>
					<el-table :data="tableData" style="width: 100%; min-height: 698px" highlight-current-row>
						<el-table-column label="名称">
							<template slot-scope="scope">
								<span style="cursor: pointer" @click="$router.push('/dashboard/collections/' + scope.row.code)">{{ scope.row.title }}</span>
							</template>
						</el-table-column>
						<el-table-column label="截止日期" width="200">
							<template slot-scope="scope">
								{{ scope.row.create_at | dateFormat(scope.row.expires_in) }}
							</template>
						</el-table-column>
						<el-table-column label="状态" width="100">
							<template slot-scope="scope">
								<el-tag v-if="isExpired(scope.row.create_at, scope.row.expires_in)" type="info" size="small">已完成</el-tag>
								<el-tag v-else type="success" size="small">采集中</el-tag>
							</template>
						</el-table-column>
						<el-table-column prop="times" label="次数"></el-table-column>
						<el-table-column label="操作" fixed="right" width="150">
							<template slot-scope="scope">
								<el-button type="text" @click="$router.push('/dashboard/collections/' + scope.row.code)">详情</el-button>
								<el-dropdown trigger="click" placement="bottom-start" @command="handleCommand">
									<el-button type="text" class="el-dropdown-link">选项<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item :command="{ action: 'onEdit', data: scope.row }">管理任务</el-dropdown-item>
										<el-dropdown-item :command="{ action: 'onDownload', data: scope.row }">打包下载</el-dropdown-item>
										<el-dropdown-item :command="{ action: 'onCopy', data: scope.row }">复制链接</el-dropdown-item>
										<el-dropdown-item v-if="!isExpired(scope.row.create_at, scope.row.expires_in)" :command="{ action: 'onStop', data: scope.row }"
											>停止采集</el-dropdown-item
										>
										<el-dropdown-item :command="{ action: 'onDelete', data: scope.row }">删除任务</el-dropdown-item>
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
						:hide-on-single-page="true"
						layout="total, sizes, ->, jumper, prev, pager, next"
						:total="filterData.length"
						background
					>
					</el-pagination>
				</el-row>
				<div name="dialog">
					<el-dialog :visible.sync="editDialog" width="60%">
						<div class="form">
							<el-form ref="collectionForm" :rules="rules" :model="form">
								<el-form-item label="标题" prop="title">
									<el-input v-model="form.title" placeholder="请输入标题" required></el-input>
								</el-form-item>
								<el-form-item v-if="!isAdd">
									<el-tag style="margin-right: 5px">{{ host + "/submit/" + form.code }}</el-tag>
									<el-button size="small" type="primary" plain icon="el-icon-document-copy" @click="onCopy(form)"></el-button>
								</el-form-item>
								<el-form-item label="有效时间(天)" prop="expires_in">
									<el-input-number v-model="form.expires_in" size="mini" :min="0" :step="1" controls-position="both"> </el-input-number>
								</el-form-item>
								<el-collapse accordion>
									<el-collapse-item>
										<template slot="title"> 高级设置<i class="el-icon-s-operation head-icon"></i> </template>
										<el-form-item label="是否允许重复" prop="is_allow_repeat">
											<el-switch v-model="form.is_allow_repeat"> </el-switch>
										</el-form-item>
										<el-form-item label="是否允许提交空文档" prop="is_allow_empty">
											<el-switch v-model="form.is_allow_empty"> </el-switch>
										</el-form-item>
									</el-collapse-item>
								</el-collapse>
							</el-form>
						</div>
						<span slot="footer" class="dialog-footer">
							<el-button size="small" @click="editDialog = false">取消</el-button>
							<el-button v-if="isAdd" size="small" type="primary" @click="onAdd">确定</el-button>
							<el-button v-else size="small" type="primary" @click="onSave">确定</el-button>
						</span>
					</el-dialog>
				</div>
			</el-card>
		</el-row>
	</layout>
</template>

<script>
	import layout from "@/views/dashboard/layout";
	import { customAlphabet } from "nanoid";
	let nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 12);
	import { copy, formatDate } from "@/assets/js/utils";
	import { mapState } from "vuex";
	import { collection, download } from "@/api";
	export default {
		components: { layout },
		data() {
			return {
				editDialog: false,
				isAdd: false,
				searchText: "",
				host: window.location.protocol + "//" + window.location.host,
				pageConf: {
					pageSize: 10,
					currentPage: 1,
					pageSizes: [10, 20, 40, 60],
				},
				collectionList: [],
				form: {
					_id: "",
					title: "",
					account: "",
					code: nanoid(),
					is_allow_empty: false,
					is_allow_repeat: true,
					expires_in: 7,
				},
				rules: {
					title: [{ required: true, message: "名称是必须的", trigger: "blur" }],
				},
			};
		},
		computed: {
			...mapState(["current"]),
			filterData() {
				return this.collectionList.filter(item => !this.searchText || item.title.toLowerCase().includes(this.searchText.toLowerCase()));
			},
			tableData() {
				return this.filterData.slice((this.pageConf.currentPage - 1) * this.pageConf.pageSize, this.pageConf.currentPage * this.pageConf.pageSize);
			},
		},
		filters: {
			dateFormat(create_at, expires_in) {
				return formatDate(new Date(create_at).getTime() + expires_in * 1000 * 60 * 60 * 24);
			},
		},
		methods: {
			generateCode() {
				this.form.code = nanoid();
			},
			sizeChange(size) {
				this.pageConf.pageSize = size;
			},
			currentChange(page) {
				this.pageConf.currentPage = page;
			},
			isExpired(create_at, expires_in) {
				let now = new Date().getTime();
				if (now > new Date(create_at).getTime() + expires_in * 1000 * 60 * 60 * 24) {
					return true;
				}
				return false;
			},
			handleCommand(command) {
				this[command.action].call(this, command.data);
			},
			onEdit(row) {
				this.openEdit(row);
			},
			onCopy(row) {
				copy(this.host + "/submit/" + row.code)
					.then(() => {
						this.$message({ type: "success", message: "复制成功" });
					})
					.catch(() => {
						this.$message({
							type: "error",
							message: "复制失败，浏览器不支持",
						});
					});
			},
			onDelete(row) {
				this.$confirm("确定要删除这个采集任务吗，请确保你已经备份了文档数据").then(() => {
					collection
						.remove([row._id])
						.then(() => {
							this.init();
							this.$message({ type: "success", message: "删除成功" });
						})
						.catch(() => {});
				});
			},
			onStop(row) {
				let { _id, title, is_allow_empty, is_allow_repeat, expires_in } = row;
				let data = { _id, title, is_allow_empty, is_allow_repeat, expires_in };
				data.expires_in = 0;
				collection
					.update(data)
					.then(() => {
						this.init();
						this.$message({
							type: "success",
							message: "操作成功",
						});
					})
					.catch(err => console.log(err));
			},
			onDownload(row) {
				let target_id = row._id,
					target_type = "collection",
					by = this.current.account,
					account = row.account,
					name = row.title;
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
			async openAdd() {
				this.isAdd = true;
				this.editDialog = true;
				await this.$nextTick(() => {
					this.$refs.collectionForm.resetFields();
				});
				this.generateCode();
			},
			async openEdit(row) {
				this.isAdd = false;
				this.editDialog = true;
				await this.$nextTick(() => {
					this.$refs.collectionForm.resetFields();
				});
				let { _id, title, account, code, is_allow_empty, is_allow_repeat, expires_in } = row;
				this.form._id = _id;
				this.form.title = title;
				this.form.account = account;
				this.form.code = code;
				this.form.is_allow_empty = is_allow_empty;
				this.form.is_allow_repeat = is_allow_repeat;
				this.form.expires_in = expires_in;
			},
			onAdd() {
				this.$refs.collectionForm.validate(valid => {
					if (!valid) return false;
					let { account, title, code, is_allow_empty, is_allow_repeat, expires_in } = this.form;
					let data = { account, title, code, is_allow_empty, is_allow_repeat, expires_in };
					collection
						.insert(data)
						.then(() => {
							this.init();
							this.$message({
								type: "success",
								message: "添加成功",
							});
							this.editDialog = false;
						})
						.catch(err => console.log(err));
				});
			},
			onSave() {
				this.$refs.collectionForm.validate(valid => {
					if (!valid) return false;
					let { _id, title, is_allow_empty, is_allow_repeat, expires_in } = this.form;
					let data = { _id, title, is_allow_empty, is_allow_repeat, expires_in };
					collection
						.update(data)
						.then(() => {
							this.init();
							this.$message({
								type: "success",
								message: "修改成功",
							});
							this.editDialog = false;
						})
						.catch(err => console.log(err));
				});
			},
			getList() {
				let { account } = this.current;
				collection
					.getByAccount(account)
					.then(res => {
						this.collectionList = res.data;
						// console.log(res.data);
					})
					.catch(err => console.log(err));
			},
			init() {
				this.form.account = this.current.account;
				this.getList();
			},
		},
		created() {
			this.init();
		},
	};
</script>

<style scoped lang="scss">
	.form {
		.el-form-item {
			margin-bottom: 10px;
		}
	}
	.el-dropdown-link {
		margin-left: 10px;
		cursor: pointer;
		color: #409eff;
	}
	.el-icon-arrow-down {
		font-size: 12px;
	}
</style>
