import Vue from 'vue'
import Router from 'vue-router'

import Layout from '../view/layout/index'
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)
export const constantRouter = [{
            path: '/login',
            name: '登陆',
            component: () =>
                import ('@/view/login')
        }, {
            path: '/',
            component: Layout,
            meta: { title: '功能模块', icon: 'tree' },
            redirect: 'index',
            children: [{
                path: 'index',
                name: '首页',
                component: () =>
                    import ('@/view/index/index'),
                meta: { title: '首页', icon: 'icon-yidiandiantubiao04' },
                menu: 'article'
            }, ]
        },
        {
            path: '/test',
            name: '测试',
            component: () =>
                import ('@/components/test'),
            menu: 'article'
        },
        {
            path: '/404',
            component: () =>
                import ('../components/Page404.vue'),
            hidden: true
        },
    ]
    //异步路由表
export const asyncRouterMap = [

    // 用户权限中心 	
    {
        path: '/user',
        component: Layout,
        redirect: '/user/',
        meta: { title: '用户权限', icon: 'icon-moban' },
        children: [{
                path: '',
                name: '用户列表',
                component: () =>
                    import ('@/view/user/user'),
                meta: { title: '用户列表', icon: 'icon-yonghuliebiao' },
                menu: 'user',
                hidden: false
            },
            {
                path: 'role',
                name: '角色管理',
                component: () =>
                    import ('@/view/user/role'),
                meta: { title: '角色管理', icon: 'icon-navicon-jsgl' },
                menu: 'role',
                hidden: false
            },
            {
                path: 'permission',
                name: '权限管理',
                component: () =>
                    import ('@/view/user/permission'),
                meta: { title: '权限管理', icon: 'icon-quanxianguanli' },
                menu: 'permission',
                hidden: false
            },
        ]
    },


    {
        path: '*',
        redirect: '/404',
        hidden: true
    }
];
export default new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouter
})