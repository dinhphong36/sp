const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../app/models/User");

const UserController = require("../app/controllers/UserController");

var checkLogin = (req,res, next) => {
    var token = req.cookies?.token;
    if(!token){
        next();
    }else{
        var idUser = jwt.verify(token, 'mk');
        User.findOne({_id : idUser._id})
            .then(data =>{
                req.data = data;
                next();
            }).catch(err =>{
                console.log(err.message);
                
            })
    }
}

var checkUser = (req,res, next) => {
    if(req.data){
        var role = req.data.role;
        if(role === 'user'){
            res.redirect("/");
        }else if(role === 'admin'){
            res.redirect("/admin");
        }
    }else if(!req.data){
        next();
    }
}



router.get("/register", UserController.register);
router.get("/login", checkLogin,checkUser,UserController.login);
router.post("/created", UserController.created);
router.post("/logined", UserController.logined);
//Giỏ hàng
router.post("/cart/:id", UserController.addToCart);
router.get("/order", UserController.showOrder);
router.post("/update-order/:id", UserController.updateOrder);
router.delete("/delete-order/:id", UserController.deleteOrder);
//
router.get("/:id", UserController.detail);  
router.get("/", checkLogin,UserController.show);




module.exports = router;