<template>
  <md-toolbar md-elevation="0" class="md-transparent">
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-start">
        <h3 class="md-title">{{ $route.name }}</h3>
      </div>
      <div class="md-toolbar-section-end">
        <md-button
          class="md-just-icon md-simple md-toolbar-toggle"
          :class="{ toggled: $sidebar.showSidebar }"
          @click="toggleSidebar"
        >
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </md-button>

        <div class="md-collapse">
          <!-- <div class="md-autocomplete">
            <md-autocomplete
              class="search"
              v-model="selectedEmployee"
              :md-options="employees"
            >
              <label>Search...</label>
            </md-autocomplete>
          </div>-->
          <md-list>
            <md-list-item to="/">
              <i class="material-icons">dashboard</i>
              <p class="hidden-lg hidden-md">Dashboard</p>
            </md-list-item>
            <template>
              <md-list-item to="/user">
                <i class="material-icons">person</i>
                <p class="hidden-lg hidden-md">Profile</p>
              </md-list-item>
              <md-list-item >
                <b-link @click="signOutUser">
                  <i class="material-icons">logout</i>
                </b-link>
                <!-- <p class="hidden-lg hidden-md">Profile</p> -->
              </md-list-item>
            </template>
          </md-list>
        </div>
      </div>
    </div>
  </md-toolbar>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      isLogin: false
    };
  },
  methods: {
    ...mapActions(["signOut", "autoRefresh"]),
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    async signOutUser(){
      var accessToken = localStorage.getItem("accessToken");
      var rfToken = localStorage.getItem("refreshToken");
      //set token
      const token = {
        accessToken, 
        rfToken 
      }
      const res = await this.autoRefresh(token);
      if(res !== null && res.data.accessToken){
        accessToken = res.data.accessToken;
      }
      axios.get('/auth/logout', {
      headers: {
        "x-access-token": accessToken
      }
      }).then(res => {
        delete localStorage.accessToken;
        delete localStorage.refreshToken;
        this.signOut(localStorage.accessToken);
        this.$router.push('/login');
      }).catch(err => {
        console.log(err);
      });
    }
  }
};
</script>
<style scoped>

</style>>
