import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile/UserProfile.vue";
import TableList from "@/pages/TableList.vue";
import Typography from "@/pages/Typography.vue";
import Icons from "@/pages/Icons.vue";
import Login from "@/pages/Auth/LoginUser.vue";
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
        path: "chuyenkhoannoibo",
        name: "Chuyển khoản",
        component: () => import("../pages/ChuyenKhoan/chuyenKhoanNoiBo")
      },
      {
        path: "xacnhanchuyenkhoan",
        name: "Xác nhận Chuyển khoản",
        component: () => import("../pages/ChuyenKhoan/xacNhanChuyenKhoanNoiBo")
      },
      {
        path: "cklnh",
        name: "Chuyển khoản liên ngân hàng",
        component: () => import("../pages/ChuyenKhoan/chuyenKhoanLienNganHang")
      },
      {
        path: "xacnhancklnh",
        name: "Xác nhận chuyển khoản liên ngân hàng",
        component: () => import("../pages/ChuyenKhoan/xacNhanChuyenKhoanLienNganHang")
      },
      {
        path: "nhacno",
        name: "Nhắc nợ",
        component: () => import("../pages/NhacNo/NhacNo")
      },
      {
        path: "taonhacno",
        name: "Tạo Nhắc nợ",
        component: () => import("../pages/NhacNo/TaoNhacNo")
      },
      {
        path: "thietlapnguoinhan",
        name: "Thiết lập người nhận",
        component: () => import("../pages/customer/thietlapnguoinhan")
      },
      {
        path: "no",
        name: "Xem nợ",
        component: () => import("../pages/No/XemNo")
      }
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/forgot",
    name: "Forgot Password",
    component: () => import("../pages/Auth/ForgotPassword")
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
        path: "danhsachnhanvien",
        name: "Danh Sách Nhân Viên",
        component: () => import("../pages/admin/nhanvien/dsnhanvien")
      },
      {
        path: "danhsachkhachhang",
        name: "Danh Sách Khách Hàng",
        component: () => import("../pages/admin/employee/dskhachhang")
      },
      {
        path: "lichsugiaodich",
        name: "Lịch sử giao dịch",
        component: () => import("../pages/admin/employee/lichsugiaodich")
      },
      {
        path: "doisoat",
        name: "Đối soát",
        component: () => import("../pages/admin/employee/doisoat")
      },
      {
        path: "dashboard",
        name: "Dashboard Admin",
        component: () => import("../pages/admin/DashboardAdmin")
      },
      {
        path: "logout",
        name: "Admin Logout",
        component: () => import("../pages/admin/adminLogout")
      },
    ]
  },
  { 
    path: '*', 
    component: NotFoundComponent 
  }
     
];

export default routes;
