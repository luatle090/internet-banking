// =========================================================
// * Vue Material Dashboard - v1.3.2
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vue-material-dashboard
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
// * Licensed under MIT (https://github.com/creativetimofficial/vue-material-dashboard/blob/master/LICENSE.md)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import "./plugins/bootstrap-vue";
import VueSweetalert2 from 'vue-sweetalert2'
import VueRouter from "vue-router";
import App from "./App";
import axios from "axios";


import 'sweetalert2/dist/sweetalert2.min.css';

// router setup
import routes from "./routes/routes";

// Plugins
import GlobalComponents from "./globalComponents";
import GlobalDirectives from "./globalDirectives";

// MaterialDashboard plugin
import MaterialDashboard from "./material-dashboard";

import Chartist from "chartist";

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  mode: 'history',
  linkExactActiveClass: "nav-item active"
});

Vue.prototype.$Chartist = Chartist;

Vue.use(VueRouter);
Vue.use(MaterialDashboard);
Vue.use(GlobalComponents);
Vue.use(GlobalDirectives);
Vue.use(VueSweetalert2);

axios.defaults.baseURL = "http://localhost:3000/api";
var isAuthenticated = true

//check expire token
// axios.interceptors.response.use(response => {
//     return response;
// },
// error => {
//   const { config, response: { status } } = error
//   const originalRequest = config

//   if(status === 401){
//     //router.push({ name: "login" });
//     return Promise.reject(false);
//   }

//   if (status === 403) {
//     if (!isAuthenticated) {
//       isAuthenticated = true
//       //call new token  
//       axios.post("/renew-token", {
//         refreshToken: localStorage.getItem("refreshToken")
//       }).then(response => {
//         var accessToken = response.data.accessToken;
//         console.log("access", accessToken);
//         isAuthenticated = false;
//         localStorage.setItem("accessToken", accessToken)
//       })
//       .catch(error => {
//         console.log(error)
//       });
//     }

//     console.log(originalRequest);
//     const retryOriginalRequest = new Promise((resolve) => {
//         resolve(axios(originalRequest))
//     })
//     return retryOriginalRequest
//   }
//   return Promise.reject(error);
// });

//redirect page
// router.beforeEach((to, from, next) => {
//   if (to.path.includes("admin") && to.matched.some(record => record.meta.requiresAuth)) {
//     // this route requires auth, check if logged in
//     // if not, redirect to login page.
    
//     if (!isAuthenticated && to.path !== "/admin/login") {
//       next({
//         path: '/admin/login'
//       })
//     } else {
//       next()
//     }
//   } else {
//     if(!isAuthenticated && to.path !== "/login" && !to.path.includes("admin"))
//       next('/login')
//     else{
//       next();
//     }
//   }
// });

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App),
  router,
  data: {
    Chartist: Chartist
  }
});
