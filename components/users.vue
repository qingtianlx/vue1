<template>
  <el-card>
    <bread first="用户管理" last="用户列表"></bread>
    <!--<el-breadcrumb separator-class="el-icon-arrow-right">-->
      <!--<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
      <!--<el-breadcrumb-item>活动管理</el-breadcrumb-item>-->
      <!--<el-breadcrumb-item>活动列表</el-breadcrumb-item>-->
      <!--<el-breadcrumb-item>活动详情</el-breadcrumb-item>-->
    <!--</el-breadcrumb>-->
    <!--input输入框-->
    <el-row class="myrow">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button @click="searchdata" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="16">
        &nbsp;&nbsp;
        <el-button @click="addDialog = true" type="success" plain>成功按钮</el-button>
      </el-col>
    </el-row>
    <!--表格-->
    <el-table :data="datalist" border style="width: 100%">
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop="username" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180">
      </el-table-column>
      <el-table-column prop="mobile" label="电话">
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch @change="statechange (scope.row.id,scope.row.mg_state)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作"  width="200">
        <template slot-scope="scope">
          <el-row>
            <el-button @click="editData(scope.row.id)" size="mini" type="primary" icon="el-icon-edit" plain></el-button>
            <el-button @click="openrole(scope.row.id)" size="mini" type="success" icon="el-icon-check" plain></el-button>
            <el-button @click="delData(scope.row.id)" size="mini" type="danger" icon="el-icon-delete" plain></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <template>
      <div class="block">
        <el-pagination
          @size-change="sizechange"
          @current-change="currentchange"
          :current-page="pagenum"
          :page-sizes="[5,10]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </template>
    <!--添加面板-->
    <el-dialog title="添加用户" :visible.sync="addDialog">
      <el-form :model="addObj">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="addObj.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input v-model="addObj.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="addObj.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="addObj.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addcancel">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑面板-->
    <el-dialog title="编辑用户" :visible.sync="editDialog">
      <el-form :model="editObj">
        <el-form-item label="用户名" label-width="100px">
          <el-input :disabled="true" v-model="editObj.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="editObj.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="editObj.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>
    <!--设置用户角色面板-->
    <el-dialog title="设置用户角色" :visible.sync="roleDialog">
      <el-form :model="roleObj">
        <el-form-item label="用户名" label-width="100px">
          <label>{{roleObj.username}}</label>
        </el-form-item>
        <el-form-item label="分配角色" label-width="100px">
          {{roleObj.id}}
          <el-select v-model="roleObj.rid" placeholder="请选择">
            <el-option v-for="val in dropData" :key="val.id" :label="val.roleName" :value="val.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="changerole">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      search: '',
      pagenum: 1,
      pagesize: 5,
      total: 10,
      datalist: [],
      addDialog: false,
      editDialog: false,
      roleDialog: false,
      obj: {},
      addObj: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editObj: {
        username: '',
        email: '',
        mobile: ''
      },
      roleObj: {},
      dropData: []
    }
  },
  methods: {
    async getalllist () {
      var res = await this.$http.get(`/users?query=${this.search}&pagenum=${this.pagenum}&pagesize=${this.pagesize}}`, {
        headers: {
          'Authorization': window.localStorage.getItem('token')
        }
      })
      var {meta, data} = res.data
      if (meta.status === 200) {
        this.datalist = data.users
        this.total = data.total
      }
    },
    sizechange (pagesixe) {
      this.pagesize = pagesixe
      this.getalllist()
    },
    currentchange (pagenum) {
      this.pagenum = pagenum
      this.getalllist()
    },
    searchdata () {
      this.getalllist()
    },
    async addData () {
      this.addDialog = false
      var res = await this.$http.request({
        url: '/users',
        method: 'post',
        data: {
          username: this.addObj.username,
          password: this.addObj.password,
          email: this.addObj.email,
          mobile: this.addObj.mobile
        }

      })
      var { meta } = res.data
      if (meta.status === 201) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
        this.getalllist()
      } else {
        this.$message.error(meta.msg)
      }
    },
    addcancel () {
      this.addDialog = false
      this.clearObj(this.addObj)
    },
    clearObj (obj) {
      for (var item in obj) {
        obj[item] = ''
      }
    },
    async editData (id) {
      this.editDialog = true
      var res = await this.$http.request({
        url: `users/${id}`,
        method: 'get'
      })
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
        this.editObj = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async edit () {
      this.editDialog = false
      var res = await this.$http.request({
        url: `users/${this.editObj.id}`,
        method: 'put',
        data: {
          email: this.editObj.email,
          mobile: this.editObj.mobile
        }
      })
      var {meta} = res.data
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
        this.getalllist()
      } else {
        this.$message.error(meta.msg)
      }
    },
    async statechange (id, type) {
      var res = await this.$http.request({
        url: `users/${id}/state/${type}`,
        method: 'put'
      })
      var {meta} = res.data
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
      } else {
        this.$message.error(meta.msg)
      }
    },
    delData (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        await this.$http.request({
          url: `users/${id}`,
          method: 'delete'
        })
        this.getalllist()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async openrole (id) {
      this.roleDialog = true
      var res = await this.$http.request({
        url: `/users/${id}`,
        method: 'get'
      })
      this.roleObj = res.data.data
      // console.log(this.roleObj)
      this.roleData()
    },
    async roleData () {
      var res = await this.$http.request({
        url: `roles`,
        method: 'get'
      })
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.dropData = data
        // console.log(this.dropData);
      }
    },
    async changerole () {
      this.roleDialog = false
      var rid = this.roleObj.rid
      var id = this.roleObj.id
      var res = await this.$http.request({
        url: `users/${id}/role`,
        method: 'put',
        data: {
          rid: rid
        }
      })
      var {meta} = res.data
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
      } else {
        this.$message.error(meta.msg)
      }
      this.roleDialog = false
    }
  },
  mounted () {
    this.getalllist()
  }
}
</script>

<style>
  .myrow {
    margin-top: 20px;
  }
</style>
