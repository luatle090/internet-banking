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
            <md-list-item to="/admin">
              <i class="material-icons">dashboard</i>
              <p class="hidden-lg hidden-md">Dashboard</p>
            </md-list-item>
            <template>
              <md-list-item>
                <b-link @click="signOutUser">
                  <i class="material-icons">logout</i>
                </b-link>
                <!-- <p class="hidden-lg hidden-md">Profile</p> -->
              </md-list-item>
            </template>
            <li class="md-list-item">
              <a
                href="#/notifications"
                class="md-list-item-router md-list-item-container md-button-clean dropdown"
              >
              </a>
            </li>
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
    ...mapActions(["signOut"]),
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    signOutUser(){
      axios.get('/auth/logout', {
      headers: {
        "x-access-token": localStorage.getItem("accessToken")
      }
      }).then(res => {
        delete localStorage.accessToken;
        delete localStorage.refreshToken;
        this.signOut(localStorage.accessToken);
        this.$router.push('/admin/login');
      }).catch(err => {
        console.log(err);
      });
    }
  }
};
</script>
<style lang="css"></style>
