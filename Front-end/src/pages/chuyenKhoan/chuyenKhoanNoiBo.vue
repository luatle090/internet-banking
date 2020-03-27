<template>
<div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-100">
        <b-alert v-model="show" :variant="erro ? 'danger' : 'success'"  dismissible>{{ message }}</b-alert>
        <form v-on:submit.prevent="checkThongTin">
          <md-card>
            <md-card-header data-background-color="green">
              <h4 class="title">{{ title }}</h4>
            </md-card-header>
            <md-card-content>
              <div class="md-layout">
                <div>
                  <b-form-group >
                    <b-form-radio v-model="selected" value="1">Trong danh sách đã lưu</b-form-radio>
                    <b-form-radio v-model="selected" value="2">Ngoài danh sách đã lưu</b-form-radio>
                  </b-form-group>
                </div>
                <div v-if="showDS" class="md-layout-item md-small-size-100 md-size-100">
                  <md-field>
                    <label>Số tài khoản</label>
                    <md-input @change="getSoTK" required list="ds-thietLap"></md-input>
                    <datalist id="ds-thietLap">
                      <option v-for="thietLap in dsThietLap" :value="thietLap.soTK" :key="thietLap.soTK" ></option>
                    </datalist>
                    </md-field>
                    <span class="help-block" ><h3>{{ messageSoTK }}</h3></span>
                </div>
                <div v-else class="md-layout-item md-small-size-100 md-size-100">
                  <md-field>
                    <label>Số tài khoản</label>
                    <md-input required v-model="soTK" type="text"></md-input>
                  </md-field>
                  <span class="help-block" ><h3>{{ messageSoTK }}</h3></span>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-100">
                  <md-field>
                    <label>Số tiền chuyển khoản</label>
                    <md-input required v-model="giaoDich" type="number" min="1"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-100">
                  <md-field>
                    <label>Nội dung</label>
                    <md-input v-model="noiDung" type="text"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-100 text-right">
                  <md-button type="submit" class="md-raised md-success">Gửi mã OTP</md-button>
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
import { mapActions, mapMutations } from 'vuex';

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
      messageSoTK: "",
      selected: "1",
      showDS: true,
      title: "Chuyển khoản nội bộ",
      dsThietLap:[]
    };
  },

  mounted() {
    this.fetchThietLap();
  },

  watch: {
    selected: function(){
      this.messageSoTK = "";
      if(this.selected == "1"){
        this.showDS = true;
      }
      else if (this.selected == "2"){
        this.showDS = false;
      }
    }
  },

  methods: {
    ...mapActions(["getToken"]),
    ...mapMutations(["setChuyenKhoan"]),

    async checkThongTin(){
      const soTK = this.soTK;
      const accessToken = await this.getToken();
      axios({
        method: "get",
        url: `/taikhoannganhang/${soTK}`,
        headers:{
          "x-access-token" : accessToken
        }
      }).then(res => {     
        if(res.status === 204){
           console.log(res.status);
          this.messageSoTK = "Không tồn tại tài khoản nhận này";
        }
        else if (res.status === 200) {
          this.guiMaOTP(res.data.id, res.data.hoTen);
        }
        
      }).catch(err => {
        if(err.response.status === 409){
          this.messageSoTK = "Tài khoản nhận là tài khoản của bạn";
        }
        else {
          this.message = "Có lỗi xảy ra. Vui lòng thử lại sau";
          this.erro = true;
          this.show = true;
        }
      })
    },

    async guiMaOTP(userIdNhan, hoTen){
      const accessToken = await this.getToken();
      

      const data = {
        userIdNhan: userIdNhan,
        soTK: this.soTK,
        hoTen: hoTen,
        giaoDich: this.giaoDich,
        noiDung: this.noiDung
      }

      axios({
        method: "get",
        url: "/chuyenkhoan/getotp",
        headers:{
          "x-access-token" : accessToken
        }
      });

      this.setChuyenKhoan(data);
      this.$router.push({path: 'xacnhanchuyenkhoan'});
    },

    getSoTK(e){
      let val = e.target.value;
      if(val){
        this.soTK = val;
      }
    },

    async fetchThietLap(){
      // this.dsThietLap = [
      //   {soTK: "NH1000", hoTen: "Nguyễn Văn A"},
      //   {soTK: "NH1001", hoTen: "Nguyễn Văn C"},
      //   {soTK: "NH1002", hoTen: "Nguyễn Văn B"}
      // ]

      const accessToken = await this.getToken();

      axios({
        method: "get",
        url: "/thietlapnguoinhan/",
        headers:{
          "x-access-token" : accessToken
        }
      }).then(res => {
        this.dsThietLap = res.data
      }).catch(err => {
        // this.message = "Có lỗi xảy ra. Vui lòng thử lại sau";
        // this.erro = true;

      });
    },

    // chuyenKhoan(){
    //   const accessToken = await this.getToken();

    //   const data = {
    //     giaoDich: this.giaoDich,
    //     noiDung: this.noiDung,
    //     userIdNhan: this.soTK
    //   };

    //   this.show = true;
    //   axios({
    //     method: "post",
    //     url: "/chuyenkhoan/noibo",
    //     headers:{
    //       "x-access-token" : accessToken
    //     },
    //     data: data
    //   }).then(res => {
    //     if(res.status === 201){
    //       this.message = "Chuyển khoản thành công";
    //       this.erro = false;   
    //     }
    //     else if (res.status === 204){
    //       this.message = "Không đủ tiền hoặc người nhận không tồn tại";
    //       this.erro = true;
    //     }
    //     else if (res.status === 400){
    //       this.message = "Số tiền chuyển khoản sai";
    //       this.erro = true;
    //     }
    //     else if (res.status === 409){
    //       this.message = "Người gửi và người nhận là một. Vui lòng chọn số tài khoản khác";
    //       this.erro = true;
    //     }
    //   }).catch(err => {
    //     this.message = "Giao dịch chuyển khoản thất bại. Vui lòng thử lại sau";
    //     this.erro = true;
    //     //console.log(err);
    //   });
    // },

    // changePassword(e){
    //   const data = {
    //     passwordOld: this.passwordOld,
    //     password: this.password
    //   };
    //   this.show = true;
    //   axios({
    //     method: "patch",
    //     url: "/taikhoannganhang/security",
    //     headers:{
    //       "x-access-token" : localStorage.getItem("accessToken")
    //     },
    //     data: data
    //   }).then(res => {
    //     if(res.status === 200){
    //       const message = res.data.message
    //       if(message == "success"){
    //         this.message = "Cập nhật thành công";
    //         this.erro = false;
    //       } else if (message == "failed"){
    //         this.message = "Password mới trùng với password hiện tại";
    //         this.erro = true;
    //       } else {
    //         this.message = "Nhập sai password hiện tại";
    //         this.erro = true;
    //       }    
    //     }
    //     else{
    //       this.message = "Này động này bị cấm";
    //       this.erro = true;
    //     }
    //   }).catch(err => {
    //     this.message = "Đã có lỗi xảy ra vui lòng liên hệ Admin";
    //     this.erro = true;
    //     //console.log(err);
    //   });

    //   this.clearPassword();
    // },
    // clearPassword(){
    //   this.password = "";
    //   this.passwordOld = "";
    // }
  }
};
</script>
<style scoped>
  .radio-soTK{
    padding-left:15px;
  }
</style>>
