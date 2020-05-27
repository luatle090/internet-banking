USE `qlnganhang`;
DROP procedure IF EXISTS `NopTien`;

DELIMITER $$
USE `qlnganhang`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `NopTien`(`soTKGui` VARCHAR(100), `soTKNhan` VARCHAR(45), `giaoDichCK` DOUBLE, `ngayCK` DATETIME, `noiDung` VARCHAR(45), `partnerCode` VARCHAR(45), `signature` TEXT, OUT `status` INT)
proc_exit:BEGIN
 	DECLARE soDuMoi DOUBLE;
 	DECLARE idTaiKhoanNhan INT;

	
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

	
	IF NOT EXISTS (SELECT 1 FROM taikhoannganhang where soTK = soTKNhan and tinhTrang is true)
	THEN
		SET status = -1;
		LEAVE proc_exit;		
	END IF;

	START TRANSACTION;
		SET idTaiKhoanNhan = (SELECT id FROM taikhoannganhang where soTK = soTKNhan);

		
		INSERT INTO lichsunhantien(ngay, idTaiKhoanNHNhan, soTaiKhoanGui, 
												giaoDich, nganHangGui, noiDungNhan, signature)
		VALUES (ngayCK, idTaiKhoanNhan, soTKGui, giaoDichCK, partnerCode, noiDung, signature);

		
			
		SET @soDuTKNhan = (SELECT soDu FROM taikhoannganhang WHERE id = idTaiKhoanNhan);
		SET soDuMoi = @soDuTKNhan + giaoDichCK;
		UPDATE taikhoannganhang SET soDu = soDuMoi WHERE id = idTaiKhoanNhan;
			
	COMMIT;
	SET status = 0;
	
 	
END$$

DELIMITER ;

