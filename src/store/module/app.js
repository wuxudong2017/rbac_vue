const state = {
  slidebar: {
    collapse: false
  },
  tabLoading: false,

  appTypeId: sessionStorage.getItem('appTypeId') ? sessionStorage.getItem('appTypeId') : '',
  applicationId: sessionStorage.getItem('applicationId') ? sessionStorage.getItem('applicationId') : '',
  problemId: sessionStorage.getItem('problemId') ? sessionStorage.getItem('problemId') : '',
};
const mutations = {
  TOGGLE_SLIDEBAR: (state, res) => {
    if (state.slidebar.collapse) {
      state.slidebar.collapse = false
    } else {
      state.slidebar.collapse = true
    }
  },
  // 请求加载动画效果
  TABLOADING: (state, res) => {
    state.tabLoading = res
  },

  // 设置应用分类id
  'SET_APPTYPE_ID': (state, res) => {
    state.appTypeId = res
  },
  // 设置应用id
  'SET_APPLICATION_ID': (state, res) => {
    state.applicationId = res
  },
  // 设置问题类型id
  'SET_PROBLEM_ID': (state, res) => {
    state.problemId = res
  },


};
const actions = {
  ToggleSlideBar({ commit }) {
    commit('TOGGLE_SLIDEBAR')
  }
};
export default {
  state,
  mutations,
  actions
}