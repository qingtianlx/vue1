<template>
  <el-card>
    <bread first="商品管理" last="商品列表"></bread>
    <!--消息提示框-->
    <el-alert title="添加商品信息" type="info" center show-icon>
    </el-alert>
    <!--步骤条-->
    <el-steps :active="active" align-center finish-status="success">
      <el-step description="基本信息"></el-step>
      <el-step description="商品参数"></el-step>
      <el-step description="商品属性"></el-step>
      <el-step description="商品图片"></el-step>
      <el-step description="商品内容"></el-step>
    </el-steps>
    <!--tab切换-->
    <el-tabs @tab-click="tabclick" tab-position="left">
      <el-tab-pane label="基本信息">
        <el-form label-position="top" label-width="80px" :model="addObj">
          <el-form-item label="商品名称">
            <el-input v-model="addObj.name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addObj.region"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addObj.type"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addObj.type"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            {{cateData}}
            <el-cascader expand-trigger="hover" :props="props" :options="cateList" v-model="cateData">
            </el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数">
        <div v-for="item in manyParams" :key="item.id">
          <p>{{item.attr_name}}</p>
          <el-checkbox v-for="item1 in item.attr_vals.split(',')" :label="item1" v-model="checked" border></el-checkbox>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品属性">
        <el-form label-position="top" label-width="80px">
          <el-form-item v-for="item in onlyParams" :label="item.attr_name">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片">
        {{fileList}}
        <el-upload class="upload-demo"
                   action="http://localhost:8888/api/private/v1/upload"
                   :headers="headers"
                   :on-success="uploadsuccess"
                   :on-remove="removepic"
                   :on-preview="preview"
                   list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容">
        <el-button @click="add">添加用户</el-button>
        <div class="edit_container">
          <quill-editor v-model="content" ref="myQuillEditor">
          </quill-editor>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!--图片预览面板-->
    <el-dialog title="图片预览" :visible.sync="previewDialog">
      <img ref="mypic" src="#" alt="" style="width: 100%">
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      addObj: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: '',
      },
      active: 0,
      addObj: {},
      props: {
        value: 'cat_id',
        label: 'cat_name'
      },
      cateData: [],
      cateList: [],
      // 动态参数
      manyParams: [],
      // 静态参数
      onlyParams: [],
      checked: true,
      // 上传的文件列表
      fileList: [],
      headers: {
        'Authorization': window.localStorage.getItem('token')
      },
      previewDialog: false,
      content: '商品介绍~~~'
    }
  },
  methods: {
    add () {

    },
    preview (file) {
      this.previewDialog = true
      this.$nextTick(() => {
        // 将路径设置给图片(vue 中的指令：只能去虚拟 dom)
        this.$refs.mypic.src = file.response.data.url
      })
    },
    removepic (file, fileList) {
      var temp = file.response.data.tmp_path
      for (var i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i] === temp) {
          this.fileList.splice(i, 1)
        }
      }
    },
    uploadsuccess (response, file, fileList) {
      console.log(response)
      var {meta, data} = response
      this.fileList.push(data.tmp_path)
    },
    tabclick (e) {
      this.active = Number(e.index)
      if (e.index === '1') {
        this.getparams('many')
      } else if (e.index === '2') {
        this.getparams('only')
      }
    },
    async getcatelist () {
      var res = await this.$http.get(`categories?type=3`)
      var {meta, data} = res.data
      if (meta.status === 200) {
        this.cateList = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async getparams (sel) {
      if (this.cateData.length === 0) {
        this.$message.error('请选择商品分类')
        return
      }
      var id = this.cateData[this.cateData.length - 1]
      var res = await this.$http.get(`categories/${id}/attributes?sel=${sel}`)
      var {meta, data} = res.data
      if (meta.status === 200) {
        this.manyParams = data
        if (sel === 'many') {
          this.manyParams = data
        } else {
          this.onlyParams = data
        }
      } else {
        this.$message.error(meta.msg)
      }
    }
  },
  mounted () {
    this.getcatelist()
  }
}
</script>

<style>
.el-alert {
  margin-top: 15px;
}

.el-steps {
  margin-top: 15px;
}

.el-step__icon {
  margin-bottom: 10px;
}
.edit_container{
  height: 400px;
}
.ql-editor {
  height: 300px;
}
</style>
