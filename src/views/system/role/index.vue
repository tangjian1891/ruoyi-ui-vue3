<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryFormRef" v-show="showSearch" :inline="true">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限字符" prop="roleKey">
        <el-input
          v-model="queryParams.roleKey"
          placeholder="请输入权限字符"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="角色状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          :loading="btnLoading"
          @click="handleAdd"
          v-hasPermi="['system:role:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :loading="btnLoading"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:role:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:role:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['system:role:export']"
        >导出</el-button>
      </el-col>
      <RightToolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="角色编号" prop="roleId" width="120" />
      <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="显示顺序" prop="roleSort" width="100" />
      <el-table-column label="状态" align="center" width="100">
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <template v-if="scope.row.roleId !== 1">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:role:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:role:remove']"
            >删除</el-button>
            <template v-hasPermi="['system:role:edit']">
              <el-dropdown size="mini" @command="command => handleCommand(command, scope.row)">
                <span class="el-dropdown-link">
                  <i class="el-icon-d-arrow-right el-icon--right"></i>更多
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      command="handleDataScope"
                      icon="el-icon-circle-check"
                      v-hasPermi="['system:role:edit']"
                    >数据权限</el-dropdown-item>
                    <el-dropdown-item
                      command="handleAuthUser"
                      icon="el-icon-user"
                      v-hasPermi="['system:role:edit']"
                    >分配用户</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item prop="roleKey">
          <template #label>
            <span>
              <el-tooltip
                content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)"
                placement="top"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>权限字符
            </span>
          </template>
          <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
        </el-form-item>
        <el-form-item label="角色顺序" prop="roleSort">
          <el-input-number v-model="form.roleSort" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox
            v-model="menuNodeAll"
            @change="handleCheckedTreeNodeAll($event, 'menu')"
          >全选/全不选</el-checkbox>
          <el-checkbox
            v-model="form.menuCheckStrictly"
            @change="handleCheckedTreeConnect($event, 'menu')"
          >父子联动</el-checkbox>
          <el-tree
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            ref="menuRef"
            node-key="id"
            :check-strictly="!form.menuCheckStrictly"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分配角色数据权限对话框 -->
    <el-dialog :title="title" v-model="openDataScope" width="500px" append-to-body>
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="form.roleKey" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限范围">
          <el-select v-model="form.dataScope" @change="dataScopeSelectChange">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限" v-show="form.dataScope == 2">
          <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展开/折叠</el-checkbox>
          <el-checkbox
            v-model="deptNodeAll"
            @change="handleCheckedTreeNodeAll($event, 'dept')"
          >全选/全不选</el-checkbox>
          <el-checkbox
            v-model="form.deptCheckStrictly"
            @change="handleCheckedTreeConnect($event, 'dept')"
          >父子联动</el-checkbox>
          <el-tree
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            default-expand-all
            ref="deptRef"
            node-key="id"
            :check-strictly="!form.deptCheckStrictly"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitDataScope">确 定</el-button>
          <el-button @click="cancelDataScope">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
 <script lang="ts">
export default {
  name: "role"
}
</script>
<script lang="ts" setup>
import RightToolbar from '../../../components/RightToolbar/index.vue'
import { listRole, getRole, delRole, addRole, updateRole, dataScope, changeRoleStatus } from "@/api/system/role";
import { treeselect as menuTreeselect, roleMenuTreeselect } from "@/api/system/menu";
import { treeselect as deptTreeselect, roleDeptTreeselect } from "@/api/system/dept";
import { downLoadExcel } from "@/utils/download";
import { reactive, Ref, ref, toRefs } from "@vue/reactivity";
import { getCurrentInstance, nextTick, onMounted, watch, watchEffect } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import { useLoading } from "@/hooks/useHooks";

const initForm = () => {
  return {
    roleId: undefined,
    roleName: undefined,
    roleKey: undefined,
    roleSort: 0,
    status: "0",
    menuIds: [],
    deptIds: [],
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    remark: undefined,
  }
}

