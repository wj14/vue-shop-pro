<template>
  <div id="login-container">
    <div id="login-box">
      <div id="login-logo">
        <img src="../assets/img/logo.png" alt>
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="el-input__icon iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password">
            <i slot="prefix" class="el-input__icon iconfont icon-password"></i>
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :offset="7">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetForm">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (valid === true) {
          const { data: res } = await this.$http.post('login', this.loginForm)
          if (res.meta.status !== 200) {
            return this.$message.error('用户名或密码不存在')
          }
          sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
          console.log(res)
        }
      })
    },
    resetForm() {
      this.$refs.loginForm.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
#login-container {
  background-color: #2b4b6b;
  height: 100%;
  margin: 0;
  padding: 0;
  #login-box {
    background-color: #fff;
    width: 450px;
    height: 304px;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    #login-logo {
      width: 130px;
      height: 130px;
      background-color: #fff;
      border-radius: 50%;
      border: 1px solid #eee;
      box-shadow: 0 0 10px #eee;
      position: absolute;
      left: 50%;
      top: -50%;
      transform: translate(-50%, 50%);
      padding: 10px;
      img {
        width: 100%;
        border-radius: 50%;
      }
    }
    .el-form {
      width: 100%;
      padding: 20px;
      position: absolute;
      bottom: 0;
      box-sizing: border-box;
    }
  }
}
</style>
