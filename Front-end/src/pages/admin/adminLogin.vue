<template>
<div class="centered-container">
    <md-content class="md-elevation-3">

      <div class="title">
        <img src="@/assets/img/logo.png">
        <div class="md-title">Internet Banking</div>
        <div class="md-body-2">Đăng nhập Hệ thống Admin</div>
      </div>

      <form @submit.prevent="submit">
      <div class="form">
        <md-field>
          <label>Username</label>
          <md-input v-model="username" required autofocus></md-input>
        </md-field>

        <md-field md-has-password>
          <label>Password</label>
          <md-input v-model="password" required type="password"></md-input>
        </md-field>
        <span class="help-block" ><h3>{{ message }}</h3></span>
      </div>

      <div class="actions md-layout md-alignment-center-space-between">
        <b-link to="/forgot"></b-link>
        <md-button class="md-raised md-primary" type="submit">Log in</md-button>
      </div>
      </form>

    </md-content>
    <div class="background" />
    <vue-recaptcha
      ref="recaptcha"
      @verify="onCaptchaVerified"
      @expired="onCaptchaExpired"
      size="invisible"
      sitekey="6Lca6tgUAAAAAFNKnT7nhWdiRp9Vb1AjidAGeiXW"
    ></vue-recaptcha>
  </div>
</template>

<script>
import axios from "axios";
import Router from "vue-router";
import VueRecaptcha from "vue-recaptcha";
import { mapActions } from 'vuex';

export default {
  components: { VueRecaptcha },
  data() {
    return {
      username: "",
      password: "",
      message: "",
      error: false
    };
  },
  created() {
    this.checkCurrentLogin();
  },
  updated() {
    this.checkCurrentLogin();
  },
  methods: {
     ...mapActions(["isLogin"]),
    submit: function() {
      // this.status = "submitting";
       this.$refs.recaptcha.execute();
    },
    checkCurrentLogin() {
      //goi api truy van accesstoken
      if (localStorage.accessToken) {
        this.$router.replace(this.$route.query.redirect || "/admin");
      }
    },
    onCaptchaVerified(recaptchaToken) {
      const self = this;
           //self.status = "submitting";
          // console.log(recaptchaToken);
      self.$refs.recaptcha.reset();
      axios
        .post("/auth/admin", {
          username: this.username,
          password: this.password,
          recaptchaToken: recaptchaToken
        })
        .then(resp => {
          //console.log(resp.data);
          var accesstoken = resp.data.accessToken;
          var rftoken = resp.data.refreshToken;
          if (!accesstoken) {
            this.loginFailed();
            return;
          }
          localStorage.setItem("accessToken", accesstoken);
          localStorage.setItem("refreshToken", rftoken);
          this.isLogin(accesstoken);
          this.$router.replace(this.$route.query.redirect || "/admin");
        })
        .catch(() => {
          this.loginFailed();
          return;
        });
    },
    onCaptchaExpired: function() {
      this.$refs.recaptcha.reset();
    },
    loginFailed() {
      this.error = true;
      this.message = "Đăng nhập thất bại";
      //this.$store.dispatch("logout"); // <=
      delete localStorage.accessToken;
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
    //background: url("../../assets/img/bg-1.jpg");
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