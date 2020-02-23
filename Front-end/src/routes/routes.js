import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
import TableList from "@/pages/TableList.vue";
import Typography from "@/pages/Typography.vue";
import Icons from "@/pages/Icons.vue";
import Login from "@/pages/Login/Login.vue";
import Logout from "@/pages/Logout.vue"
import Admin from "@/pages/admin/layout/layout.vue"
import adminLogin from "@/pages/admin/adminLogin.vue"
import NotFoundComponent from "@/pages/NotFound.vue"
const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard
      },
      {
        path: "user",
        name: "User Profile",
        component: UserProfile
      },
      {
        path: "table",
        name: "Table List",
        component: TableList
      },
      {
        path: "typography",
        name: "Typography",
        component: Typography
      },
      {
        path: "icons",
        name: "Icons",
        component: Icons
      },
      {
        path: "taikhoannganhang",
        name: "Tài Khoản Ngân Hàng",
        component: () => import("./../pages/customer/taikhoannganhang")
      },
     
      {
        path: "lichsuchuyenkhoan",
        name: "Lịch Sử Chuyển Khoản",
        component: () => import("../pages/customer/lichSuChuyenKhoan")
      },
      {
        path: "lichsunhantien",
        name: "Lịch Sử Nhận Tiền",
        component: () => import("../pages/customer/lichSuNhanTien")
      },
      {
        path: "/logout",
        name: "Logout",
        component: Logout
      }
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/admin/login",
    name: "Admin Login",
    component: adminLogin
  },
  {
    path: "/admin",
    component: Admin,
    meta: { requiresAuth:true },
    children: [
      {
        path: "danhsachkhachhang",
        name: "Danh Sách Khách Hàng",
        component: () => import("../pages/admin/employee/dskhachhang")
      },
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("../pages/admin/DashboardAdmin")
      }
    ]
  },
  { 
    path: '*', 
    component: NotFoundComponent 
  }
     
];

export default routes;
