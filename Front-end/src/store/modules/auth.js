import axios from "axios";
var jwt = require('jsonwebtoken');

const state = {
  isAuthenticated: false,
  user: null
};

const getters = {
  getAuthenicated: state => state.isAuthenticated,
   
};

//get request and response
const actions = {
  async isLogin({ commit }, accessToken){
      if(accessToken){
        commit("setAuthenticate", true);
      }

  },
  async signOut({ commit }, accessToken){
    if(!accessToken){
        commit("setAuthenticate", false);
    }
  },
  async renewToken({ commit }, token){
    const res = await axios.post("/auth/renew-token", {
      refreshToken: token.rfToken
    });
    if(res.status === 201){
      commit("setAuthenticate", true);
      localStorage.setItem("accessToken", res.data.accessToken);
      return res;
    }
    else{
      delete localStorage.accessToken;
      delete localStorage.refreshToken;
      commit("setAuthenticate", false);
      //router.push('/login');
    }
  },
  async autoRefresh ({ dispatch }, token){
    if(typeof token.accessToken === 'undefined' && token.rfToken){
      const res = await dispatch('renewToken', token);
      return res;
    }
    else if(token.accessToken && token.rfToken){
      var decoded = jwt.decode(token.accessToken);
      const now = Date.now() / 1000 // exp is represented in seconds since epoch
      let timeUntilRefresh = decoded.exp - now;
      const limitTime = 2 * 60;

      //vượt quá thời gian thì gọi api renew
      if(timeUntilRefresh <= limitTime) {
        const res = await dispatch('renewToken', token);
        return res;
      }
    }
    return null;
  },

  async getToken({ dispatch }){
    var accessToken = localStorage.getItem("accessToken");
    var rfToken = localStorage.getItem("refreshToken");

    const token = {
        accessToken,
        rfToken
    };

    await dispatch('autoRefresh', token);
    accessToken = localStorage.getItem("accessToken");
    return accessToken;
  }
};

const mutations = {
    setAuthenticate: (state, isAuth) => state.isAuthenticated = isAuth,
    setUser: (state, data) => state.user = data
};

export default{
  state,
  getters,
  actions,
  mutations
}