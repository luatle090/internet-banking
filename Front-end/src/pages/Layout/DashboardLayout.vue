<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">

    <side-bar>
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/dashboard">
        <md-icon>dashboard</md-icon>
        <p>Dashboard</p>
      </sidebar-link>

      <sidebar-link to="/user">
        <md-icon>person</md-icon>
        <p>Thay Đổi Password</p>
      </sidebar-link>
      <sidebar-link to="/taikhoannganhang">
        <md-icon>account_balance</md-icon>
        <p>tai khoan ngan hang</p>
      </sidebar-link>
      <li to="/">
        <a href="#" v-b-toggle.collapse-lichsu class="nav-link sidebar-menu-item">
          <md-icon>history</md-icon>
          <p>Lịch sử giao dịch <b class="caret"></b></p></a>
          <b-collapse id="collapse-lichsu" accordion="my-accordion" style="animation-fill-mode: both; animation-timing-function: ease-out;">
            <sidebar-link to="/lichsuchuyenkhoan">
              <p>lịch sử chuyển khoản</p>
            </sidebar-link>
            <sidebar-link to="/lichsunhantien">
              <p>lịch sử nhận tiền</p>
            </sidebar-link>
          </b-collapse>
      </li>

      <li to="/">
        <a href="#" v-b-toggle.collapse-chuyenkhoan class="nav-link sidebar-menu-item">
          <md-icon>payment</md-icon>
          <p>Chuyển khoản <b class="caret"></b></p></a>
          <b-collapse id="collapse-chuyenkhoan" accordion="my-accordion" style="animation-fill-mode: both; animation-timing-function: ease-out;">
            <sidebar-link to="/chuyenkhoannoibo">
              <p>chuyển khoản nội bộ</p>
            </sidebar-link>
            <sidebar-link to="/">
              <p>chuyển khoản liên ngân hàng</p>
            </sidebar-link>
          </b-collapse>
      </li>
      <sidebar-link to="/nhacno">
        <md-icon>content_paste</md-icon>
        <p>Nhắc nợ</p>
      </sidebar-link>
      <sidebar-link to="/thietlapnguoinhan">
        <md-icon>content_paste</md-icon>
        <p>Thiết lập người nhận</p>
      </sidebar-link>
      <!-- <sidebar-link to="/typography">
        <md-icon>library_books</md-icon>
        <p>Typography</p>
      </sidebar-link>
      <sidebar-link to="/icons">
        <md-icon>bubble_chart</md-icon>
        <p>Icons</p>
      </sidebar-link> -->
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content></dashboard-content>

      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<style lang="scss"></style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "@/pages/Layout/MobileMenu.vue";

export default {
  components: {
    TopNavbar,
    DashboardContent,
    ContentFooter,
    MobileMenu
  }
};
</script>
