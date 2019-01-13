import Vue from 'vue'
import Vuex from 'vuex'
// import VuexPersist from 'vuex-persist';
import router from './router'

Vue.use(Vuex)

// const vuexLocalStorage = new VuexPersist({
//   key: 'vuex', // The key to store the state on in the storage provider.
//   storage: window.localStorage, // or window.sessionStorage or localForage
//   // Function that passes the state and returns the state with only the objects you want to store.
//   // reducer: state => state,
//   // Function that passes a mutation and lets you decide if it should update the state in localStorage.
//   // filter: mutation => (true)
// })

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