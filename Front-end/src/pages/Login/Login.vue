<template>
  <div class="content login-wrapper">
    <div class="md-layout">
      <div class="layout-item">
        <md-card>
          <md-card-header>
            <div class="d-flex justify-content-end social_icon">
              <img
                class="sp-default-logo hidden-xs"
                src="https://www.hcmus.edu.vn/images/logo81.png"
                alt="Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM"
              />
            </div>
          </md-card-header>
          <md-card-content>
            <!-- form đăng nhập -->
            <form class="form-signin" @submit.prevent="submit">
              <h3>Login</h3>
              <b-alert show dismissible v-if="error">{{ message }}</b-alert>
              <b-input-group size="lg" class="mb-3 mt-5">
                <b-input-group-prepend>
                  <span class="input-group-text">
                    <i class="fas fa-user"></i>
                  </span>
                </b-input-group-prepend>
                <b-form-input
                  v-model="username"
                  type="text"
                  id="username"
                  class="form-control"
                  placeholder="Username"
                  required
                  autofocus
                />
              </b-input-group>

              <b-input-group size="lg" class="mb-2">
                <b-input-group-prepend>
                  <span class="input-group-text">
                    <i class="fas fa-key"></i>
                  </span>
                </b-input-group-prepend>
                <input
                  v-model="password"
                  type="password"
                  id="password"
                  class="form-control"
                  placeholder="Password"
                  required
                />
              </b-input-group>
              <button
                :disabled="status==='submitting'"
                class="btn btn-lg btn-primary btn-block btnSubmit"
                type="submit"
              >Login</button>
            </form>
            <!-- capcha -->
            <div class="mt-4">
              <div class="d-flex justify-content-center links">
                <b-link to="/forgot">Quên mật khẩu?</b-link>
              </div>
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>
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
export default {
  components: { VueRecaptcha },
  data() {
    return {
      username: "",
      password: "",
      message: "",
      error: false,
      status: ""
    };
  },
  created() {
    this.checkCurrentLogin();
  },
  updated() {
    this.checkCurrentLogin();
  },
  methods: {
    submit: function() {
      // this.status = "submitting";
       this.$refs.recaptcha.execute();
    },
    checkCurrentLogin() {
      //goi api truy van accesstoken
      // if (localStorage.accessToken) {
      //   this.$router.replace(this.$route.query.redirect || "/user");
      // }
    },
    onCaptchaVerified(recaptchaToken) {
      const self = this;
           //self.status = "submitting";
          // console.log(recaptchaToken);
      self.$refs.recaptcha.reset();
      axios
        .post("/auth", {
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
          this.$router.push(this.$route.query.redirect || "/");
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

<style lang="css">
h3 {
  text-align: center;
}

.btnSubmit {
  width: 50%;
  border-radius: 1rem;
  padding: 1.5%;
  border: none;
  cursor: pointer;
  margin: auto;
  margin-top: 45px;
}
/* .content {
  background: rgb(22, 195, 247);
} */
.login-wrapper {
  background: rgb(41, 175, 209);
}
.layout-item {
  max-width: 650px;
  margin: auto;
}
.form-sigin {
  max-width: 500px;
}
</style>
