<template>
  <el-card>
    <bread first="权限管理" last="权限列表"></bread>
    <!--表格-->
    <el-table :data="rightslist" border style="width: 100%">
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180">
      </el-table-column>
      <el-table-column prop="path" label="路径" width="180">
      </el-table-column>
      <el-table-column prop="level" label="层次">
        <template slot-scope="scope">
          <span v-if="scope.row.level==='0'">一级</span>
          <span v-else-if="scope.row.level==='1'">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      rightslist: []
    }
  },
  methods: {
    async getallright () {
      var res = await this.$http.request({
        url: `rights/list`,
        method: 'get'
      })
      var {meta, data} = res.data
      if (meta.status === 200) {
        this.rightslist = data
        console.log(this.rightslist)
      } else {
        this.$message.error(meta.msg)
      }
    }
  },
  mounted () {
    this.getallright()
  }
}
</script>

<style>

</style>
