<template>
  <el-card>
    <bread first="权限管理" last="权限列表"></bread>
    <el-row class="myrow">
      <el-col :span="24">
        <el-button plain>添加角色</el-button>
      </el-col>
    </el-row>
    <!--表格-->
    <el-table :data="rolesList" border style="width: 100%">
      <!--扩展项-->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="item1 in scope.row.children">
            <!--一级权限-->
            <el-col :span="4">
              <el-tag closable @close="delright(scope.row.id, item1.id, scope.row)">
                {{item1.authName}}--{{item1.id}}
              </el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <!--二级权限-->
            <el-col :span="20">
              <el-row v-for="item2 in item1.children">
                <el-col :span="5">
                  <el-tag closable type="success" @close="delright(scope.row.id, item2.id, scope.row)">
                    {{item2.authName}}--{{item2.id}}
                  </el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!--三级权限-->
                <el-col :span="19">
                  <el-tag closable v-for="item3 in item2.children" type="warning"
                          @close="delright(scope.row.id, item3.id, scope.row)">
                    {{item3.authName}}--{{item3.id}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <span v-if="scope.row.children.length===0">没有分配权限</span>
        </template>
      </el-table-column>
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称">
      </el-table-column>
      <el-table-column prop="roleDesc" label="角色描述">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button size="mini" type="primary" icon="el-icon-edit" plain></el-button>
            <el-button @click="openroles(scope.row.children,scope.row.id)" size="mini" type="success"
                       icon="el-icon-check" plain></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" plain></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!--分配权限面板-->
    <el-dialog title="分配权限" :visible.sync="roleDialog">
      <el-form>
        <el-tree ref="mytree"
                 :data="rightlist"
                 show-checkbox
                 node-key="id"
                 :default-checked-keys="defaultChecked"
                 :default-expand-all="true"
                 :props="defaultProps">
        </el-tree>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" @click="setrights">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [], // 角色+权限
      roleDialog: false,
      rightlist: [], // 权限列表
      defaultProps:
        {
          children: 'children',
          label: 'authName'
        },
      defaultChecked: [],
      roleId: ''
    }
  },
  methods: {
    async getallroles () {
      var res = await this.$http.request({
        url: `roles`,
        method: 'get'
      })
      var {meta, data} = res.data
      if (meta.status === 200) {
        this.rolesList = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async delright (roleId, rightId, rightData) {
      var res = await this.$http.request({
        url: `roles/${roleId}/rights/${rightId}`,
        method: 'delete'
      })
      var {meta, data} = res.data
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
        rightData.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    openroles (rights, id) {
      this.roleDialog = true
      this.roleId = id
      this.getallright()
      this.defaultChecked = []
      rights.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            this.defaultChecked.push(item3.id)
          })
        })
      })
    },
    async getallright () {
      var res = await this.$http.request({
        url: `rights/tree`,
        method: 'get'
      })
      var {meta, data} = res.data
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
        this.rightlist = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async setrights () {
      this.roleDialog = false
      var allchecked = this.$refs.mytree.getCheckedKeys()
      var halfchecked = this.$refs.mytree.getHalfCheckedKeys()
      var newchecked = allchecked.concat(halfchecked)
      newchecked.join(',')
      var res = await this.$http.request({
        url: `roles/${this.roleId}/rights`,
        method: 'post'
      })
      var {meta, data} = res.data
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
        this.rightlist = data
      } else {
        this.$message.error(meta.msg)
      }
    }
  },
  mounted () {
    this.getallroles()
  }
}
</script>

<style>
  .myrow {
    margin-top: 15px;
  }

  .el-tag {
    margin: 10px;
  }
</style>
