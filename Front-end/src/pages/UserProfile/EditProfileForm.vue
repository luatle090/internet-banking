<template>
<div>
  <b-alert v-model="show" :variant="erro ? 'danger' : 'success'"  dismissible>{{ message }}</b-alert>
  <form v-on:submit.prevent="changePassword">
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Thay đổi Password</h4>
      </md-card-header>

      <md-card-content>
        <div class="md-layout">
          <!-- <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Company</label>
              <md-input v-model="disabled" disabled></md-input>
            </md-field>
          </div> -->
          <!-- <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>User Name</label>
              <md-input v-model="username" type="hidden"></md-input>
            </md-field>
          </div> -->
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>Password Hiện Tại</label>
              <md-input required v-model="passwordOld" type="password"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>Password Mới</label>
              <md-input required v-model="password" type="password"></md-input>
            </md-field>
          </div>
          <!-- <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Last Name</label>
              <md-input v-model="lastname" type="text"></md-input>
            </md-field>
          </div> -->
          <!-- <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>Adress</label>
              <md-input v-model="address" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>City</label>
              <md-input v-model="city" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Country</label>
              <md-input v-model="country" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Postal Code</label>
              <md-input v-model="code" type="number"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100">
            <md-field maxlength="5">
              <label>About Me</label>
              <md-textarea v-model="aboutme"></md-textarea>
            </md-field>
          </div> -->
          <div class="md-layout-item md-size-100 text-right">
            <md-button type="submit" class="md-raised md-success">Cập nhật Password</md-button>
          </div>
        </div>
      </md-card-content>
    </md-card>
  </form>
</div>
</template>
<script>
import axios from "axios";

export default {
  name: "edit-profile-form",
  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      passwordOld: "",
      password: "",
      erro: false,
      show: false,
      message: "",
    };
  },
  methods: {
    changePassword(e){
      const data = {
        passwordOld: this.passwordOld,
        password: this.password
      };
      this.show = true;
      axios({
        method: "patch",
        url: "/taikhoannganhang/security",
        headers:{
          "x-access-token" : localStorage.getItem("accessToken")
        },
        data: data
      }).then(res => {
        if(res.status === 200){
          const message = res.data.message
          if(message == "success"){
            this.message = "Cập nhật thành công";
            this.erro = false;
          } else if (message == "failed"){
            this.message = "Password mới trùng với password hiện tại";
            this.erro = true;
          } else {
            this.message = "Nhập sai password hiện tại";
            this.erro = true;
          }    
        }
        else{
          this.message = "Này động này bị cấm";
          this.erro = true;
        }
      }).catch(err => {
        this.message = "Đã có lỗi xảy ra vui lòng liên hệ Admin";
        this.erro = true;
        //console.log(err);
      });

      this.clearPassword();
    },
    clearPassword(){
      this.password = "";
      this.passwordOld = "";
    }
  }
};
</script>
<style></style>
