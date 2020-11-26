import request from '../utils/request.js'
// 用户登录
export function LoginA(data){
    return request({
        url:'/api/admin/login',
        method:'post',
        data:data,
    })
}
// 获取用户详情
export function GetUserInfoA(id){
    return request({
        url:'/api/admin/userInfo',
        method:'post',
        data:{
            id
        }
    })
}
// 用户退出
export function LoginOutA(token){
    return request({
        url:'/api/admin/layout',
        method:'post',
        data:{
            token 
        }
    })
}
