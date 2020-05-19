-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 19, 2020 lúc 10:27 AM
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
CREATE DATABASE IF NOT EXISTS `qlnganhang` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `qlnganhang`;

DELIMITER $$
--
-- Thủ tục
--
DROP PROCEDURE IF EXISTS `ChuyenKhoanLienNH`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `ChuyenKhoanLienNH` (`idTaiKhoanChuyen` INT, `soTKNhan` VARCHAR(100), `giaoDichCK` DOUBLE, `ngayCK` DATETIME, `noiDung` VARCHAR(45), `partnerCode` VARCHAR(45), `signature` TEXT, OUT `status` INT)  proc_exit:BEGIN
 	DECLARE tienConLai DOUBLE;

	-- catch error để ROLLBACK khi thực thi transaction bị lỗi
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			-- ERROR
		SET status = 1;
		ROLLBACK;
	END;
	 
	DECLARE EXIT HANDLER FOR SQLWARNING
	 	BEGIN
			-- WARNING
		SET status = 1;
	 	ROLLBACK;
	END;

	START TRANSACTION;
		-- trừ tiền của tài khoản A
		SET @soDuTKChuyen = (SELECT soDu FROM taikhoannganhang WHERE id = idTaiKhoanChuyen);
		SET tienConLai = @soDuTKChuyen - giaoDichCK;

		UPDATE taikhoannganhang SET soDu = tienConLai where id = idTaiKhoanChuyen;
			
		-- thêm vào bảng lịch sử chuyển khoản
		INSERT INTO lichsuchuyenkhoan(ngay, idTaiKhoanNHGui, soTaiKhoanNhan, 
												giaoDich, noiDungChuyen, nganHangNhan, idNhacNo, signature)
		VALUES (ngayCK, idTaiKhoanChuyen, soTKNhan, giaoDichCK, noiDung, partnerCode, NULL, signature);		
	COMMIT;
	SET status = 0;
	
 	
END$$

DROP PROCEDURE IF EXISTS `ChuyenKhoanNoiBo`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `ChuyenKhoanNoiBo` (`idTaiKhoanChuyen` INT, `idTaiKhoanNhan` INT, `giaoDichCK` DOUBLE, `ngayCK` DATETIME, `noiDung` VARCHAR(45), OUT `status` INT)  proc_exit:BEGIN
 	DECLARE tienConLai, soDuMoi DOUBLE;

	-- catch error để ROLLBACK khi thực thi transaction bị lỗi
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			-- ERROR
		SET status = 1;
		ROLLBACK;
	END;
	 
	DECLARE EXIT HANDLER FOR SQLWARNING
	 	BEGIN
			-- WARNING
		SET status = 1;
	 	ROLLBACK;
	END;

	-- kiểm tra tài khoản nhận có tồn tại
	IF NOT EXISTS (SELECT 1 FROM taikhoannganhang where id = idTaiKhoanNhan)
	THEN
		SET status = -1;
		LEAVE proc_exit;
	END IF;

 	-- kiểm tra số tiền trong tài khoản A
 	IF EXISTS (SELECT 1 FROM taikhoannganhang 
 							WHERE id = idTaiKhoanChuyen AND soDu >= giaoDichCK)
 	THEN
		START TRANSACTION;
			-- lấy số tài khoản
			SET @soTKNhan = (SELECT soTK FROM taikhoannganhang where id = idTaiKhoanNhan);
			SET @soTKChuyen = (SELECT soTK FROM taikhoannganhang WHERE id = idTaiKhoanChuyen);
 
  		-- trừ tiền của tài khoản A
  			
  		SET @soDuTKChuyen = (SELECT soDu FROM taikhoannganhang WHERE id = idTaiKhoanChuyen);
  		SET tienConLai = @soDuTKChuyen - giaoDichCK;
  
  		UPDATE taikhoannganhang SET soDu = tienConLai where id = idTaiKhoanChuyen;
  			
  		-- thêm vào bảng lịch sử chuyển khoản
			INSERT INTO lichsuchuyenkhoan(ngay, idTaiKhoanNHGui, soTaiKhoanNhan, 
 													giaoDich, noiDungChuyen, nganHangNhan, idNhacNo)
  		VALUES (ngayCK, idTaiKhoanChuyen, @soTKNhan, giaoDichCK, noiDung, 'HKL Bank', NULL);
  			
			-- thêm vào bảng lịch sử nhận tiền
			INSERT INTO lichsunhantien(ngay, idTaiKhoanNHNhan, soTaiKhoanGui, 
 													giaoDich, nganHangGui, noiDungNhan)
			VALUES (ngayCK, idTaiKhoanNhan, @soTKChuyen, giaoDichCK, 'HKL Bank', noiDung);
 
  		-- thêm tiền vào tài khoản B
				
			SET @soDuTKNhan = (SELECT soDu FROM taikhoannganhang WHERE id = idTaiKhoanNhan);
			SET soDuMoi = @soDuTKNhan + giaoDichCK;
			UPDATE taikhoannganhang SET soDu = soDuMoi WHERE id = idTaiKhoanNhan;
  			
 		COMMIT;
 		SET status = 0;
 	ELSE
		SET status = -1;
	END IF;
	

 	
