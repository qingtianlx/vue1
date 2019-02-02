<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{first}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{last}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'bread',
  props: ['first', 'last']
}
</script>

<style>

</style>
