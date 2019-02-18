<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input
            placeholder="请输入内容"
            v-model="queryParams.query"
            @keyup.enter.native="getUserList"
            :clearable="true"
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="190"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="190"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="190"></el-table-column>
        <el-table-column label="状态" width="150">
          <el-switch slot-scope="info" v-model="info.row.mg_state"></el-switch>
        </el-table-column>
        <!-- 操作的代码 -->
        <el-table-column label="操作" width="260">
          <template slot-scope="info">
            <el-button type="primary" icon="el-icon-edit" @click="editUser(info.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="delUser(info.row.id)"></el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页的代码 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryParams.total"
      ></el-pagination>

      <!-- 点击添加按钮的弹出框 -->
      <el-dialog title="添加用户" :visible.sync="dialogVisible" width="40%" style="text-align:left">
        <el-form
          :model="addForm"
          :rules="addrules"
          ref="addFormRef"
          label-width="100px"
          @close="addDialogClose"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUserList">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户 -->
      <el-dialog title="修改用户" :visible.sync="editlogVisible" width="40%" style="text-align:left">
        <el-form
          :model="editForm"
          :rules="editrules"
          ref="addFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="editForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editlogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserList">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList()
  },
  data() {
    // 自定义校验器
    // 语法 var checkMobile = (rule, value被校验数据, callback回调函数)
    var checkMobile = (rule, value, callback) => {
      if (!/^1[35789]\d{9}$/.test(value)) {
        return callback(new Error('手机号码格式不正确'))
      }
      //  校验通过
      callback() // 继续执行
    }
    return {
      tableData: [],
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 3,
        total: 0
      },
      // 添加用户的弹窗控件
      dialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // form表单校验规则制作
      addrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户
      editlogVisible: false,
      editForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 首屏数据加载
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryParams
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.queryParams.total = res.data.total
      this.tableData = res.data.users
    },
    // 每页信息条数变化回调函数处
    handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`)
      this.queryParams.pagesize = val
      this.getUserList()
    },
    // 当前页码变化回调处理
    handleCurrentChange(val) {
      //   console.log(`当前页: ${val}`)
      this.queryParams.pagenum = val
      this.getUserList()
    },
    // 添加用户按钮addUserList
    addUserList() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('users', this.addForm)
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          this.dialogVisible = false
          this.$message.success(res.meta.msg)
          this.getUserList()
        }
      })
    },
    // 添加用户重置
    addDialogClose() {
      this.$refs.addFormRef.resetField()
    },
    // 删除用户
    delUser(id) {
      this.$confirm('删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.getUserList()
        })
        .catch(() => {})
    },
    // 修改用户
    async editUser(id) {
      this.editlogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
    },
    // 修改提交
    async editUserList() {
      const { data: res } = await this.$http.put('users/' + this.editForm.id, this.editForm)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editlogVisible = false
      this.getUserList()
      this.$message.success(res.meta.msg)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
