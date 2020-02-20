import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
import TableList from "@/pages/TableList.vue";
import Typography from "@/pages/Typography.vue";
import Icons from "@/pages/Icons.vue";
import Maps from "@/pages/Maps.vue";
import Notifications from "@/pages/Notifications.vue";
import UpgradeToPRO from "@/pages/UpgradeToPRO.vue";
import Login from "@/pages/Login/Login.vue";
import Logout from "@/pages/Logout.vue"
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
        path: "maps",
        name: "Maps",
        meta: {
          hideFooter: true
        },
        component: Maps
      },
      {
        path: "notifications",
        name: "Notifications",
        component: Notifications
      },
      {
        path: "upgrade",
        name: "Upgrade to PRO",
        component: UpgradeToPRO
      },
      {
        path: "taikhoannganhang",
        name: "Tài Khoản Ngân Hàng",
        component: () => import("./../pages/customer/taikhoannganhang")
      },
      {
        path: "danhsachkhachhang",
        name: "Danh Sách Khách Hàng",
        component: () => import("./../pages/employee/dskhachhang")
      },
      {
        path: "lichsuchuyenkhoan",
        name: "Lịch Sử Chuyển Khoản",
        component: () => import("./../pages/customer/lichSuChuyenKhoan")
      },
      {
        path: "lichsunhantien",
        name: "Lịch Sử Nhận Tiền",
        component: () => import("./../pages/customer/lichSuNhanTien")
      },
      {
        path: "/login",
        name: "Login",
        component: Login
        },
           {
        path: "/logout",
        name: "Logout",
        component: Logout
        }
        ],
     }
     
];

export default routes;
