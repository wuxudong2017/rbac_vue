import axios from 'axios'
import service from './service'
import store from '../store/index'
import router from '../router'
import {MessageBox } from 'element-ui'
import {getToken, removeToken} from './auth'
const request = axios.create({
    baseURL:service.api,
    timeout:5000,
})
request.interceptors.request.use(config =>{
    if(getToken()){
        config.headers={
            "Authorization":getToken()
        }
    }
    store.commit('TABLOADING',true)
    return config
},err =>{
    store.commit('TABLOADING',false)
    return Promise.reject(err)
})
request.interceptors.response.use(res =>{
    if(res.data.code==99){
        store.commit('REST_USER');
        MessageBox({
            type:'warning',
            title:'提示',
            message:res.data.message,
        }).then(()=>{
            removeToken();
            router.push({path:'/login'})
        })
    }
    setTimeout(()=>{
        store.commit('TABLOADING',false)
    },500)
    return res.data
},err =>{
    store.commit('TABLOADING',false)
    return Promise.reject(err)
})
export default request


