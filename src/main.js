// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// vuex
import store from './store/index'
// request 
import request from './utils/request'
// element-ui
import elementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(elementUi, {

    })
    // element ui 公共方法
import './utils/element'
// v-charts
import Vcharts from 'v-charts'
Vue.use(Vcharts)
    // socker
import socket from 'weapp.socket.io'
import service from './utils/service'
Vue.prototype.$socket = socket(service.api + '/vue')
import print from '@/assets/print.js'
Vue.use(print)
    // import  'jquery'
    // window.jQuery = jQuery
    // 用户权限
import './permission'
// 高德地图加载
// let createMap=()=>{
//   return new Promise((resolve,reject)=>{
//     let script = document.createElement('script');
//     script.type="text/javascript";
//     script.src="https://webapi.amap.com/maps?v=1.4.13&key=a206b32562c37e92a3171b701695a4e8&plugin=AMap.DistrictSearch";
//     document.body.appendChild(script);
//     if (script.nodeName === 'SCRIPT') {
//       resolve()
//     } else {
//       reject(new Error('Could not script image at ' + script.src))
//     }
//   })
// }
// createMap().then(res=>{
//   console.log('读取高德地图成功')
// }).catch(err=>{
//   console.log(err)
// })

Vue.config.productionTip = false;
Vue.config.devtools = true


Vue.prototype.$http = request


// websocket 

import { hasPermission } from './utils/element'
Vue.prototype.hasPer = hasPermission;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})