END$$

DROP PROCEDURE IF EXISTS `NopTien`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `NopTien` (`soTKGui` VARCHAR(100), `soTKNhan` VARCHAR(45), `giaoDichCK` DOUBLE, `ngayCK` DATETIME, `noiDung` VARCHAR(45), `partnerCode` VARCHAR(45), `signature` TEXT, OUT `status` INT)  proc_exit:BEGIN
 	DECLARE soDuMoi DOUBLE;
 	DECLARE idTaiKhoanNhan INT;

	-- catch error để ROLLBACK khi thực thi transaction bị lỗi
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			-- ERROR
		SET status = 1;
		ROLLBACK;
	END;
	 
	DECLARE EXIT HANDLER FOR SQLWARNING
	 	BEGIN
			-- WARNING
		SET status = 1;
	 	ROLLBACK;
	END;

	-- kiểm tra tài khoản nhận có tồn tại
	IF NOT EXISTS (SELECT 1 FROM taikhoannganhang where soTK = soTKNhan)
	THEN
		SET status = -1;
		LEAVE proc_exit;		
	END IF;

	START TRANSACTION;
		SET idTaiKhoanNhan = (SELECT id FROM taikhoannganhang where soTK = soTKNhan);

		-- thêm vào bảng lịch sử nhận tiền
		INSERT INTO lichsunhantien(ngay, idTaiKhoanNHNhan, soTaiKhoanGui, 
												giaoDich, nganHangGui, noiDungNhan, signature)
		VALUES (ngayCK, idTaiKhoanNhan, soTKGui, giaoDichCK, partnerCode, noiDung, signature);

		-- thêm tiền vào tài khoản B
			
		SET @soDuTKNhan = (SELECT soDu FROM taikhoannganhang WHERE id = idTaiKhoanNhan);
		SET soDuMoi = @soDuTKNhan + giaoDichCK;
		UPDATE taikhoannganhang SET soDu = soDuMoi WHERE id = idTaiKhoanNhan;
			
	COMMIT;
	SET status = 0;
	
 	
END$$

DELIMITER ;

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
-- Cấu trúc bảng cho bảng `doitac`
--

