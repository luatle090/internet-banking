drop PROCEDURE IF EXISTS ChuyenKhoanLienNH;

DELIMITER //

-- status: 0 : thành công
--		 : 1 : ROLLBACK
create PROCEDURE ChuyenKhoanLienNH
(idTaiKhoanChuyen INT, 
soTKNhan VARCHAR(100),
giaoDichCK DOUBLE,
ngayCK DATETIME,
noiDung VARCHAR(45),
partnerCode VARCHAR(45),
signature TEXT,
OUT status INT
)
proc_exit:BEGIN
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
	
 	
END //

DELIMITER;

