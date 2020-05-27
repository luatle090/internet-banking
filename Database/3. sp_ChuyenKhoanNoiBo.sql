USE `qlnganhang`;
DROP procedure IF EXISTS `ChuyenKhoanNoiBo`;

DELIMITER $$
USE `qlnganhang`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `ChuyenKhoanNoiBo`(`idTaiKhoanChuyen` INT, `idTaiKhoanNhan` INT, `giaoDichCK` DOUBLE, `ngayCK` DATETIME, `noiDung` VARCHAR(45), OUT `status` INT)
proc_exit:BEGIN
 	DECLARE tienConLai, soDuMoi DOUBLE;

	
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			
		SET status = 1;
		ROLLBACK;
	END;
	 
	DECLARE EXIT HANDLER FOR SQLWARNING
	 	BEGIN
			
		SET status = 1;
	 	ROLLBACK;
	END;

	
	IF NOT EXISTS (SELECT 1 FROM taikhoannganhang where id = idTaiKhoanNhan and tinhTrang is true)
	THEN
		SET status = -1;
		LEAVE proc_exit;
	END IF;

 	
 	IF EXISTS (SELECT 1 FROM taikhoannganhang 
 							WHERE id = idTaiKhoanChuyen AND soDu >= giaoDichCK)
 	THEN
		START TRANSACTION;
			
			SET @soTKNhan = (SELECT soTK FROM taikhoannganhang where id = idTaiKhoanNhan);
			SET @soTKChuyen = (SELECT soTK FROM taikhoannganhang WHERE id = idTaiKhoanChuyen);
 
  		
  			
  		SET @soDuTKChuyen = (SELECT soDu FROM taikhoannganhang WHERE id = idTaiKhoanChuyen);
  		SET tienConLai = @soDuTKChuyen - giaoDichCK;
  
  		UPDATE taikhoannganhang SET soDu = tienConLai where id = idTaiKhoanChuyen;
  			
  		
			INSERT INTO lichsuchuyenkhoan(ngay, idTaiKhoanNHGui, soTaiKhoanNhan, 
 													giaoDich, noiDungChuyen, nganHangNhan, idNhacNo)
  		VALUES (ngayCK, idTaiKhoanChuyen, @soTKNhan, giaoDichCK, noiDung, 'HKL Bank', NULL);
  			
			
			INSERT INTO lichsunhantien(ngay, idTaiKhoanNHNhan, soTaiKhoanGui, 
 													giaoDich, nganHangGui, noiDungNhan)
			VALUES (ngayCK, idTaiKhoanNhan, @soTKChuyen, giaoDichCK, 'HKL Bank', noiDung);
 
  		
				
			SET @soDuTKNhan = (SELECT soDu FROM taikhoannganhang WHERE id = idTaiKhoanNhan);
			SET soDuMoi = @soDuTKNhan + giaoDichCK;
			UPDATE taikhoannganhang SET soDu = soDuMoi WHERE id = idTaiKhoanNhan;
  			
 		COMMIT;
 		SET status = 0;
 	ELSE
		SET status = -1;
	END IF;
	

 	
END$$

DELIMITER ;

