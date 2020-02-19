-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th2 19, 2020 lúc 10:19 AM
-- Phiên bản máy phục vụ: 5.7.9
-- Phiên bản PHP: 7.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `qlnganhang`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bangphi`
--

DROP TABLE IF EXISTS `bangphi`;
CREATE TABLE IF NOT EXISTS `bangphi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Phi` double DEFAULT '0',
  `MoTa` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `bangphi`
--

INSERT INTO `bangphi` (`id`, `Phi`, `MoTa`) VALUES
(1, 10000, 'Phí chuyển khoản'),
(2, 10000, 'Phí nhắc nợ');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khachhang`
--

DROP TABLE IF EXISTS `khachhang`;
CREATE TABLE IF NOT EXISTS `khachhang` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hoTen` varchar(50) NOT NULL,
  `email` varchar(200) NOT NULL,
  `phone` varchar(12) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `khachhang`
--

INSERT INTO `khachhang` (`id`, `hoTen`, `email`, `phone`) VALUES
(1, 'Lê Luật', 'mail@gmail.com', ''),
(2, 'Đinh Long', 'mail2@gmail.com', ''),
(3, 'Nguyễn Jang Mi', 'mail3@gmail.com', NULL),
(4, 'Nguyễn Amee', 'mail4@gmail.com', NULL),
(5, 'Nguyễn Bảo Thy', 'mail5@gmail.com', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lichsuchuyenkhoan`
--

DROP TABLE IF EXISTS `lichsuchuyenkhoan`;
CREATE TABLE IF NOT EXISTS `lichsuchuyenkhoan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ngay` datetime NOT NULL,
  `idTaiKhoanNHGui` int(11) NOT NULL,
  `soTaiKhoanNhan` varchar(100) NOT NULL,
  `giaoDich` double NOT NULL COMMENT 'Là số tiền',
  `noiDungChuyen` varchar(100) DEFAULT NULL,
  `nganHangNhan` varchar(45) DEFAULT NULL,
  `idNhacNo` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_LichSuChuyenKhoan_TaiKhoan1_idx` (`idTaiKhoanNHGui`),
  KEY `fk_LichSuChuyenKhoan_NhacNo1_idx` (`idNhacNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lichsunhantien`
--

DROP TABLE IF EXISTS `lichsunhantien`;
CREATE TABLE IF NOT EXISTS `lichsunhantien` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ngay` datetime NOT NULL,
  `idTaiKhoanNHNhan` int(11) NOT NULL,
  `soTaiKhoanGui` varchar(100) DEFAULT NULL,
  `giaoDich` varchar(45) DEFAULT NULL COMMENT 'Là số tiền',
  `nganHangGui` varchar(45) DEFAULT NULL,
  `noiDungNhan` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_LichSuNhanTien_TaiKhoan1_idx` (`idTaiKhoanNHNhan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhacno`
--

DROP TABLE IF EXISTS `nhacno`;
CREATE TABLE IF NOT EXISTS `nhacno` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idTaiKhoanNH` int(11) NOT NULL,
  `idTaiKhoanTao` int(11) NOT NULL,
  `tienNo` double NOT NULL COMMENT 'Là số tiền',
  `noiDung` varchar(100) DEFAULT NULL,
  `tinhTrang` varchar(45) DEFAULT NULL,
  `ngayTao` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ThongBaoNhacNo_TaiKhoanNganHang1_idx` (`idTaiKhoanNH`),
  KEY `fk_NhacNo_TaiKhoanNganHang1_idx` (`idTaiKhoanTao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhanvien`
--

DROP TABLE IF EXISTS `nhanvien`;
CREATE TABLE IF NOT EXISTS `nhanvien` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `hoTen` varchar(45) DEFAULT NULL,
  `diaChi` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `idVaiTro` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `fk_NhanVien_VaiTro1_idx` (`idVaiTro`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `nhanvien`
--

INSERT INTO `nhanvien` (`id`, `username`, `password`, `hoTen`, `diaChi`, `email`, `idVaiTro`) VALUES
(1, 'nv1', '1', 'Nhân Viên', NULL, NULL, 1),
(2, 'nv2', '1', 'Nhân Viên 2', NULL, NULL, 1),
(3, 'ql', '1', 'Quản Lý', NULL, NULL, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taikhoannganhang`
--

