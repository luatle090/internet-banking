<template>
<div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-100">
        <b-alert v-model="show" :variant="erro ? 'danger' : 'success'"  dismissible>{{ message }}</b-alert>
        <form v-on:submit.prevent="chuyenKhoan">
          <md-card>
            <md-card-header data-background-color="green">
              <h4 class="title">{{ title }}</h4>
            </md-card-header>
            <md-card-content>
              <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-100">
                  <md-field>
                    <label>Số tài khoản</label>
                    <md-input required v-bind:value="infoChuyenKhoan.soTK" type="text" disabled></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-100">
                  <md-field>
                    <label>Họ tên</label>
                    <md-input required v-bind:value="infoChuyenKhoan.hoTen" type="text" disabled></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-100">
                  <md-field>
                    <label>Số tiền chuyển khoản</label>
                    <md-input required v-bind:value="infoChuyenKhoan.giaoDich" disabled type="text"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-100">
                  <md-field>
                    <label>Nội dung</label>
                    <md-input :value="infoChuyenKhoan.noiDung" type="text" disabled></md-input>
                  </md-field>
                </div>
                <div v-show="!daChuyenXong" class="md-layout-item md-small-size-45">
                  <md-field class="">
                    <label>Nhập mã OTP</label>
                    <md-input v-model.trim="otp" type="text"></md-input>
                  </md-field>
                </div>
                <div v-show="!daChuyenXong" class="md-layout-item md-small-size-35 text-right" >
                  <md-button type="button" @click="getOTP" class="md-raised md-success">Gửi lại mã OTP</md-button>
                </div>
                <div v-show="!daChuyenXong" class="md-layout-item md-small-size-100 md-size-100 text-right">
                  <md-button type="button" @click="huyGiaoDich"  class="btn-huy md-raised md-danger">Hủy</md-button>
                  <md-button type="submit" class="md-raised md-success">Chuyển khoản</md-button>
                </div>
                <div v-show="daChuyenXong" class="md-layout-item md-small-size-100 md-size-100 text-right">
                  <md-button type="button" @click="huyGiaoDich"  class="btn-huy md-raised md-success">Quay lại</md-button>
                </div>
              </div>
            </md-card-content>
          </md-card>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: "xacNhanChuyenKhoan",
  data() {
    return {
      erro: false,
      show: false,
      otp: null,
      daChuyenXong: false,
      message: "",
      title: "Xác nhận thông tin Chuyển khoản nội bộ"
    };
  },

  computed: mapGetters(["infoChuyenKhoan"]),

  methods: {
    ...mapActions(["impChuyenKhoan", "getToken"]),
    ...mapMutations(["setChuyenKhoan"]),

    huyGiaoDich(){
      const info = {
        userIdNhan: null,
        soTK: "",
        hoTen: "",
        giaoDich: null,
        noiDung: ""
      }
      this.setChuyenKhoan(info);

      this.$router.push({path: 'chuyenkhoannoibo'});
    },

    async chuyenKhoan(){
      this.show = true;
      this.impChuyenKhoan(this.otp).then(res => {
        this.daChuyenXong = true;
        if(res.status === 201){
          this.message = "Chuyển khoản thành công";
          this.title = "Thông tin chuyển khoản"
          this.erro = false;
        }
        else if (res.status === 204){
          this.message = "Không đủ tiền hoặc người nhận không tồn tại";
          this.erro = true;
        }
      }).catch( err => {
        if (err.response.status === 400){
          this.message = "Số tiền chuyển khoản sai";
          this.erro = true;
        }
        else if(err.response.status === 404){
          this.message = "Mã OTP sai";
          this.erro = true;
        }
        else if (err.response.status === 409){
          this.message = "Người gửi và người nhận là một. Vui lòng chọn số tài khoản khác";
          this.erro = true;
        }
        else{
          this.message = "Có lỗi xảy ra";
          this.erro = true;
        }
      });

      // var accessToken = localStorage.getItem("accessToken");
      // var rfToken = localStorage.getItem("refreshToken");

      // const token = {
      //     accessToken,
      //     rfToken
      // };

      // const data = {
      //   giaoDich: this.giaoDich,
      //   noiDung: this.noiDung,
      //   userIdNhan: this.soTK
      // };

      // const res = await this.autoRefresh(token);
      // if(res !== null && res.data.accessToken){
      //     accessToken = localStorage.getItem("accessToken");
      // }
      // this.show = true;
      // axios({
      //   method: "post",
      //   url: "/chuyenkhoan/noibo",
      //   headers:{
      //     "x-access-token" : accessToken
      //   },
      //   data: data
      // }).then(res => {
      //   if(res.status === 201){
      //     this.message = "Chuyển khoản thành công";
      //     this.erro = false;   
      //   }
      //   else if (res.status === 204){
      //     this.message = "Không đủ tiền hoặc người nhận không tồn tại";
      //     this.erro = true;
      //   }
      //   else if (res.status === 400){
      //     this.message = "Số tiền chuyển khoản sai";
      //     this.erro = true;
      //   }
      //   else if(res.status === 404){
      //       this.message = "Mã OTP sai";
      //       this.erro = true;
      //   }
      //   else if (res.status === 409){
      //     this.message = "Người gửi và người nhận là một. Vui lòng chọn số tài khoản khác";
      //     this.erro = true;
      //   }
      // }).catch(err => {
      //   this.message = "Giao dịch chuyển khoản thất bại. Vui lòng thử lại sau";
      //   this.erro = true;
      //   //console.log(err);
      // });
    },

    async getOTP(){
      const accessToken = await await this.getToken();
      axios({
        method: "get",
        url: "/chuyenkhoan/getotp",
        headers:{
          "x-access-token" : accessToken
        }
      });
    }
  }
};
</script>
<style scoped>
  .btn-huy{
    margin-right:40px;
  }
</style>>
