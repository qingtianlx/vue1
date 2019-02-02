<template>
    <el-card>
      <bread first="商品管理" last="商品列表"></bread>
      <el-row class="myrow">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="16">
          &nbsp;&nbsp;&nbsp;
          <el-button @click="addgoods" type="success" plain>添加按钮</el-button>
        </el-col>
      </el-row>
      <!--表格-->
      <el-table :data="goodslist" border style="width: 100%">
        <el-table-column type="index" width="50">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="180">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="180">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <template slot-scope="scope">
            {{scope.row.add_time | dataformat}}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作"  width="200">
          <template slot-scope="scope">
            <el-row>
              <el-button size="mini" type="primary" icon="el-icon-edit" plain></el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" plain></el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
</template>

<script>
export default {
  data () {
    return {
      search: '',
      goodslist: [],
      pagenum: 1,
      pagesize: 5,
      total: 0
    }
  },
  methods: {
    async getAllGoods () {
      var res = await this.$http.request({
        url: `goods?query=${this.search}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
        method: 'get'
      })
      var {meta, data} = res.data
      if (meta.status === 200) {
        this.goodslist = data.goods
        console.log(data)
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },
    addgoods () {
      this.$router.push('/goods/addgoods')
    }
  },
  mounted () {
    this.getAllGoods()
  }
}
</script>

<style>
.myrow{
  margin-top: 15px;
}
</style>
