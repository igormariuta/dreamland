import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    token: localStorage.getItem('auth-token') || null,
    user: {},
  },
  
  getters: {
    getUser:  state => state.user,
    getToken: state => state.token,
    loggedIn: state => state.token !== null
  },
  
  mutations: {

    setToken (state, token) {
      state.token = token;
    },

    setUser (state, user) {
      state.user = user;
    },

    logOut (state) {
      state.user = {};
      state.token = null
    }
    
  }
  
});