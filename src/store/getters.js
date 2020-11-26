const getters = {



    // 用户信息
    name: state => state.user.name,
    userId: state => state.user.userId,
    avatar: state => state.user.avatar,
    roleId: state => state.user.roleId,
    roleName:state=>state.user.roleName,
    menuList: state => state.user.menuList,
    permissionList: state => state.user.permissionList,
    //折叠面板
    slidebar: state => state.app.slidebar,
    routers: state => state.permission.routers,
    // 请求加载动画 
    tabLoading:state=>state.app.tabLoading,

    // 应用分类id
    appTypeId:state=>state.app.appTypeId,
    // 应用id
    applicationId:state=>state.app.applicationId,
    problemId:state=>state.app.problemId,

}
export default getters