import axios from "axios";

const state = {
    chuyenKhoan:{
        // userIdNhan: null,
        // soTK: "",
        // hoTen: "",
        // giaoDich: null,
        // noiDung: ""
    }
  };
  
const getters = {
    infoChuyenKhoan: state => state.chuyenKhoan
     
};

const actions = {
    async impChuyenKhoan({ getters, dispatch }, otp){
        const accessToken = await dispatch('getToken', null, { root: true });
        let data = getters['infoChuyenKhoan'];
        data.token = otp;
        //console.log(data);
        const res = await axios({
            method: "post",
            url: "/chuyenkhoan/noibo",
            headers:{
              "x-access-token" : accessToken
            },
            data: data
          })
        return res;
    }
};

const mutations = {
    setChuyenKhoan: (state, chuyenKhoan) => (state.chuyenKhoan = chuyenKhoan)
};

export default{
    state,
    getters,
    actions,
    mutations
}