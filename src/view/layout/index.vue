<template>
  <el-container style="height: 100%">
    <!---------header------------>
    <el-header style="height: auto;">
      <v-header></v-header>
    </el-header>
    <el-container>
      <!---------aside------------>
      <el-aside style="width: auto">
        <v-aside></v-aside>
      </el-aside>
      <el-container>
        <!---------main------------>
        <el-main>
          <v-main></v-main>
        </el-main>
        <!---------footer------------>
        <el-footer style="height: 40px;"></el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import Header from './components/Header'
import Aside from './components/Aside'
import Main from  './components/Main'
export default {
  name: "layout",
   components:{
        'v-header':Header,
        // 'v-slidebar':SlideBar,
        'v-main':Main,
        'v-aside':Aside
      },
  data() {
    return {};
  },
  created() {

  },
  methods: {

  }
};
</script>

<style lang="scss">
@import '../../styles/index';
.el-header{
    padding-left: 0 !important;
    background-color: #4E97D9;
  }
  .el-aside{
    background-color: #334050;
  }
  .el-footer{
    height: 40px;
    background-color: #FAFAFA;
  }
</style>
