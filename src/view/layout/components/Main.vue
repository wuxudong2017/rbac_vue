<template>
  <div class="main">
    <v-bread></v-bread>
    <div class="main-view">
      <transition enter-active-class="animated fadeIn">
        <keep-alive>
          <router-view :key="new Date().getTime()"></router-view>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>
<script>
import Bread from "./Bread";
export default {
  name: "Main",
  components: {
    "v-bread": Bread
  }
};
</script>
<style scoped lang="scss">
.main{
  width: 100%;

}
.main-view{
  margin-top: 20px;
  border-top: 1px #ddd solid;
  width: inherit;
  height: inherit;
}
</style>