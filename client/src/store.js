import Vue from 'vue'
import Vuex from 'vuex'
// import VuexPersist from 'vuex-persist';
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    error: null
  },
  getters: {
    errorMessage(state){
      return state.error;
    }

  },
  mutations: {
    ADD_USER: (state, user) => {
      state.user = user;
    },
    ADD_ERROR: (state, error) => {
      state.error = error;
      state.error.show = true;
    },
    SIGN_OUT: (state) => {
      state.user = null;
      document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      router.push('/');
    },

  },
  actions: {

  }
})