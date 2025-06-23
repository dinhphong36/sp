const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../app/models/User");

const UserController = require("../app/controllers/UserController");

var checkLogin = (req, res, next) => {
    var token = req.cookies?.token;
    if(!token){
        next()
    }else{
        var idUser = jwt.verify(token, "mk");
        User.findOne({_id: idUser._id})
            .then(data=>{
               req.data = data
               next()
            })
            .catch(err=>{
                console.log(err.message)
            })
        }
    }

var checkUser = (req, res, next) => {
    if(req.data){
        var role = req.data.role
        if(role === "user"){
            res.redirect("/")
        }else if(role === "admin"){
            res.redirect("/admin")
        }
    }else if(!req.data){
        next()
    }
}


router.get("/login", checkLogin, checkUser, UserController.login);
router.get("/register", UserController.register);
router.post("/created", UserController.created);
router.post("/logined", UserController.logined);
router.get("/:id", UserController.detail);
router.get("/", checkUser,UserController.show);

module.exports = router;