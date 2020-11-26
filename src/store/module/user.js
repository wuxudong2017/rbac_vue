import { LoginA, GetUserInfoA, LoginOutA } from '../../api/login'
import { setToke, removeToken, getToken } from '../../utils/auth'
const state = {
    name: '',
    userId: '',
    avatar: 'https://www.gravatar.com/avatar/6560ed55e62396e40b34aac1e5041028?imageView2/1/w/80/h/80',
    roleId: '',
    roleName:'',
    menuList: [],
    permissionList: [],
    token:getToken()

}
const mutations = {
    SET_USER: (state, res) => {
        state.name = res.name;
        state.avatar = res.avatar ? res.avatar : state.avatar;
        state.roleId = res.roleId;
        state.roleName = res.roleName;
        state.menuList = res.menuList;
        state.permissionList = res.permissionList;
    },
    REST_USER: (state, res) => {
        state.name = "";
        state.userId = "";
        state.roleId = '';
        state.roleName ='';
        state.menuList = [];
        state.permissionList = [];
    },
    SET_TOKEN:(state,res)=>{
        state.token = res
    },
}
const actions = {
    Login({ commit}, loginForm) {
        return new Promise((resolve, reject) => {
            LoginA(loginForm).then(res => {
              
                if (res.code === 1) {
                    commit('SET_TOKEN',res.data.token)
                    setToke(res.data.token);
                }
                resolve(res);
            }).catch((err) => {
                reject(err)
            });
        })
    },
    // 获取用户信息
    GetUserInfo({ commit ,state}) {
        return new Promise((resolve, reject) => {
            GetUserInfoA(state.userId).then(res => {
                if (res.code == 1) {
                    commit('SET_USER', res.data);
                    resolve(res.data)
                } 
            }).catch(err => {
                reject(err)
            })
        })
    },
    LoginOut({ commit,state }) {
        return new Promise((resolve, reject) => {
            LoginOutA(state.token).then(res => {
                removeToken();
                commit('REST_USER')
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

}
export default {
    state,
    mutations,
    actions
}


