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
            <form class="form-signin" @submit.prevent="login">
              <h3>Login</h3>
              <b-input-group size="lg" class="mb-3 mt-5">
                <b-input-group-prepend>
                  <span class="input-group-text">
                    <i class="fas fa-user"></i>
                  </span>
                </b-input-group-prepend>
                <b-form-input
                  v-model="username"
                  type="username"
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
              <button class="btn btn-lg btn-primary btn-block btnSubmit" type="submit">Login</button>
            </form>
            <!-- capcha -->

            <div class="mt-4">
              <div class="d-flex justify-content-center links">
                Don't have an account?
                <a href="#" class="ml-2">Sign Up</a>
              </div>
              <div class="d-flex justify-content-center links">
                <a href="#">Forgot your password?</a>
              </div>
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Router from "vue-router";
export default {
  data() {
    return {
      username: "",
      password: "",
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
    checkCurrentLogin() {
      //goi api truy van accesstoken
      if (localStorage.accessToken) {
        this.$router.replace(this.$route.query.redirect || "/user");
      }
    },
    login() {
      axios
        .post("http://localhost:3000/api/auth", {
          user: this.username,
          pwd: this.password
        })
        .then(resp => {
          var token = resp.data.accessToken;
          if (!token) {
            this.loginFailed();
            return;
          }
          localStorage.setItem("accessToken", token);
          this.$router.replace(this.$route.query.redirect || "/user");
        })
        .catch(() => {
          this.loginFailed();
          return;
        });
    },
    loginFailed() {
      this.error = "Login failed!";
      this.$store.dispatch("logout"); // <=
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
.layout-item
{
    max-width: 650px;
    margin: auto;
}
.form-sigin {
  max-width: 500px;
}
</style>