const data = reactive({
  // 遮罩层
  loading: true,
  // 导出遮罩层
  exportLoading: false,
  // 按钮loading
  btnLoading: false,
  // 选中数组
  ids: [],
  // 非单个禁用
  single: true,
  // 非多个禁用
  multiple: true,
  // 显示搜索条件
  showSearch: true,
  // 总条数
  total: 0,
  // 角色表格数据
  roleList: [],
  // 弹出层标题
  title: "",
  // 是否显示弹出层
  open: false,
  // 是否显示弹出层（数据权限）
  openDataScope: false,
  menuExpand: false,
  menuNodeAll: false,
  deptExpand: true,
  deptNodeAll: false,
  // 日期范围
  dateRange: [],
  // 状态数据字典
  statusOptions: [],
  // 数据范围选项
  dataScopeOptions: [
    {
      value: "1",
      label: "全部数据权限",
    },
    {
      value: "2",
      label: "自定数据权限",
    },
    {
      value: "3",
      label: "本部门数据权限",
    },
    {
      value: "4",
      label: "本部门及以下数据权限",
    },
    {
      value: "5",
      label: "仅本人数据权限",
    },
  ],
  // 菜单列表
  menuOptions: [],
  // 部门列表
  deptOptions: [],
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    roleName: undefined,
    roleKey: undefined,
    status: undefined,
  },
  // 表单参数
  form: initForm(),
  defaultProps: {
    children: "children",
    label: "label",
  },
  // 表单校验
  rules: {
    roleName: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
    roleKey: [{ required: true, message: "权限字符不能为空", trigger: "blur" }],
    roleSort: [{ required: true, message: "角色顺序不能为空", trigger: "blur" }],
  },
});

const { loading, btnLoading, openLoading, closeLoading } = useLoading()

const { exportLoading, single, multiple, showSearch, total, roleList, title, open, openDataScope, menuExpand, menuNodeAll, deptExpand, deptNodeAll, dateRange, statusOptions, dataScopeOptions, menuOptions, deptOptions, queryParams, form, defaultProps, rules } = toRefs(data) //仅供模板使用
const instance = getCurrentInstance();
const router = useRouter();
const queryFormRef: Ref = ref(null);
const menuRef: Ref = ref(null);
const formRef: Ref = ref(null);
const deptRef: Ref = ref(null);
const { addDateRange, getDicts, $confirm, msgSuccess, resetForm } = instance.appContext.config.globalProperties;
onMounted(() => {
  getList();
  getDicts("sys_normal_disable").then(response => {
    data.statusOptions = response.data;
  });
});


/** 查询角色列表 */
async function getList() {
  openLoading()
  const response = await listRole(addDateRange(queryParams, dateRange))
  data.roleList = response.rows;
  data.total = response.total;
  closeLoading()
}

/** 查询菜单树结构 */
function getMenuTreeselect() {
  menuTreeselect().then(response => {
    data.menuOptions = response.data;
  });
}


// 所有菜单节点数据
function getMenuAllCheckedKeys() {
  // 目前被选中的菜单节点
  let checkedKeys = menuRef.value.getCheckedKeys();
  // 半选中的菜单节点
  let halfCheckedKeys = menuRef.value.getHalfCheckedKeys();
  console.log(checkedKeys)
  console.log(halfCheckedKeys)
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}
// 所有部门节点数据
function getDeptAllCheckedKeys() {
  // 目前被选中的部门节点
  let checkedKeys = deptRef.value.getCheckedKeys();
  // 半选中的部门节点
  let halfCheckedKeys = deptRef.value.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}

// 角色状态修改
function handleStatusChange(row) {
  let text = row.status === "0" ? "启用" : "停用";
  $confirm('确认要"' + text + '""' + row.roleName + '"角色吗?', "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(function () {
      return changeRoleStatus(row.roleId, row.status);
    })
    .then(() => {
      msgSuccess(text + "成功");
    })
    .catch(function () {
      row.status = row.status === "0" ? "1" : "0";
    });
}
// 取消按钮
function cancel() {
  data.open = false;
  reset();
}

// 取消按钮（数据权限）
function cancelDataScope() {
  data.openDataScope = false;
  reset();
}

// 弹窗表单重置
function reset() {
  if (menuRef.value != undefined) {
    menuRef.value.setCheckedKeys([]);
  }
  data.menuExpand = data.menuNodeAll = data.deptNodeAll = false;
  data.deptExpand = true;
  data.form = initForm() //使用初始化数据覆盖form表单
  resetForm("form");
}

/** 搜索按钮操作 */
function handleQuery() {
  data.queryParams.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  data.dateRange = [];
  resetForm(queryFormRef);
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  data.ids = selection.map(item => item.roleId);
  data.single = selection.length != 1;
  data.multiple = !selection.length;
}

