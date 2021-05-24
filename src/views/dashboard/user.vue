<template>
	<layout :active="'/dashboard/users'" class="container">
		<el-row>
			<el-card shadow="never" :body-style="{ padding: '15px 20px' }">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item to="/dashboard">控制台</el-breadcrumb-item>
					<el-breadcrumb-item>用户管理</el-breadcrumb-item>
				</el-breadcrumb>
			</el-card>
		</el-row>
		<el-row>
			<span style="display: inline-block; padding: 6px; font-size: 22px">用户管理</span>
			<span style="float: right">
				<el-input style="width: 220px; margin-right: 10px" prefix-icon="el-icon-search" placeholder="搜索" clearable v-model="search"></el-input>
				<el-button @click="onNew">
					<span>添加用户</span>
				</el-button>
			</span>
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
							<el-dropdown-item :command="{ action: 'multiDelete', data: selected }" :disabled="selected.length == 0">批量删除</el-dropdown-item>
							<el-dropdown-item :command="{ action: 'multiForbid', data: selected }" :disabled="selected.length == 0">批量封禁</el-dropdown-item>
							<el-dropdown-item :command="{ action: 'multiActivate', data: selected }" :disabled="selected.length == 0">批量激活</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</span>
			</div>
			<el-card shadow="never">
				<el-row>
					<el-table
						ref="userList"
						:data="tableData"
						style="width: 100%; min-height: 709px"
						highlight-current-row
						@selection-change="handleSelectionChange"
						:default-sort="{ prop: 'last_login', order: 'descending' }"
					>
						<el-table-column type="selection" width="50"></el-table-column>
						<el-table-column prop="account" label="账号" show-overflow-tooltip></el-table-column>
						<el-table-column label="状态">
							<template slot-scope="scope">
								<el-tag v-if="scope.row.status != 'actived'" type="info" size="small">封禁</el-tag>
								<el-tag v-else type="success" size="small">正常</el-tag>
							</template>
						</el-table-column>
						<el-table-column prop="last_login" label="上次登录" sortable :formatter="dateFormat"> </el-table-column>
						<el-table-column label="操作" width="140" fixed="right">
							<template slot-scope="scope">
								<el-dropdown trigger="click" placement="bottom-start" @command="handleCommand">
									<el-button type="text" class="el-dropdown-link">选项<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item :command="{ action: 'onEdit', data: scope.row }">管理用户</el-dropdown-item>
										<el-dropdown-item v-if="scope.row.status == 'actived'" :command="{ action: 'onForbid', data: scope.row }"
											>封禁帐号</el-dropdown-item
										>
										<el-dropdown-item v-else :command="{ action: 'onActivate', data: scope.row }">激活账号</el-dropdown-item>
										<el-dropdown-item :command="{ action: 'onDelete', data: scope.row }">删除用户</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
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
						layout="total, sizes, ->, jumper, prev, pager, next"
						:hide-on-single-page="true"
						:total="filterData.length"
					>
					</el-pagination>
				</el-row>
			</el-card>
		</el-row>
		<div name="dialogs">
			<el-dialog :visible.sync="editDialog" width="50%">
				<el-form :model="editForm" ref="editForm" :rules="rules">
					<el-form-item label="账号" prop="account">
						<el-input v-model="editForm.account" placeholder="请输入账号" :disabled="!isAdd"></el-input>
					</el-form-item>
					<el-form-item label="邮箱" prop="email">
						<el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input v-model="editForm.password" :placeholder="isAdd ? '请输入密码' : '留空则不修改'"></el-input>
					</el-form-item>
					<el-collapse>
						<el-collapse-item title="其他选项">
							<el-form-item label="名字" prop="name">
								<el-input v-model="editForm.name" placeholder="真实名字"></el-input>
							</el-form-item>
							<el-form-item label="网址" prop="site">
								<el-input v-model="editForm.site" placeholder="个人网址"></el-input>
							</el-form-item>
							<el-form-item label="描述信息" prop="description">
								<el-input type="textarea" v-model="editForm.description" placeholder="描述信息" row="3"></el-input>
							</el-form-item>
							<el-form-item label="身份" prop="role">
								<el-radio v-model="editForm.role" label="normal">普通用户</el-radio>
								<el-radio v-model="editForm.role" label="admin">管理员</el-radio>
							</el-form-item>
							<el-form-item label="状态" prop="status">
								<el-radio v-model="editForm.status" label="actived">正常</el-radio>
								<el-radio v-model="editForm.status" label="forbidden">封禁</el-radio>
							</el-form-item>
							<el-form-item label="是否公开名字" prop="option.is_name_public">
								<el-switch v-model="editForm.option.is_name_public"></el-switch>
							</el-form-item>
							<el-form-item label="是否公开邮箱" prop="option.is_public_email">
								<el-switch v-model="editForm.option.is_public_email"></el-switch>
							</el-form-item>
							<el-form-item label="邮箱是否激活" prop="option.is_email_active">
								<el-switch v-model="editForm.option.is_email_active"></el-switch>
							</el-form-item>
						</el-collapse-item>
					</el-collapse>
				</el-form>
				<span slot="footer">
					<el-button size="small" @click="editDialog = false">取消</el-button>
					<el-button v-if="isAdd" size="small" type="primary" @click="onAdd">确定</el-button>
					<el-button v-else size="small" type="primary" @click="onSave">确定</el-button>
				</span>
			</el-dialog>
		</div>
	</layout>
</template>

