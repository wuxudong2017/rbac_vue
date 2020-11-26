<template>
    <nav class="nav-bar clearfix">
      <div class="navbar-brand" :class="[slidebar.collapse?'active':'']">
        
        <div class="navbar-brand2" >
          <h3>TIYE</h3>
        </div>
      </div>
     <ul class="fl clearfix navbar-toolbar">
       <li>
         <a href="javascript:void(0)" @click="toggleSlide">
           <i class="el-icon-s-fold"></i></a></li>
     </ul>
     <div class="right-menu fr">
       <!-- <el-dropdown trigger="click">
         <span class="el-dropdown-link">切换系统<i class="el-icon-arrow-down el-icon--right"></i></span>
         <el-dropdown-menu slot="dropdown">
           <el-dropdown-item>
             用户管理系统
           </el-dropdown-item>
         </el-dropdown-menu>
       </el-dropdown> -->
       <!--用户个人信息-->
       <el-dropdown trigger="click">
         <div class="wrap">
           <div class="head-portrait">
             <div class="img">
               <img :src="avatar" alt="">
             </div>
             <span>{{name}} <small style="font-size: 12px;"></small></span>
             <i class="el-icon-caret-bottom"></i>
           </div>
         </div>
         <el-dropdown-menu slot="dropdown">
           <router-link to="/test">
             <el-dropdown-item>
                个人信息
             </el-dropdown-item>
           </router-link>
           <el-dropdown-item divided  @click.native="LoginOut">
             <span><i class="fa fa-sign-out"></i>退出</span>
           </el-dropdown-item>
         </el-dropdown-menu>
       </el-dropdown>
     </div>
    </nav>
</template>

<script>
  import {mapGetters} from 'vuex'
    export default {
        name: "v-header",
        
      computed:{
        ...mapGetters(['name','avatar','slidebar']),
      },
      methods:{
        toggleSlide(){
         this.$store.dispatch('ToggleSlideBar')
        },
        //退出登录
        LoginOut(){
          this.$store.dispatch('LoginOut').then(res=>{
            window.location.reload()
          })
        }
      }
    }
</script>

<style scoped lang="scss">
.nav-bar{
  position: relative;
  .navbar-brand{
    float: left;
    .navbar-brand2{
      box-sizing: border-box;
      width: 220px;
      padding: 20px 0;
      line-height: 20px;
      transition: all 0.2s ease-in;
      background:url("../../../assets/computer-logo.png")0 0 no-repeat;
      background-position: center center;
      font-size:16px;
      color: #ffffff;
      font-weight: bolder;
      text-align: center;
      height: 62px;
      h3{
       display: none
      }
    }
  }
  .active{
    .navbar-brand2{
      width: 64px;
      background:none;
      h3{
        display: block;
      
      }
    }
  }
  .navbar-toolbar{
    li{
      display: inline-block;
      a{
        display: block;
        line-height: 26px;
        padding: 17px 15px;
        color: #ffffff;
        font-size: 24px;
        &:hover{
          background-color: #4688C3;
        }
      }
    }
  }
  //右侧菜单
  .right-menu{
    .el-dropdown{
      margin-left: 16px;
      color: #ffffff;
      cursor: pointer;
    }
    .head-portrait{
      padding: 15px 0;
      line-height: 30px;
      position: relative;
      padding-left: 40px;
      color: #ffffff;
      .img{
        display: block;
        position: absolute;
        left: 0;
        width: 30px;
        height: 30px;
        overflow: hidden;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        img{
          width: 100%;
          height: auto;
        }
      }
    }
  }
}
</style>