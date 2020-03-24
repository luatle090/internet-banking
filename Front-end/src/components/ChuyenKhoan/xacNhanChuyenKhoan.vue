<template>
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
                <md-input required v-bind:value="soTK" type="text" disabled></md-input>
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                <label>Họ tên</label>
                <md-input required v-bind:value="hoTen" type="text" disabled></md-input>
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                <label>Số tiền chuyển khoản</label>
                <md-input required v-bind:value="giaoDich" disabled type="text"></md-input>
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                <label>Nội dung</label>
                <md-input :value="noiDung" type="text" disabled></md-input>
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                <label>Nhập mã OTP</label>
                <md-input v-model="otp" type="text"></md-input>
                </md-field>
            </div>
            <div class="md-layout-item md-size-100 text-right">
                <md-button type="submit" class="md-raised md-success">Xác nhận</md-button>
            </div>
            </div>
        </md-card-content>
        </md-card>
    </form>  
    </div>
</div>
</template>
<script>
import axios from "axios";
import { mapActions } from 'vuex';

export default {
  name: "chuyenKhoanNoiBo",
  data() {
    return {
      soTK: "",
      noiDung: "",
      giaoDich: null,
      erro: false,
      show: false,
      message: "",
      selected: "1",
      showDS: true,
      title: "Xác nhận thông tin Chuyển khoản nội bộ",
      dsThietLap:[]
    };
  },

  watch: {
    selected: function(){
       if(this.selected == "1"){
        console.log(this.selected)
        this.showDS = true;
      }
      else if (this.selected == "2"){
        this.showDS = false;
      }
    }
  },

  methods: {
    ...mapActions(["autoRefresh"]),

    async chuyenKhoan(){
      var accessToken = localStorage.getItem("accessToken");
      var rfToken = localStorage.getItem("refreshToken");

      const token = {
          accessToken,
          rfToken
      };

      const data = {
        giaoDich: this.giaoDich,
        noiDung: this.noiDung,
        userIdNhan: this.soTK
      };

      const res = await this.autoRefresh(token);
      if(res !== null && res.data.accessToken){
          accessToken = localStorage.getItem("accessToken");
      }
      this.show = true;
      axios({
        method: "post",
        url: "/chuyenkhoan/noibo",
        headers:{
          "x-access-token" : accessToken
        },
        data: data
      }).then(res => {
        if(res.status === 201){
          this.message = "Chuyển khoản thành công";
          this.erro = false;   
        }
        else if (res.status === 204){
          this.message = "Không đủ tiền hoặc người nhận không tồn tại";
          this.erro = true;
        }
        else if (res.status === 400){
          this.message = "Số tiền chuyển khoản sai";
          this.erro = true;
        }
        else if (res.status === 409){
          this.message = "Người gửi và người nhận là một. Vui lòng chọn số tài khoản khác";
          this.erro = true;
        }
      }).catch(err => {
        this.message = "Giao dịch chuyển khoản thất bại. Vui lòng thử lại sau";
        this.erro = true;
        //console.log(err);
      });
    },
  }
};
</script>