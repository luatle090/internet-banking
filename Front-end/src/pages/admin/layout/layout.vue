<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar>
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/admin/dashboard">
        <md-icon>dashboard</md-icon>
        <p>Dashboard</p>
      </sidebar-link>
      <sidebar-link v-if="this.isNhanVien===false" to="/admin/danhsachnhanvien">
        <md-icon>content_paste</md-icon>
        <p>danh sách nhân viên</p>
      </sidebar-link>
      <sidebar-link v-else to="/admin/danhsachkhachhang">
        <md-icon>content_paste</md-icon>
        <p>Danh sách khách hàng</p>
      </sidebar-link>
      <sidebar-link v-if="this.isNhanVien===false" to="/admin/lichsugiaodich">
        <md-icon>content_paste</md-icon>
        <p>lịch sử giao dịch</p>
      </sidebar-link>
      <sidebar-link to="/admin/doisoat">
        <md-icon>content_paste</md-icon>
        <p>Đối soát</p>
      </sidebar-link>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content></dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss"></style>
<script>
import TopNavbar from "./TopNavbarAdmin.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "@/pages/Layout/MobileMenu.vue";
import jwt from "jsonwebtoken";
export default {
  name: "admin",
  components: {
    TopNavbar,
    DashboardContent,
    ContentFooter,
    MobileMenu
  },

  data() {
    return {
      isNhanVien: true
    };
  },
mounted() {
   this.role();
  },
  methods: {
   role() {
      const sss = jwt.decode(localStorage.getItem("accessToken"));
      console.log(sss.vaiTro);
      this.isNhanVien = sss.vaiTro === 1 ? true : false;
    },
  }
};
</script>
