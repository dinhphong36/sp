const User = require("../models/User");
const jwt = require('jsonwebtoken');

class UserController {
    // GET /register
    register(req, res) {
        res.render("indexChung/register");
    }
    // POST /register
    created(req, res) {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const sdt = req.body.sdt;

        const user = new User({
            username: username,
            password: password,
            email: email,
            sdt: sdt,
            role: "user"
            
        });

        user.save()
            .then(() => {
                res.redirect("/login");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // GET /login
    login(req, res) {
        res.render("indexChung/login");
    }// POST /login
    logined(req, res) {
        console.log("Dữ liệu nhận được:", req.body); 
       const {username, password} = req.body;
       const findUserByUserName = User.findOne({username: username}).exec();
       const findUserByPassword = User.findOne({password: password}).exec();
       
       Promise.all([findUserByUserName, findUserByPassword])
            .then(([userByUsername, userByPassword]) =>{
                if(userByUsername && userByPassword){
                   const token = jwt.sign({_id:userByUsername._id}, "mk"); 
                   return res.json({message: userByUsername.role, token: token})
                }else if(userByUsername && !userByPassword){
                    return res.json({message: "Sai mật khẩu"})
                }else{
                    return res.json({message: "User không tồn tại"})
                }
            })
            .catch((err) => {
                console.error("Lỗi chi tiết:", err); 
               return res.status(500).json({message: "Lỗi"}) 
            })

    }
    
}

module.exports = new UserController;