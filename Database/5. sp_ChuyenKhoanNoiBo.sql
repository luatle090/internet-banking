drop PROCEDURE IF EXISTS ChuyenKhoanNoiBo;

DELIMITER //

-- status: 0 : thành công
--		 : 1 : ROLLBACK
--		 : -1 : không tồn tại
create PROCEDURE ChuyenKhoanNoiBo
(idTaiKhoanChuyen INT, 
idTaiKhoanNhan INT,
giaoDichCK DOUBLE,
ngayCK DATETIME,
noiDung VARCHAR(45),
OUT status INT
)
proc_exit:BEGIN
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
		LEAVE proc_exit;
		SET status = -1;
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
	

 	
END //

DELIMITER;

