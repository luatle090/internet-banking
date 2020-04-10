drop PROCEDURE IF EXISTS NopTien;

DELIMITER //

-- status: 0 : thành công
--		 : 1 : ROLLBACK
--		 : -1 : không tồn tại
create PROCEDURE NopTien
(soTKGui VARCHAR(100), 
soTKNhan VARCHAR(45),
giaoDichCK DOUBLE,
ngayCK DATETIME,
noiDung VARCHAR(45),
partnerCode VARCHAR(45),
signature TEXT,
OUT status INT
)
proc_exit:BEGIN
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
	
 	
END //

DELIMITER;