DROP TABLE IF EXISTS `doitac`;
CREATE TABLE IF NOT EXISTS `doitac` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `partnerCode` varchar(255) NOT NULL,
  `moTa` varchar(255) DEFAULT NULL,
  `api` varchar(255) DEFAULT NULL,
  `chuanChuKy` char(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `doitac`
--

INSERT INTO `doitac` (`id`, `partnerCode`, `moTa`, `api`, `chuanChuKy`) VALUES
(1, 'ACB', 'Ngan hang ACB', NULL, 'pgp'),
(2, 'SACOM', 'Sacom bank', NULL, 'rsa');

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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `khachhang`
--

INSERT INTO `khachhang` (`id`, `hoTen`, `email`, `phone`) VALUES
(1, 'Lê Luật', 'mail@gmail.com', ''),
(2, 'Đinh Long', 'mail2@gmail.com', ''),
(3, 'Nguyễn Jang Mi', 'mail3@gmail.com', NULL),
(4, 'Nguyễn Amee', 'yso33942@bcaoo.com', NULL),
(5, 'Nguyễn Bảo Thy', 'mail5@gmail.com', NULL),
(8, 'Lê Lê', 'Testing@Testing.com', '2222');

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
  `idNhacNo` int(11) DEFAULT NULL,
  `signature` text,
  PRIMARY KEY (`id`),
  KEY `fk_LichSuChuyenKhoan_TaiKhoan1_idx` (`idTaiKhoanNHGui`),
  KEY `fk_LichSuChuyenKhoan_NhacNo1_idx` (`idNhacNo`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `lichsuchuyenkhoan`
--

INSERT INTO `lichsuchuyenkhoan` (`id`, `ngay`, `idTaiKhoanNHGui`, `soTaiKhoanNhan`, `giaoDich`, `noiDungChuyen`, `nganHangNhan`, `idNhacNo`, `signature`) VALUES
(1, '2020-02-19 20:59:17', 6, '2', 1000, 'đã chuyển', NULL, NULL, NULL),
(2, '2020-02-11 20:59:30', 6, '2', 2000, 'chuyển', NULL, NULL, NULL),
(3, '2020-02-04 20:59:40', 6, '2', 10000, 'aaaa', NULL, NULL, NULL),
(4, '2020-01-28 20:59:50', 6, '2', 1000, 'chuyển rồi', NULL, NULL, NULL),
(5, '2020-03-19 20:37:36', 6, '1', 999978, 'ko co', 'HKL Bank', NULL, NULL),
(6, '2020-03-24 23:20:31', 6, '2', 22, 'cc', 'HKL Bank', NULL, NULL),
(7, '2020-03-24 23:22:47', 6, '2', 22, 'cc', 'HKL Bank', NULL, NULL),
(8, '2020-03-24 23:25:20', 6, '2', 1000, 'cc', 'HKL Bank', NULL, NULL),
(9, '2020-04-01 19:09:46', 6, 'A1', 1, 'cc', 'ACB', NULL, '-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.9.0\r\nComment: https://openpgpjs.org\r\n\r\nwsBcBAEBCgAGBQJehISHAAoJEJfZvPhZijS0xKoH/07AGzwVjdtx7Fs7tIju\r\n7D/CDBfoaeeVagwfQBXFsaCCDef9eocaoL47Ga5JkU+JGWhXE0uQqPOjjzi2\r\nSl2DlS3s6Br1XQBwhZ40RDOp7BS5so/iJnL4cZccBCR32yBBAQHgY6erW4Gl\r\nsevldifuMB1TNyDWhIfIlx80k1s9MaV/qRY0p52uWpPgbUgvWLQPaBxvs2GY\r\nULkMamp5EQPjOd1idVrNWLwrtsc4IYG18l2mK41SlD89dIOJSzxJIkhE7PqS\r\nhKDVuKrxMQPed7piyYXNhbCGprEhxn6d9Dz5bLZBrqPEmvq4wSxKuG9f8kbL\r\nJiKEP84qamoAUGKPB8NzaI4=\r\n=0fTp\r\n-----END PGP SIGNATURE-----\r\n'),
(10, '2020-04-01 19:11:51', 6, 'A1', 1, 'cc', 'ACB', NULL, '-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.9.0\r\nComment: https://openpgpjs.org\r\n\r\nwsBcBAEBCgAGBQJehIUFAAoJEJfZvPhZijS0GaUH/jLJVScLg1a3EUNFjG2Y\r\nqXglRIPRYkfzgYpbx7XOwOlXfRHqvnIGqcc2c+KZZ8hoJewuIejrfpQEb8m8\r\nS/P7ReO+xkJlqKxt305zYXH9MksokRCuU1EpooriJ25dpTJBveMd9J0zXIZC\r\nMJR9HSez0SgeKp6b/TvjqBMCeincSC/Hoi5mZHuOy16e+IhH+Hhi74cyM6c/\r\nqxXIOqCJkeOnoGw43GPNMvMSFSwRNTMN/KbGQYhYezTyqOsbXdRGK0AUrhP9\r\nVj1Lomi53EQ4xz30a51U0/Jjv6RswHvlkCPRVFvnbyLCE0v5TygHAUUdHdSQ\r\naVcrdJik+02XtdYX7IbXD2w=\r\n=z2DA\r\n-----END PGP SIGNATURE-----\r\n'),
(11, '2020-04-01 19:12:30', 6, 'A1', 1, 'cc', 'ACB', NULL, '-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.9.0\r\nComment: https://openpgpjs.org\r\n\r\nwsBcBAEBCgAGBQJehIUsAAoJEJfZvPhZijS0qXsH/0jf7CzFTthhJeEukM+0\r\nruLi2Zrt0fd3zvt05IN0SP77hW0gPXuvJQ5YtyGWdUQNTFxnPjpCPclWj/ut\r\nbcCocp7p22WPMXT3IFJSccXtJE1zDO2BcQKw12lNOtrPO3W9pZuxptKmtkfa\r\nWpJW75J7Rsk+Uq9mwUOLybyUmmw1XFV6UeG5fFFupGyaeTcxgvCIgKkosBms\r\nw56WuJN6vmdLj657q0NZxIJmarKxkv10gDalMBPU2rTIRs52J/wzaA3O+61M\r\nYYL+Keue/3YOEn8cY5nNayE5G6qssHW4eZDO8Lona5Z7wgJhnFfiKnkc7Vng\r\nXYH/9XwQIKOckDBZ5GRCiTg=\r\n=kkiL\r\n-----END PGP SIGNATURE-----\r\n'),
(12, '2020-04-01 19:13:11', 6, 'A1', 1, 'cc', 'ACB', NULL, '-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.9.0\r\nComment: https://openpgpjs.org\r\n\r\nwsBcBAEBCgAGBQJehIVUAAoJEJfZvPhZijS08g0H+gLZR082GFP69ewyuE/X\r\n0mHzQbt/LmAEDrwDFD1tUiU1iNvXNKft4K/KmQg8HOQ8lQBkxqxqbxYNJ2yp\r\nT2e0PENWTXgO36uL/A/zVm2JwAq+Km/0w5eB5EDthm+gQVJlrDaHZJ0ZqW7R\r\n1ZhDmw86Ah3v7+Tv67MjXW4+Yen1PR7v5R68p/ZfgRe2lyqtueaeX2+OF1iR\r\ntB/ibYLnF7GGCVClbJnnqD6ydhwsk0kcwOWfgJuyeGw7qXFZYMcR0lBtH3B4\r\nv2U1knnwyqQpp0+6lT5Hg5UHzW+0gCEHXecFKezijOKjBuSWXccepQC4E2RC\r\n7geMkF9JmdM/sCCh6dKVlSE=\r\n=mLih\r\n-----END PGP SIGNATURE-----\r\n'),
(13, '2020-04-01 19:14:17', 6, 'A1', 1, 'cc', 'ACB', NULL, '-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.9.0\r\nComment: https://openpgpjs.org\r\n\r\nwsBcBAEBCgAGBQJehIWWAAoJEJfZvPhZijS0Hv8H/jcCWAqrFx94/eyeotZp\r\nzp0GJ7w07tg1WdY7X15+73x0DfVXqCsDzc9AlowdgAB0jGOhYwbTkB4o0m/a\r\nLv7KjxS0/MxRLdTJjiLpHP8E+A2PmutTr6pjX/77Ersnh6nVWAa/W0N2M5aF\r\nFFXgug6Fpl/skDZri6UP4G2cxHHxC36Wzd1tq3PlTJOk3QiuDR3SROfJYPGz\r\nUo1TJ5su+kvTFUiRKdrgbkaMYeIAZDZa6nFSd/VirSImRQ00hRItOOeAOixa\r\nJrc8WtnniR1nbCK0W5/CD9RvDsgK29MB/IPq+wpiwEiH4LZnA+MrRb/LumO9\r\noiFpYecHaQBEug0b1e5KmqY=\r\n=es6F\r\n-----END PGP SIGNATURE-----\r\n'),
(14, '2020-04-01 19:22:27', 6, 'A1', 998975, 'cc', 'ACB', NULL, '-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.9.0\r\nComment: https://openpgpjs.org\r\n\r\nwsBcBAEBCgAGBQJehIeAAAoJEJfZvPhZijS0XBgH/ipOZ2QZXxPM7CZEJP9N\r\nlx0B5wQS5uGQHlOX6nrp51nDZaykqWcgYb6VCI6h8fKELP241AaTSiLN+WlG\r\nuGtOlXDpzDMU2fUH0MoCZH8xbtH15gXqq4DhbImXCZj6HOcohHIpW4egpjQ7\r\nIKZI7v8VgQH9u7slJzLZLYt4w/m5mMBN7sHU6twrZzd7annbd/1BMN3WMF47\r\nK99x3sTsLMX4jdV5U0i9gFdPq1cQL+tuBWX8NA/ab3VKqM2baA6Km6uTVBps\r\n2XD7oyqJErMdmONbbjIPQUg6LK2zAs4HT20+tAV8z9+kjG96sJyJ2NgHzjeK\r\nJoEILeFrgbyJcOV+KvB65aw=\r\n=ROK+\r\n-----END PGP SIGNATURE-----\r\n');

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
  `giaoDich` double DEFAULT NULL,
  `nganHangGui` varchar(45) DEFAULT NULL,
  `noiDungNhan` varchar(45) DEFAULT NULL,
  `signature` text,
  PRIMARY KEY (`id`),
  KEY `fk_LichSuNhanTien_TaiKhoan1_idx` (`idTaiKhoanNHNhan`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `lichsunhantien`
--

INSERT INTO `lichsunhantien` (`id`, `ngay`, `idTaiKhoanNHNhan`, `soTaiKhoanGui`, `giaoDich`, `nganHangGui`, `noiDungNhan`, `signature`) VALUES
(3, '2020-01-28 22:25:25', 6, '2', 1000, NULL, 'chuyển', NULL),
(4, '2020-03-19 20:37:36', 7, '2', 22, 'HKL Bank', 'ko co', NULL),
(5, '2020-03-24 23:20:31', 7, '1', 22, 'HKL Bank', 'cc', NULL),
(6, '2020-03-24 23:22:47', 7, '1', 22, 'HKL Bank', 'cc', NULL),
(7, '2020-03-24 23:25:20', 7, '1', 1000, 'HKL Bank', 'cc', NULL),
(8, '2020-04-01 12:54:40', 6, '1', 22, 'ACB', 'cc', '-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.9.0\r\nComment: https://openpgpjs.org\r\n\r\nwsBcBAEBCgAGBQJehCycAAoJEJfZvPhZijS0kL8H/RvcBIrGLOjdrsBVoEyh\r\nqmFzvXDPf8Qq48ntBHPKRSnUZFRbdq+6TwFqXsL/lwBaPbgBT6GrPzocOHbT\r\nR7KdVt0+y4p1gaj8FBvOLDKTAKDtXbHMVxN66ZWxrX6/9UHbAZ0ZSKJFajMc\r\npHdQYC60XCoqL2wTWelw4XZPrsw8bkoXdzBSnH9C57gWZQ/TRbRPv7Wj+WJW\r\nKCUX3M/vhPU98zXm55Ad4LSM2k/FO9p/5fRfwJ5eYhKH3sk0P39UA8zw+GZm\r\n2ZwHLoOe4sMcPjBEmhGhKyAlJqv79TYUFujdUDS9XOH+L2K4GMyN1eISy86P\r\nSZiu3NBWYN7RLz6G8aptoJM=\r\n=9BW/\r\n-----END PGP SIGNATURE-----\r\n'),
(9, '2020-04-01 12:59:32', 6, 'A001', 22, 'ACB', 'cc', '-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.9.0\r\nComment: https://openpgpjs.org\r\n\r\nwsBcBAEBCgAGBQJehC3AAAoJEJfZvPhZijS01MEH/3ddaQj7mtPXntHHRvlu\r\nCbC6qxqbSSA0VibJanxbi+FGyUlsvdKuTcGROa1zA0AEcG1alc+tlZYlRt1u\r\nV8EuWhEvwnZtaUBxfSHabxqbGjG89BohpnohN4wcdE6HqQyzO99fGNh3b8vY\r\nJYxsv/guNQkq8d4uvGwc5/glXvpFzQ9a3BrIinwiTXhytjry0ZGPzEOlm/4S\r\nEhpfDMnyvIY94j9gwzbcAX8txc8+eWh/NvXwiOThSclo6U7/R5HduRCEamrI\r\nt1gIXnXSjfC7b6Zr20z1sHql0d5+EwLF0Swpj06QbAJ1BeJXbDdY/CgY6eX0\r\nZIgxSrWna37uTZR6JND3EuI=\r\n=uh1a\r\n-----END PGP SIGNATURE-----\r\n'),
(10, '2020-04-01 13:00:20', 6, 'A001', 1, 'ACB', 'cc', '-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.9.0\r\nComment: https://openpgpjs.org\r\n\r\nwsBcBAEBCgAGBQJehC3xAAoJEJfZvPhZijS0HwcH/2XTxcbBxj70tDDeqJQ0\r\nk5TifAnRtqsd0wp0mZ02jKasKxSNRIllrYgWn9wT4n1sennohlq6YQetuMI0\r\n+UsVxwvqULVV+JJ6GUgLnIaRAwuY7IyvBNSrQ9JvRdYIOZqiCgDlSDLj15Vc\r\ngguDWPOeTi4Qob8+RO/5T03M3SiH4orVITxHxBcUbiGky7x7vLhooCEufS58\r\n8lZVMYPPeLQG/0nDsQiEw1z5y0nqeup5aoswkDQ4+hpghMy5hqKNvU2+bCXo\r\nLVlLhVR3njwlZ06uGlgSLRIvjzAaORx+kXozOt3rsq9geNx5KFH8KZW6vCy8\r\nA/BgNivpo4z3o7RxyNc8YZQ=\r\n=2K5I\r\n-----END PGP SIGNATURE-----\r\n'),
(11, '2020-04-01 18:17:17', 6, 'A001', 1, 'ACB', 'cc', '-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.9.0\r\nComment: https://openpgpjs.org\r\n\r\nwsBcBAEBCgAGBQJehHg8AAoJEJfZvPhZijS0ZKoH/3vgmvbcFTi37+yf/+4c\r\nbcujEkZBlHg8xCR0YYyc1MglBXm7Zfu/YvwSnn6JVJqouG7jtsJon+9V+dpY\r\nQAuh5LeYZl3iD6qQx1Eug32Y1Pc57fVs+o3dv9xDUyeJM8JHfVpN4IsQb+X9\r\nBCY1Ehdi/OnPkxCU2+T06dMrs9i9lFcCxR09i1CXXhcGtCOEKK2NpiU0kldu\r\nYuOx+CmLYfaoJq0epmxfAFd9Ct8BafMnGKMmSef6nqVigCLSuqeNDlsW32o0\r\n4yVIynJQBWsYidZXjgbF9S6FLp32tbxLc6WgAGm7zCTrxH0KJvFvC/DJf25u\r\nr56Kv0dmZnota0R4tNcJFmg=\r\n=y85n\r\n-----END PGP SIGNATURE-----\r\n'),
(12, '2020-04-01 18:18:47', 6, 'A001', 1, 'ACB', 'cc', '-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.9.0\r\nComment: https://openpgpjs.org\r\n\r\nwsBcBAEBCgAGBQJehHiWAAoJEJfZvPhZijS0klsH/izFVEMF7fVlK6jrBNaw\r\nlWsoImyIzRY5GMGfEp37KWBMPwdycfopCVWgBobl1MbSavYFAJ5y1VXdcLnZ\r\noL2t8F7BgJ5sZUA3APAnbuu50tcM1cyEnlnE8yYHYxxsskmx2gsdTgwi0aNe\r\nWdHlocvodTiocU7u/DQ3cVgYLHm0kGG2w/4aQX/Ah/V+Q+bc6mW61ZOOQ8zD\r\nCEjtf1TPO+xmee9Q3VeNSLZPviZJHZDZ0SlXRsMotKku11Je8fHzLhTGKoOl\r\nILsAGiMVWa2Ks5CsfhtmSTRTLSu/P+WompSOHKyQwUSa0bu6IJCZu5QQBctx\r\nGDzEX/aq9WwBXji1y2Zju7U=\r\n=Frhd\r\n-----END PGP SIGNATURE-----\r\n');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhacno`
--

DROP TABLE IF EXISTS `nhacno`;
CREATE TABLE IF NOT EXISTS `nhacno` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idTaiKhoanNo` int(11) NOT NULL,
  `idTaiKhoanTao` int(11) NOT NULL,
  `tienNo` double NOT NULL COMMENT 'Là số tiền',
  `noiDung` varchar(100) DEFAULT NULL,
  `tinhTrang` tinyint(1) DEFAULT NULL,
  `ngayTao` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ThongBaoNhacNo_TaiKhoanNganHang1_idx` (`idTaiKhoanNo`),
  KEY `fk_NhacNo_TaiKhoanNganHang1_idx` (`idTaiKhoanTao`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `nhacno`
--

INSERT INTO `nhacno` (`id`, `idTaiKhoanNo`, `idTaiKhoanTao`, `tienNo`, `noiDung`, `tinhTrang`, `ngayTao`) VALUES
(1, 6, 7, 100, 'nợ 100', 0, '2020-03-31'),
(2, 8, 7, 109, 'nợ 109', 0, '2020-04-07'),
(3, 8, 6, 200000, 'nợ 200', 1, '2020-04-01'),
(4, 10, 7, 300, 'nợ 300', 0, '2020-04-09'),
(10, 8, 6, 125, 'no 125', 0, '2020-03-30'),
(11, 8, 6, 124, 'no 124', 0, '2020-04-14'),
(38, 6, 8, 125, 'no 125', 0, '2020-04-16'),
(39, 6, 8, 125, 'no 125', 0, '2020-04-19'),
(40, 6, 8, 126, 'no 126', 0, '2020-04-19'),
(41, 6, 8, 127, 'no 127', 0, '2020-04-19'),
(42, 6, 8, 128, 'no 128', 0, '2020-04-19'),
(43, 6, 8, 128, 'no 128', 0, '2020-04-19'),
(44, 7, 8, 128, 'no 128', 0, '2020-04-19'),
(45, 7, 8, 130, 'no 130', 0, '2020-04-19'),
(46, 7, 6, 10000, 'dsds dsad', 0, '2020-04-21'),
(47, 7, 6, 10000, NULL, 0, '2020-04-21'),
(48, 7, 6, 134, '', 0, '2020-04-21'),
(49, 7, 6, 100, '', 0, '2020-04-21');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhanvien`
--

DROP TABLE IF EXISTS `nhanvien`;
CREATE TABLE IF NOT EXISTS `nhanvien` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
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
(1, 'nv1', '$2a$08$7qu5yXwUv9dDh86qknEwp.3CFEX2HSo57Ty4DctVEybixb5QOVhPW', 'Nhân Viên', NULL, NULL, 1),
(2, 'nv2', '$2a$08$wl.7xPXC9DONZkx3yKh7Kucw/IxvdfTpIQ7X/k8BZ8FCdl15TgMw2', 'Nhân Viên 2', NULL, NULL, 1),
(3, 'ql', '$2a$08$UdvGoNkvurR7ZjgmqzRqreKI2n6bUvOJKJxuxApUyhKtFO3k4eRR.', 'Quản Lý', NULL, NULL, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `refreshtoken`
--

DROP TABLE IF EXISTS `refreshtoken`;
CREATE TABLE IF NOT EXISTS `refreshtoken` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `refreshToken` char(255) NOT NULL,
  `date` datetime NOT NULL,
  `isNhanVien` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `refreshtoken`
--

INSERT INTO `refreshtoken` (`id`, `userId`, `refreshToken`, `date`, `isNhanVien`) VALUES
(13, 7, 'VEZprniYV2weG0t0Jan0Ob7jYoL9yBDC5vMwQibJRIi2xbdcfyegBh10EqEy2gociD72pcEmvayZXqb8', '2020-04-19 22:36:17', b'0'),
(53, 1, 'volKp0aGlp5ymxY46PwKU6n7LUbYo8I0vebmT0topMfGeetUEpoeTeABpCyAKpfmqRqNFkef0ihDY6UK', '2020-05-19 17:03:39', b'0');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taikhoannganhang`
--

DROP TABLE IF EXISTS `taikhoannganhang`;
CREATE TABLE IF NOT EXISTS `taikhoannganhang` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tenDangKy` varchar(45) DEFAULT NULL,
  `soDu` double DEFAULT '0',
  `soTK` double NOT NULL COMMENT 'Số tài khoản',
  `idKhachHang` int(11) NOT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `soTK_UNIQUE` (`soTK`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `fk_TaiKhoanNganHang_KhachHang1_idx` (`idKhachHang`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `taikhoannganhang`
--

INSERT INTO `taikhoannganhang` (`id`, `tenDangKy`, `soDu`, `soTK`, `idKhachHang`, `username`, `password`) VALUES
(6, 'Amee', 998976, 1, 4, 'kh1', '$2a$08$p3AMjO9Zr9pW5MOIwzw2cOv8PDSkTA0BGBWv2mZwNZrYQYvTJI9si'),
(7, 'DinhLong', 1001066, 2, 2, 'kh2', '$2a$08$jDOMqbmVeXOslGYilubHeeXrhlznnsTCVvTBVIxhXd5dXC/Of/ef.'),
(8, 'JangMi', 1000000, 3, 3, 'kh3', '$2a$08$a5aFVQJH/f9iElQX8W/AWelh.R/M0Dwjy9wWubUqGr8XDwA8uAWJC'),
(9, 'ijji', 1000000, 4, 1, 'kh4', '$2a$08$37ZCdnPhE1YYcJ5YFrVJbucZ7June1sskVsuy27CeWf7paTtLnri6'),
(10, 'superstar', 1000000, 5, 5, 'kh5', '$2a$08$m.SpvGRjQfyXkmGwMQh0jub9DH7Y0w1amP8JpPhu32gJ9q9B4rFDq'),
(12, 'Lê Lê', 0, 12, 8, 'number1', '123456');

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
  `tenGoiNho` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idTaiKhoanNHGui` (`idTaiKhoanNHGui`,`soTaiKhoanNhan`),
  KEY `fk_DanhSachNguoiNhan_TaiKhoan1_idx` (`idTaiKhoanNHGui`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `thietlapnguoinhan`
--

INSERT INTO `thietlapnguoinhan` (`id`, `idTaiKhoanNHGui`, `soTaiKhoanNhan`, `nganHang`, `tenGoiNho`) VALUES
(1, 6, '4', '', 'ijji'),
(2, 6, '3', NULL, 'jj'),
(3, 7, '1', NULL, 'dẹo');

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
  ADD CONSTRAINT `fk_ThongBaoNhacNo_TaiKhoanNganHang1` FOREIGN KEY (`idTaiKhoanNo`) REFERENCES `taikhoannganhang` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

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
