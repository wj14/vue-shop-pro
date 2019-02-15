<template>
  <el-container>
    <el-header>
      <div id="logo_box">
        <img src="../assets/img/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="menushow?'65px':'200px'">
        <div
          style="color:white;text-align:center;line-height:25px;height:25px;background-color:rgb(74, 80, 100);font-size:12px;letter-spacing:0.1em;cursor:pointer;user-select:none;"
          @click="menushow=!menushow"
        >|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          :style="menushow?'width:65px;':'width:200px;'"
          active-text-color="#409EFF"
          :collapse="menushow"
          :collapse-transition="false"
          :unique-opened="true"
        >
          <el-submenu :index="item.id+''" v-for="(item,k) in menuList" :key="item.id">
            <template slot="title">
              <i :class="'iconfont icon-' + menuicon[k]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              :index="item.id + '-' + item2.id"
              v-for="item2 in item.children"
              :key="item2.id"
            >
              <i :class="'iconfont icon-' + menuicon[k]"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList()
  },
  data() {
    return {
      menushow: false,
      menuList: [],
      menuicon: ['users', 'tijikongjian', 'shangpin', 'danju', 'baobiao'] // 左侧权限图标
    }
  },
  methods: {
    loginOut() {
      this.$confirm('确认要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          sessionStorage.removeItem('token')
          this.$router.push('/login')
        })
        .catch(() => {})
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menuList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: rgb(55, 61, 65);
    padding: 0;
    padding-right: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    #logo_box {
      color: #fff;
      font-size: 22px;
      user-select: none;
      display: flex;
      align-items: center;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    text-align: left;
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