DROP TABLE IF EXISTS `taikhoannganhang`;
CREATE TABLE IF NOT EXISTS `taikhoannganhang` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tenDangKy` varchar(45) DEFAULT NULL,
  `tenGoiNho` varchar(45) DEFAULT NULL,
  `soDu` double DEFAULT NULL,
  `soTK` double NOT NULL COMMENT 'Số tài khoản',
  `idKhachHang` int(11) NOT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `soTK_UNIQUE` (`soTK`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `fk_TaiKhoanNganHang_KhachHang1_idx` (`idKhachHang`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `taikhoannganhang`
--

INSERT INTO `taikhoannganhang` (`id`, `tenDangKy`, `tenGoiNho`, `soDu`, `soTK`, `idKhachHang`, `username`, `password`) VALUES
(6, 'Amee', NULL, 1000000, 1, 4, 'kh1', '$2a$08$y9hgU1DruwVhOt70UIwXUesrJxeTElovqooUvasEFTtbdW69rvVz.'),
(7, 'DinhLong', NULL, 1000000, 2, 2, 'kh2', '$2a$08$jDOMqbmVeXOslGYilubHeeXrhlznnsTCVvTBVIxhXd5dXC/Of/ef.'),
(8, 'JangMi', NULL, 1000000, 3, 3, 'kh3', '$2a$08$a5aFVQJH/f9iElQX8W/AWelh.R/M0Dwjy9wWubUqGr8XDwA8uAWJC'),
(9, 'ijji', NULL, 1000000, 4, 1, 'kh4', '$2a$08$37ZCdnPhE1YYcJ5YFrVJbucZ7June1sskVsuy27CeWf7paTtLnri6'),
(10, 'superstar', 'supertstar', 1000000, 5, 5, 'kh5', '$2a$08$m.SpvGRjQfyXkmGwMQh0jub9DH7Y0w1amP8JpPhu32gJ9q9B4rFDq');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taikhoantietkiem`
--

DROP TABLE IF EXISTS `taikhoantietkiem`;
CREATE TABLE IF NOT EXISTS `taikhoantietkiem` (
  `id` int(11) NOT NULL,
  `idTaiKhoan` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_TaiKhoanTietKiem_TaiKhoanNganHang1_idx` (`idTaiKhoan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thietlapnguoinhan`
--

DROP TABLE IF EXISTS `thietlapnguoinhan`;
CREATE TABLE IF NOT EXISTS `thietlapnguoinhan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idTaiKhoanNHGui` int(11) NOT NULL,
  `soTaiKhoanNhan` varchar(45) NOT NULL,
  `nganHang` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_DanhSachNguoiNhan_TaiKhoan1_idx` (`idTaiKhoanNHGui`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vaitro`
--

DROP TABLE IF EXISTS `vaitro`;
CREATE TABLE IF NOT EXISTS `vaitro` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `moTa` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `vaitro`
--

INSERT INTO `vaitro` (`id`, `moTa`) VALUES
(1, 'Nhân Viên'),
(2, 'Quản lý');

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `lichsuchuyenkhoan`
--
ALTER TABLE `lichsuchuyenkhoan`
  ADD CONSTRAINT `fk_LichSuChuyenKhoan_NhacNo1` FOREIGN KEY (`idNhacNo`) REFERENCES `nhacno` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_LichSuChuyenKhoan_TaiKhoan1` FOREIGN KEY (`idTaiKhoanNHGui`) REFERENCES `taikhoannganhang` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `lichsunhantien`
--
ALTER TABLE `lichsunhantien`
  ADD CONSTRAINT `fk_LichSuNhanTien_TaiKhoan1` FOREIGN KEY (`idTaiKhoanNHNhan`) REFERENCES `taikhoannganhang` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `nhacno`
--
ALTER TABLE `nhacno`
  ADD CONSTRAINT `fk_NhacNo_TaiKhoanNganHang1` FOREIGN KEY (`idTaiKhoanTao`) REFERENCES `taikhoannganhang` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_ThongBaoNhacNo_TaiKhoanNganHang1` FOREIGN KEY (`idTaiKhoanNH`) REFERENCES `taikhoannganhang` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `nhanvien`
--
ALTER TABLE `nhanvien`
  ADD CONSTRAINT `fk_NhanVien_VaiTro1` FOREIGN KEY (`idVaiTro`) REFERENCES `vaitro` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `taikhoannganhang`
--
ALTER TABLE `taikhoannganhang`
  ADD CONSTRAINT `fk_TaiKhoanNganHang_KhachHang1` FOREIGN KEY (`idKhachHang`) REFERENCES `khachhang` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `taikhoantietkiem`
--
ALTER TABLE `taikhoantietkiem`
  ADD CONSTRAINT `fk_TaiKhoanTietKiem_TaiKhoanNganHang1` FOREIGN KEY (`idTaiKhoan`) REFERENCES `taikhoannganhang` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `thietlapnguoinhan`
--
ALTER TABLE `thietlapnguoinhan`
  ADD CONSTRAINT `fk_DanhSachNguoiNhan_TaiKhoan1` FOREIGN KEY (`idTaiKhoanNHGui`) REFERENCES `taikhoannganhang` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