<script>
	import layout from "@/views/dashboard/layout";
	import { mapState } from "vuex";
	import utils from "@/assets/js/utils";
	import User from "@/api/rules/user";
	export default {
		components: {
			layout,
		},
		data() {
			return {
				selectAll: false,
				originData: [],
				search: "",
				searchBy: ["account", "name", "description"],
				currentPage: 1,
				pageSize: 10,
				pageSizes: [10, 20, 40, 60],
				selected: [],
				editDialog: false,
				isAdd: false,
				editForm: {
					_id: "",
					account: "",
					email: "",
					password: "",
					role: "normal",
					name: "",
					site: "",
					description: "",
					status: "actived",
					option: {
						is_public_email: false,
						is_email_active: false,
						is_name_public: false,
					},
				},
				rules: {
					account: [{ required: true, message: "账号不能为空", trigger: "blur" }],
					email: [{ required: true, trigger: "blur", type: "email", message: "请输入正确的邮箱" }],
					password: [
						{ required: true, message: "密码不能为空", trigger: "blur" },
						{ min: 6, max: 18, message: "密码长度为6-18位", trigger: "blur" },
					],
				},
			};
		},
		computed: {
			...mapState(["current", "isLogin"]),
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
				this.$refs.userList.clearSelection();
				if (flag) {
					this.$refs.userList.toggleAllSelection();
				}
			},
		},
		methods: {
			handleSelectionChange(val) {
				this.selected = val;
			},
			handleCommand(command) {
				this[command.action].call(this, command.data);
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
			onDelete(user) {
				this.$confirm(`确定要删除用户${user.account}吗，将会一并删除该账号的所有信息。`).then(async () => {
					const loading = this.$loading({
						lock: true,
					});
					await User.remove([user._id]);
					this.init();
					loading.close();
					this.$message({ type: "success", message: "删除成功" });
				});
			},
			multiDelete(array) {
				this.$confirm(`确定要删除选中用户吗，将会一并删除账号的所有信息。`).then(async () => {
					const loading = this.$loading({
						lock: true,
					});
					let list = [];
					array.forEach(user => list.push(user._id));
					await User.remove(list);
					this.init();
					loading.close();
					this.$message({ type: "success", message: "删除成功" });
				});
			},
			async onNew() {
				this.rules.password = [
					{ required: true, message: "密码不能为空", trigger: "blur" },
					{ min: 6, max: 18, message: "密码长度为6-18位", trigger: "blur" },
				];
				this.isAdd = true;
				this.editDialog = true;
				await this.$nextTick(() => {
					this.$refs.editForm.resetFields();
				});
			},
			async onEdit(user) {
				this.rules.password = [];
				this.isAdd = false;
				this.editDialog = true;
				await this.$nextTick(() => {
					this.$refs.editForm.resetFields();
				});
				for (const key in this.editForm) {
					if (Object.hasOwnProperty.call(this.editForm, key)) {
						this.editForm[key] = user[key];
					}
				}
				this.editForm.password = "";
			},
			async onForbid(user) {
				const loading = this.$loading({
					lock: true,
				});
				let { account } = user;
				let status = "forbidden";
				await User.update({ account, status });
				this.init();
				loading.close();
				this.$message({ type: "success", message: "封禁成功" });
			},
			multiForbid(list) {
				const loading = this.$loading({
					lock: true,
				});
				list.forEach(async user => {
					let { account } = user;
					let status = "forbidden";
					await User.update({ account, status });
				});
				this.init();
				loading.close();
				this.$message({ type: "success", message: "封禁成功" });
			},
			async onActivate(user) {
				const loading = this.$loading({
					lock: true,
				});
				let { account } = user;
				let status = "actived";
				await User.update({ account, status });
				this.init();
				loading.close();
				this.$message({ type: "success", message: "激活成功" });
			},
			multiActivate(list) {
				const loading = this.$loading({
					lock: true,
				});
				list.forEach(async user => {
					let { account } = user;
					let status = "actived";
					await User.update({ account, status });
				});
				this.init();
				loading.close();
				this.$message({ type: "success", message: "激活成功" });
			},
			onAdd() {
				this.$refs.editForm.validate(async valid => {
					if (valid) {
						const loading = this.$loading({ lock: true });
						User.insert(this.editForm)
							.then(() => {
								this.init();
								this.editDialog = false;
								loading.close();
								this.$message({ type: "success", message: "添加成功" });
							})
							.catch(err => {
								loading.close();
								if (err.status == 500) {
									return this.$message({ type: "error", message: "服务器出错，请稍后再试" });
								}
								this.$message(err.data.message);
							});
					} else return false;
				});
			},
			onSave() {
				this.$refs.editForm.validate(async valid => {
					if (valid) {
						const loading = this.$loading({ lock: true });
						console.log(this.editForm);
						User.update(this.editForm)
							.then(() => {
								this.init();
								this.editDialog = false;
								loading.close();
								this.$message({ type: "success", message: "修改成功" });
							})
							.catch(err => {
								loading.close();
								console.log(err.data);
								if (err.status == 500) {
									return this.$message({ type: "error", message: "服务器出错，请稍后再试" });
								}
								this.$message(err.data.message);
							});
					} else return false;
				});
			},
			init() {
				User.getAll().then(res => {
					this.originData = res.data;
				});
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
	.action-bar {
		margin-bottom: 15px;
		span + span {
			margin-left: 10px;
		}
	}
	.el-dropdown-link {
		cursor: pointer;
		color: #409eff;
	}
	.el-icon-arrow-down {
		font-size: 12px;
	}
</style>
