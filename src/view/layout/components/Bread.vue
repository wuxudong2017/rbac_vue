<template>
  <div class="bread">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{list}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  created(){
    //this.getBreadcrumb()
  },
  data() {
    return {
      list: "",
     // levelList:null
    };
  },
  mounted() {
    this.list = this.$route.name;
  },
  methods:{
    //   getBreadcrumb() {
    //   let matched = this.$route.matched.filter(item => item.name)
    //   const first = matched[0]
    //   if (first && first.name !== 'dashboard') {
    //     matched = [{ path: '/dashboard', meta: { title: 'Dashboard' }}].concat(matched)
    //   }
    //   this.levelList = matched
    // }
  },
  watch: {
    $route(res) {
      this.list = res.name;
    }
  }
};
</script>

<style lang="scss">
.bread {
  padding: 15px;
  border-left: 5px #409eff solid;
  .el-breadcrumb {
    font-size:18px;
  }
}
</style>
