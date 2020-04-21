<template>
<div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-100">
        <b-alert v-model="show" :variant="erro ? 'danger' : 'success'"  dismissible>{{ message }}</b-alert>
        <form v-on:submit.prevent="taoNhacNo">
          <md-card>
            <md-card-header data-background-color="green">
              <h4 class="title">{{ title }}</h4>
            </md-card-header>
            <md-card-content>
              <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-100">
                  <md-field>
                    <label>Số tài khoản nợ</label>
                    <md-input required  @change="truyVanSoTK" v-model.trim="soTK" type="text" ></md-input>
                  </md-field>
                  <span class="help-block" ><h3>{{ messageSoTK }}</h3></span>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-100">
                  <md-field>
                    <label>Họ tên</label>
                    <md-input v-bind:value="hoTen" disabled type="text" ></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-100">
                  <md-field>
                    <label>Tiền nợ</label>
                    <md-input required v-model.number="tienNo" type="number"> </md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-100">
                  <md-field>
                    <label>Nội dung</label>
                    <md-input v-model.trim="noiDung" type="text" ></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-100 text-right">
                  <md-button type="button" to="/nhacno" class="btn-huy md-raised md-danger">Quay lại</md-button>
                  <md-button type="submit" class="md-raised md-success">Tạo nhắc nợ</md-button>
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
import { VMoney } from "v-money";
import { mapActions } from "vuex";

export default {
  name: "taoNhacNo",
  data() {
    return {
      erro: false,
      show: false,
      soTK: "",
      idTaiKhoanNo: "",
      hoTen: "",
      tienNo: null,
      noiDung: "",
      message: "",
      messageSoTK : "",
      title: "Tạo nhắc nợ"
    };
  },

  methods: {
    ...mapActions(["getToken"]),

    async truyVanSoTK(){
        const accessToken = await this.getToken();
        this.messageSoTK = "",
        this.hoTen = "";
        this.idTaiKhoanNo = "";
        axios({
            method: "get",
            url: `/taikhoannganhang/${this.soTK}`,
            headers:{
                "x-access-token" : accessToken
            },
        }).then(res => {
            if(res.status === 200){
                this.hoTen = res.data.hoTen;
                this.idTaiKhoanNo = res.data.id
            }
            else if(res.status === 204){
                this.messageSoTK = "Không tồn tại tài khoản này"
                this.soTK = "";
            }
        }).catch(erro => {
            this.show = true;
            this.message = "Có lỗi xảy ra";
            this.erro = true;
        })
    },

    async taoNhacNo(){
      this.show = true;
      const accessToken = await this.getToken();
      const data = {
          idTaiKhoanNo: this.idTaiKhoanNo,
          tienNo: this.tienNo,
          noiDung: this.noiDung
      }

      axios({
        method: "post",
        url: "/nhacno",
        headers:{
            "x-access-token" : accessToken
        },
        data: data
      }).then(res => {
        this.daChuyenXong = true;
        if(res.status === 201){
          this.show = false;
          show = true;
          this.$router.replace({name:'nhacno', params:{show}});
        }
        else if (res.status === 204){
          this.message = "Lỗi tạo nhắc nợ";
          this.erro = true;
        }
      }).catch( err => {
        if (err.response.status === 400){
          this.message = "Nhập thiếu trường dữ liệu";
          this.erro = true;
        }
        else if(err.response.status === 404){
          this.message = "Không tìm thấy tài khoản nhắc nợ";
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
    }
  }
};
</script>
<style scoped>
  .btn-huy{
    margin-right:40px;
  }
</style>>
