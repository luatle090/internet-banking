<template>
<div class="centered-container">
    <md-content class="md-elevation-3">

      <div class="title">
        <img src="@/assets/img/logo.png">
        <div class="md-title">Internet Banking</div>
        <div class="md-body-2">Quên mật khẩu</div>
      </div>

      <form v-on:submit.prevent>
      <div class="form">
        <span class="help-block" ><h3>{{ message }}</h3></span>
        <md-field v-if="!show">
          <label>Nhập Username để gửi mã OTP</label>
          <md-input v-model="username" required autofocus></md-input>
        </md-field>

        <div v-else>
          <md-field md-has-password>
            <label>Password</label>
            <md-input v-model="password" required type="password"></md-input>
          </md-field>
          <md-field>
            <label>OTP</label>
            <md-input v-model="token" required type="text"></md-input>
          </md-field>
        </div>
      </div>

      <div class="actions md-layout md-alignment-center-space-between">
        
        <b-link to="/login">Quay lại</b-link>
        <md-button v-if="!show" class="md-raised md-primary" v-on:click="findUser" type="submit">Gửi mã OTP</md-button>
        <md-button v-else class="md-raised md-primary" v-on:click="changePassword" type="submit">Thay đổi mật khẩu</md-button>
      </div>
      </form>

      <div class="loading-overlay" v-if="loading">
        <md-progress-spinner md-mode="indeterminate" :md-stroke="2"></md-progress-spinner>
      </div>
    </md-content>
    <div class="background" />
  </div>
</template>

<script>
import axios from "axios";
import Router from "vue-router";

export default {
  components: {  },
  data() {
    return {
      username: "",
      password: "",
      token: "",
      message: "",
      loading: false,
      show: false,
    };
  },
  methods: {
    findUser(){
      this.message = "";
      if(this.username !== ""){
        this.loading = true;
        axios({
          method: "post",
          url: "/auth/forgot",
          data: {
            username: this.username
          }
        }).then(res => {
          if(res.status === 204){
            this.message = "Không tìm thấy username"
          }
          else{
            this.show = true;
          }
          this.loading = false;
        }).catch(err => {
          this.message = "Đã có lỗi xảy ra vui lòng liên hệ Admin";
          this.username = "";
          this.loading = false;
          //console.log(err);
        })        
      }
    },
    changePassword(){
      this.message = "";
      if(this.password !== "" && this.token !== ""){
        axios({
          method: "patch",
          url: "/auth/changepassword",
          data: {
            username: this.username,
            password: this.password,
            token: this.token
          }
        }).then(res => {
          if(res.data.message === "success"){
            this.message = "Đổi mật khẩu thành công.\n Hệ thống sẽ tự chuyển trang login trong 2s";
            this.password = "";
            setTimeout(function() {
              this.$router.push(this.$route.query.redirect || "/login");
            }.bind(this), 2000);
          }
          else{
            this.message = "Nhập sai mã OTP";
          }
        }).catch(err => {
          this.message = "Đã có lỗi xảy ra vui lòng liên hệ Admin";
          this.password = "";
          //console.log(err);
        })
        
      }
    } 
  }
};
</script>

<style lang="scss" scoped>
.centered-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100vh;
  .title {
    text-align: center;
    margin-bottom: 30px;
    img {
      margin-bottom: 16px;
      max-width: 80px;
    }
  }
  .actions {
    .md-button {
      margin: 0;
    }
  }
  .form {
    margin-bottom: 60px;
  }

  .background {
    background: url("../../assets/img/bg-1.jpg");
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 0;
    background-size: cover;
  }

  .md-content {
    z-index: 1;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    position: relative;
  }
  .loading-overlay {
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>