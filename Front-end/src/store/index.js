import Vuex from "vuex";
import Vue from "vue";
import auth from "./modules/auth";
import chuyenKhoan from "./modules/chuyenKhoan";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        auth,
        chuyenKhoan
    }
})