// 更多操作触发
function handleCommand(command, row) {
  switch (command) {
    case "handleDataScope":
      handleDataScope(row);
      break;
    case "handleAuthUser":
      handleAuthUser(row);
      break;
    default:
      break;
  }
}
// 树权限（展开/折叠） 有且仅展开第一层 。内部可去到所有节点
function handleCheckedTreeExpand(value, type) {
  if (type == "menu") {
    let treeList = data.menuOptions;
    for (let i = 0; i < treeList.length; i++) {
      menuRef.value.store.nodesMap[treeList[i].id].expanded = value;
    }
  } else if (type == "dept") {
    let treeList = data.deptOptions;
    for (let i = 0; i < treeList.length; i++) {
      deptRef.value.store.nodesMap[treeList[i].id].expanded = value;
    }
  }
}

// 树权限（全选/全不选）
function handleCheckedTreeNodeAll(value, type) {
  console.log("这是什么value", value)
  if (type == "menu") {
    menuRef.value.setCheckedNodes(value ? data.menuOptions : []);
  } else if (type == "dept") {
    deptRef.value.setCheckedNodes(value ? data.deptOptions : []);
  }
}

// 树权限（父子联动）
function handleCheckedTreeConnect(value, type) {
  if (type == "menu") {
    data.form.menuCheckStrictly = value ? true : false;
  } else if (type == "dept") {
    data.form.deptCheckStrictly = value ? true : false;
  }
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  getMenuTreeselect();
  data.open = true;
  data.title = "添加角色";
}

/** 修改按钮操作 */
async function handleUpdate(row) {
  reset();
  const roleId = row.roleId || data.ids;
  openLoading()
  // 获取用户权限树(),获取用户角色
  const [roleMenu, response] = await Promise.all([roleMenuTreeselect(roleId), getRole(roleId)])
  data.form = response.data;

  data.open = true;


  data.menuOptions = roleMenu.data.menus;
  let checkedKeys = roleMenu.data.checkedKeys;
  checkedKeys.forEach(v => {
    nextTick(() => {
      menuRef.value.setChecked(v, true, false);
    });
  });
  closeLoading()
  data.title = "修改角色";
}

/** 选择角色权限范围触发 */
function dataScopeSelectChange(value) {
  if (value !== "2") {
    deptRef.value.setCheckedKeys([]);
  }
}

/** 分配数据权限操作 */
async function handleDataScope(row) {
  reset();
  // 根据id查询部门树结构，查询改角色相关信息
  const [deptRes, roleRes] = await Promise.all([roleDeptTreeselect(row.roleId), getRole(row.roleId)])
  data.deptOptions = deptRes.data.depts; //部门树
  data.openDataScope = true; //
  await nextTick()
  deptRef.value.setCheckedKeys(deptRes.data.checkedKeys);//选中的部门树

  data.form = roleRes.data;//角色相关信息

  data.title = "分配数据权限";
}

/** 分配用户操作 */
function handleAuthUser(row) {
  const roleId = row.roleId;
  router.push("/system/role-auth/user/" + roleId);
}

/** 提交按钮 */
function submitForm() {
  formRef.value.validate(async valid => {
    if (valid) {
      data.form.menuIds = getMenuAllCheckedKeys();
      if (data.form.roleId != undefined) {
        await updateRole(data.form)
        msgSuccess("修改成功");
      } else {
        await addRole(data.form)
        msgSuccess("新增成功");
      }
      data.open = false;
      getList();
    }
  });
}

/** 提交按钮（数据权限） */
function submitDataScope() {
  if (this.form.roleId != undefined) {
    data.form.deptIds = getDeptAllCheckedKeys();
    dataScope(this.form).then(response => {
      msgSuccess("修改成功");
      data.openDataScope = false;
      getList();
    });
  }
}
/** 删除按钮操作 */
function handleDelete(row) {
  const roleIds = row.roleId || this.ids;
  $confirm('是否确认删除角色编号为"' + roleIds + '"的数据项?', "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(function () {
      return delRole(roleIds);
    })
    .then(() => {
      getList();
      msgSuccess("删除成功");
    });
}

/** 导出按钮操作 */
function handleExport() {
  downLoadExcel("/system/role/export", queryParams);
}
</script>
