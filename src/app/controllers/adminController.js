const mit = require("../models/mit");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { mongooseToObject, mutipleMongoToObject } = require("../util/mongoose");

class adminController {
    //GET /admin
    index(req, res) {
        res.render("admin/admin");
    }

    //GET /admininfo
    admininfo(req, res) {
        res.render("admin/admininfo");
    }
    //POST /admin/added
    added(req, res) {
       const {name, image, price, info} = req.body;
       const newMit = new mit({
           name: name,
           image: image,
           price: price,
           info: info,
       })
       newMit.save()
       return res.json({message: "Thêm thành công"})
    }


    //GET /admin/updateSp
    updatesp(req, res) {
        mit.find()
            .then(mit=>{
                res.render("admin/updateSp", {
                    mit: mutipleMongoToObject(mit)
                })
            })
            .catch(err=>{
                console.log(err)
            })
    }
    //POST /admin/updateInfo
    updateInfo(req, res) {
        mit.findOne({_id: req.params.id})
            .then(mit=>{
                res.render("admin/updateInfo", {
                    mit: mongooseToObject(mit)
                })
            })
            .catch(err=>{
                console.log(err)
            })
    }
    //POST /admin/:id
    edit(req, res) {
       mit.updateOne({_id: req.params.id},req.body)
       .then(()=>{
        res.redirect("/admin/updateSp")
       })
       .catch(err=>{
           console.log(err)
       })
    }
   
   // GET /admin/:id/deleteSp - Hiển thị trang xác nhận xóa
    deleteSp(req, res) {
        mit.findOne({_id: req.params.id})
        .then(mit=>{
            res.render("admin/deleteSp",{
                mit: mongooseToObject(mit)
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }
    //DELETE /admin/:id/deleted
    deleted(req, res) {
        mit.findByIdAndDelete(req.params.id)
        .then(()=>{
            res.redirect("/admin/updateSp")
        })
        .catch(err=>{
            console.log(err)
        })
    }
    //GET /admin/showUser
    showUser(req, res) {
        User.find()
            .then(User=>{
                res.render("admin/showUser", {
                    User: mutipleMongoToObject(User)
                })
            })
            .catch(err=>{
                console.log(err)
            })
    }
    // ==============================User==============================
    //GET /admin/showUser/:id/edit
    showUserEdit(req, res) {
        User.findOne({_id: req.params.id})
            .then(User=>{
                res.render("admin/userInfoEdit", {
                    User: mongooseToObject(User)
                })
            })
            .catch(err=>{
                console.log(err)
            })
    }
    //GET /admin/showUser/:id/deleteUser
    showUserDelete(req, res) {
        User.findOne({_id: req.params.id})
            .then(User=>{
                res.render("admin/userInfoDelete", {
                    User: mongooseToObject(User)
                })
            })
            .catch(err=>{
                console.log(err)
            })
    }
    //POST /admin/showUser/:id/edited
    edited(req, res) {
        User.updateOne({_id: req.params.id},req.body)
        .then(()=>{
            res.redirect("/admin/showUser")
        })
        .catch(err=>{
            console.log(err)
        })
    }
    //POST /admin/showUser/:id/deleteUser
    deletedUser(req, res) {
        User.findByIdAndDelete(req.params.id)
        .then(()=>{
            res.redirect("/admin/showUser")
        })
        .catch(err=>{
            console.log(err)
        })
    }
}   
module.exports = new adminController;
