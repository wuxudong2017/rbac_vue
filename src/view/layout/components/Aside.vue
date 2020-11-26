<template>
  <div class="aside">
    <el-menu
      :default-active="$route.path"
      class="el-aside"
      :class="slidebar.collapse?'tt':'xx'"
      @open="handleOpen"
      @close="handleClose"
      background-color="#334050"
      text-color="#fff"
      :collapse="slidebar.collapse"
    >
      <asideitem :routes="routers"></asideitem>
    </el-menu>
  </div>
</template>
<script>
import AsideItem from "./AsideItem";
import { mapGetters } from "vuex";
export default {
  name: "Aside",
  data() {
    return {
      isCollapse: true
    };
  },
  components: {
    asideitem: AsideItem
  },
  mounted() {},
  computed: {
    ...mapGetters(["slidebar", "routers"])
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    }
  }
};
</script>

<style scoped lang="scss">
.aside {
  .el-aside:not(.el-menu--collapse) {
    width: 220px;
    min-height: 400px;
  }
  .el-aside {
    overflow: hidden;
  }
  .el-submenu__title {
    color: #ffffff;
    width: 220px;
    min-height: 400px;
  }
  
}
</style>