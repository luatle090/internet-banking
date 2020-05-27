import axios from "axios";

const state = {
    chuyenKhoanLienNH:{
        // soTKNhan: "",
        // hoTen: "",
        // giaoDich: null,
        // noiDung: ""
        // partnerCode: ""
        // nganHang: ""
    }
  };
  
const getters = {
    infoChuyenKhoanLienNH: state => state.chuyenKhoanLienNH
     
};

const actions = {
    async impChuyenKhoanLienNH({ getters, dispatch }, otp){
        const accessToken = await dispatch('getToken', null, { root: true });
        let data = getters['infoChuyenKhoanLienNH'];
        data.token = otp;
        //console.log(data);
        const res = await axios({
            method: "post",
            url: "/hkl/chuyenkhoan/trutien",
            headers:{
              "x-access-token" : accessToken
            },
            data: data
          })
        return res;
    }
};

const mutations = {
    setChuyenKhoanLienNH: (state, chuyenKhoan) => (state.chuyenKhoanLienNH = chuyenKhoan)
};

export default{
    state,
    getters,
    actions,
    mutations
}