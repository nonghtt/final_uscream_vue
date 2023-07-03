import { createStore } from 'vuex'

export default createStore({
  state: {
    // 상태(state) 정의
    snackbar: {
      show: false,
      message: '',
      color: ''
    }
  },
  getters: {
    // 게터(getters) 정의
  },
  mutations: {
    // 뮤테이션(mutations) 정의
    SET_SNACKBAR(state, payload) {
      state.snackbar.show = payload.show;
      state.snackbar.message = payload.message;
      state.snackbar.color = payload.color;
    }
  },
  actions: {
    // 액션(actions) 정의
  },
  modules: {
  }
})
