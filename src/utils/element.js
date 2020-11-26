import Vue from 'vue'

// 全局混入一些处理方法
Vue.prototype.formatDate= (row,column) =>{
    let date = new Date(parseInt(row[column.property]));
    let Y = date.getFullYear() + '-';
    let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
    let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
    let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
    let m = date.getMinutes()  < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
    let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
  }
  Vue.prototype.formatDateA= (row,column) =>{
    let date = new Date(parseInt(row[column.property]));
    let Y = date.getFullYear() + '-';
    let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
    let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
  
    return Y + M + D 
  }
  Vue.prototype.formatDateB= (row,column) =>{
    let date = new Date(row[column.property]);
    let Y = date.getFullYear() + '-';
    let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
    let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
    let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
    let m = date.getMinutes()  < 10 ? '0' + date.getMinutes() : date.getMinutes() 
    let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
     // return Y + M + D + h + m + s;
     return Y + M + D + h + m 
 
  }
  
  // 权限判断
import store from '../store'

export function hasPermission(permission) {
  let myPermissions = store.getters.permissionList;
  return myPermissions.indexOf(permission) > -1;
}
