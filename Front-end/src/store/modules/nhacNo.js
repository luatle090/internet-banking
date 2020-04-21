import axios from "axios";

const state = {
    nhacNoList:[],
    rows: 0,
  };
  
const getters = {
    dsNhacNo: state => state.nhacNoList,
    totalRows: state => state.rows
};

const actions = {
    async fetchNhacNo({ dispatch, commit }, otp){
        const accessToken = await dispatch('getToken', null, { root: true });
        
        //data.token = otp;
        //console.log(otp);
        const res = await axios.get("/nhacno", {
            headers: {
                "x-access-token": accessToken
            },
            params: {
                tinhTrang: otp.tinhTrang,
                loai: otp.loai,
                limit: otp.limit,
                offset: otp.offset
            }
        }).catch(err => {
            console.log(err);
        });
        
        commit('setNhacNoList', res.data.listResult);
        commit('setTotalRows', res.data.totalItems);
    },
    async deleteNhacNoAndGetMore({ dispatch, commit }, info){
        const accessToken = await dispatch('getToken', null, { root: true });
        const res = await axios.delete(`/nhacno/${info.idNhacNo}`, {
            headers: {
            "x-access-token": accessToken
        }
        }).catch(err => {
            console.log(err);
        });

        if(res.status === 200){
            commit('removeNhacNoList', info.idNhacNo);
            dispatch('getMoreNhacNo', info);
        }
       
    },
    async getMoreNhacNo({ dispatch, commit }, info){
        const accessToken = await dispatch('getToken', null, { root: true });

        const res = await axios.get("/nhacno", {
            headers: {
                "x-access-token": accessToken
            },
            params: {
                tinhTrang: info.tinhTrang,
                loai: info.loai,
                limit: 1,
                offset: info.limit - 1
            }
        }).catch(err => {
            console.log(err);
        });

        if(res.status === 200){
            commit('addTailNhacNoList', res.data.listResult[0]);
            commit('setTotalRows', res.data.totalItems);
        }
    },
    async addHeadNhacNoList({ commit }, nhacNo){
        commit('addHeadNhacNoList', nhacNo);
        commit('incrementRows');
    }
};

const mutations = {
    setNhacNoList: (state, nhacNoList) => (state.nhacNoList = nhacNoList),
    setTotalRows: (state, totalRows) => (state.rows = totalRows),
    incrementRows: (state) => (state.rows++),
    addTailNhacNoList: (state, nhacNo) => state.nhacNoList.push(nhacNo),
    addHeadNhacNoList: (state, nhacNo) => state.nhacNoList.unshift(nhacNo),
    removeNhacNoList: (state, id) => (state.nhacNoList = state.nhacNoList.filter(nhacNo => nhacNo.id != id)),
};

export default{
    state,
    getters,
    actions,
    mutations
}