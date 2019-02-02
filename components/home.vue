<template>
    <div class="box1">
        <!--头部-->
        <el-container>
            <el-header>
                <headers></headers>
            </el-header>
            <el-container>
                <!--侧边栏-->
                <el-aside width="200px">
                    <sidebar></sidebar>
                </el-aside>
                <!--内容区域-->
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import sidebar from '@/components/sidebar.vue'
import headers from '@/components/headers.vue'
export default {
  components: {
    headers,
    sidebar
  },
  beforeCreate () {
    var token = window.localStorage.getItem('token')
    if (!token) {
      this.$message.error('您还没有登录~~~')
      this.$router.push('/')
    }
  }
}
</script>

<!-- scoped -->
<style >
    .box1 {
        height: 100%;
    }

    .el-container {
        height: 100%;
        background-color: #fff;
    }

    .title {
        text-align: center;
        font-size: 24px;
        color: #fff;
    }

    .logout {
        margin-right: 15px;
        font-size: 18px;
        text-align: right;
    }

    .logout a {
        color: #fff;
        text-decoration: none;
    }

    .logout a:hover {
        color: tomato;
    }

    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 50px;
        padding: 0;
    }

    .el-aside {
        background-color: #fff;
        color: #333;
        height: 100%;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        height: 100%;
    }
</style>
