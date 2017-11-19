<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style>
  body {
    margin: 0px;
    padding: 0px;
    background: #1F2D3D;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
  }



  /* dialog自定义样式 body padding 边距调整 */
  .dialog-body-padding .el-dialog__body{
    padding: 10px !important;
  }
</style>
