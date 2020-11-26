import router from './router'
import store from './store'
import { getToken } from './utils/auth'
const whiteList = ['/login']
router.beforeEach((to, from, next) => {
    if (getToken()) {
        if (to.path == '/login') {
            next({ path: '/' })
        } else if (!store.getters.roleId) {
            store.dispatch('GetUserInfo').then((res) => {
                store.dispatch('GererateRouter', res).then(result => {
                    router.addRoutes(store.getters.routers)
                })
            })
            next()
        } else {
            next()
        }
    } else {
        if (whiteList.indexOf(to.path) != -1) {
            next()
        } else {
            next({ path: '/login' })
        }

    }
})