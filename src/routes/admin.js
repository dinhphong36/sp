const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../app/models/User");

const adminController = require("../app/controllers/adminController");

//Admin
router.get("/admin", adminController.index);
//Tạo sản phẩm
router.get("/admin/admininfo", adminController.admininfo);
router.post("/admin/added", adminController.added);

//Sửa sản phẩm
router.get("/admin/updateSp", adminController.updatesp);
router.get("/admin/:id/edit", adminController.updateInfo);
router.post("/admin/:id", adminController.edit);

//Xóa sản phẩm
router.get('/admin/:id/deleteSp', adminController.deleteSp);  
router.post("/admin/:id/deleted", adminController.deleted);

//quản lý user
router.get("/admin/showUser", adminController.showUser);
router.get("/admin/showUser/:id/edit", adminController.showUserEdit);
router.get("/admin/showUser/:id/deleteUser", adminController.showUserDelete);
router.post("/admin/showUser/:id/edited", adminController.edited);
router.post("/admin/showUser/:id/deleteUser", adminController.deletedUser);

module.exports = router;
