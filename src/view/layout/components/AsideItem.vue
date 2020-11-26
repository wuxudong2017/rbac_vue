<template>
    <div class="aslide-item">
      <template v-for="item in routes" v-if="!item.hidden&&item.children">
        <!--只有一级菜单-->
        <router-link v-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow" :to="{path:item.path+''+item.children[0].path}"
                     :key="item.children[0].name">
          <el-menu-item :index="item.path+''+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
            <i v-if="item.children[0].meta&&item.children[0].meta.icon" class="iconfont" :class="item.children[0].meta.icon"></i>
            <span v-if="item.children[0].meta&&item.children[0].meta.title" slot="title">{{item.children[0].meta.title}}</span>
          </el-menu-item>
        </router-link>
        <!--有多个菜单-->
        <el-submenu v-else :index="item.name||item.path" :key="item.name">
          <template slot="title">
            <i v-if="item.meta&&item.meta.icon" class="iconfont" :class="item.meta.icon"></i>
            <span slot="title"  v-if="item.meta&&item.meta.title">{{item.meta.title}}</span>
          </template>
            <template v-for="(child) in item.children"  v-if="!child.hidden">
              <aside-item  class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></aside-item>
              <router-link v-else :to="{path:item.path+'/'+child.path}" :key="child.name" tag="a">
                <el-menu-item :index="item.path+'/'+child.path" >
                  <i v-if="child.meta&&child.meta.icon" class="iconfont" :class="child.meta.icon"></i>
                  <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
                </el-menu-item>
              </router-link>
            </template>
        </el-submenu>
      </template>
    </div>
</template>

<script>
    export default {
      name: "AsideItem",
      props:{
        routes:{
          type:Array
        },
        isNest: {
          type: Boolean,
          default: false
        }
      },
      methods:{
        hasOneShowingChildren(children) {
          const showingChildren = children.filter(item => {
            return !item.hidden
          })
          if (showingChildren.length === 1) {
            return true
          }
          return false
        },
      }
    }
</script>

<style scoped lang="scss">
  .aslide-item{
    .iconfont {
      font-size: 18px;
      margin-right: 5px;
      width: 24px;
      text-align: center;
    }
    
  }

</style>