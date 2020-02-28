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
  async autoRefresh ({ commit }, token){
    if(token.accessToken && token.rfToken){
      var decoded = jwt.decode(token.accessToken);
      const now = Date.now() / 1000 // exp is represented in seconds since epoch
      let timeUntilRefresh = decoded.exp - now;
      const limitTime = 2 * 60;
      if(timeUntilRefresh <= limitTime) {
        const res = await axios.post("/auth/renew-token", {
          refreshToken: token.rfToken
        });
        if(res.status >= 200 && res.status < 300){
          commit("setAuthenticate", true);
          return res;
        }
      }
    }
    return null;
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