<template>
    <el-row>
        <el-col :span="4">
            <div><img src="@/assets/images/logo.png"></div>
        </el-col>
        <el-col :span="18">
            <div class="title">电商后台管理系统</div>
        </el-col>
        <el-col :span="2">
            <div class="logout">
                <a href="#" @click.prevent="logout">退出</a>
            </div>
        </el-col>
    </el-row>
</template>

<script>
export default {
  methods: {
    logout () {
      this.$confirm('确定退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
        window.localStorage.removeItem('token')
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>

<style>

</style>
