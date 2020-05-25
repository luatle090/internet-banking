const db = require('../utils/db');

module.exports = {
  all: () => {
    const sql = 'select * from nhacno';
    return db.load(sql);
  },

  loadById: id => {
    const sql = `select * from nhacno where id = ${id}`;
    return db.load(sql);
  },

  getNoTaoByIdTaiKhoan: async (idTaiKhoan, tinhTrang, limit, offset) => {
    let sql = `SELECT nn.id, nn.noiDung, nn.tienNo, DATE_FORMAT(ngayTao, "%d/%m/%Y") as ngayTao ,
                    kh.hoTen as nguoiNo, tk.soTK,
                  CASE
                    WHEN nn.tinhTrang = 0 THEN 'Chưa trả nợ'
                    ELSE 'Đã trả nợ'
                  END as tinhTrang
                  FROM nhacno nn INNER JOIN taikhoannganhang tk
                  ON tk.id = nn.idTaiKhoanNo
                  INNER JOIN khachhang kh ON tk.idKhachHang = kh.id
                  WHERE nn.idTaiKhoanTao = ${idTaiKhoan}`;
    if(tinhTrang){
      sql += ` AND nn.tinhTrang = ${tinhTrang} `;
    }
    sql += ` ORDER by nn.ngayTao DESC
            LIMIT ${limit} OFFSET ${offset}`;
    
    const countSql = `SELECT COUNT(id) as total FROM nhacno WHERE idTaiKhoanTao = ${idTaiKhoan}`;
    return [await db.load(sql), await db.load(countSql)];
  },

  getNhacNoByIdTaiKhoan: async (idTaiKhoan, tinhTrang, limit, offset) => {
    let params = [];
    let sql = `SELECT nn.id, nn.noiDung, nn.tienNo, DATE_FORMAT(ngayTao, "%d/%m/%Y") as ngayTao, 
                    kh.hoTen as nguoiTao, tk.soTK,
                CASE    
                  WHEN nn.tinhTrang = 0 THEN 'Chưa trả nợ'
                  ELSE 'Đã trả nợ'
                END as tinhTrang
                  FROM nhacno nn INNER JOIN taikhoannganhang tk
                  ON tk.id = nn.idTaiKhoanTao
                  INNER JOIN khachhang kh ON tk.idKhachHang = kh.id
                  WHERE nn.idTaiKhoanNo = ? `;
    params.push(idTaiKhoan);
    if(tinhTrang){
      sql += ` AND nn.tinhTrang = ? `;
      params.push(tinhTrang);
    }
    sql += ` ORDER by nn.ngayTao DESC
              LIMIT ? OFFSET ?`;
    params.push(limit); 
    params.push(offset);

    const countSql = `select count(id) as total from nhacno where idTaiKhoanNo = ?`;
    
    return [await db.select(sql, params), await db.select(countSql, [idTaiKhoan])];
  },
  
  getGiaoDichNhacNoByIdTaiKhoan: async (idTaiKhoan, tinhTrang, limit, offset) => {
    let params = [];
    let sql = `SELECT nn.id, nn.noiDung, nn.tienNo, DATE_FORMAT(ngayTao, "%d/%m/%Y") as ngayTao, 
                    kh.hoTen as nguoiTao, nn.tinhTrang, giaoDich, NoiDungChuyen
                  FROM nhacno nn 
                  INNER JOIN taikhoannganhang tk ON tk.id = nn.idTaiKhoanTao
                  INNER JOIN khachhang kh ON tk.idKhachHang = kh.id
                  INNER JOIN lichsuchuyenkhoan ls ON ls.idNhacNo = nn.id
                  WHERE nn.idTaiKhoanNo = ? `;
    params.push(idTaiKhoan);
    if(tinhTrang){
      sql += ` AND nn.tinhTrang = ? `;
      params.push(tinhTrang);
    }
    sql += ` ORDER by nn.ngayTao DESC
              LIMIT ? OFFSET ?`;
    params.push(limit); 
    params.push(offset);

    const countSql = `select count(id) as total from nhacno where idTaiKhoanNo = ?`;
    
    return [await db.select(sql, params), await db.select(countSql, [idTaiKhoan])];
  },

  add: entity => db.add(entity, 'nhacno'),
  del: id => db.del({ id: id }, 'nhacno'),
  patch: (id, entity) => {
    delete entity.id;
    return db.patch(entity, { id: id }, 'nhacno')
  },
};
