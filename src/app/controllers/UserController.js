const { default: mongoose } = require("mongoose");  
const User = require("../models/User");
const mit = require("../models/mit");
const { mongooseToObject, mutipleMongoToObject } = require("../util/mongoose");
const jwt = require('jsonwebtoken');

class UserController {
    // GET /
    show(req, res) {
        var token = req.cookies?.token;
        
        const renderWithMit = (userInfo = null) => {
            mit.find({})
                .then(mit => {
                    res.render("indexChung/Chung", { 
                        mit: mutipleMongoToObject(mit), 
                        userInfo: userInfo ? mongooseToObject(userInfo) : null 
                    });
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send('Lỗi server');
                });
        };

        if (token) {
            try {
                var decodeToken = jwt.verify(token, "mk");
                User.findOne({ _id: decodeToken._id })
                    .then(userInfo => {
                        renderWithMit(userInfo);
                    })
                    .catch(err => {
                        console.error(err);
                        renderWithMit(); // Vẫn hiển thị sản phẩm dù có lỗi
                    });
            } catch (error) {
                console.error(error);
                renderWithMit(); // Vẫn hiển thị sản phẩm dù có lỗi
            }
        } else {
            renderWithMit(); // Trường hợp không có token
        }
    }
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
    // GET /:id
    detail(req, res) {
        var token = req.cookies?.token;
        const id = req.params.id;
        
        // Sửa lại hàm renderWithMit không cần tham số
        const renderWithMit = () => {
            mit.findById(id)  // Sửa lại ở đây, bỏ {} và chỉ dùng id
                .then(mit => {
                    if (!mit) {
                        return res.status(404).send('Không tìm thấy sản phẩm');
                    }
                    res.render("indexChung/detail", { 
                        mit: mongooseToObject(mit),
                        userInfo: null // Thêm userInfo mặc định
                    });
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send('Lỗi server');
                });
        };
    
        if (token) {
            try {
                var decodeToken = jwt.verify(token, "mk");
                User.findOne({ _id: decodeToken._id })  // Sửa lại _id từ token
                    .then(userInfo => {
                        mit.findById(id)  // Tìm sản phẩm
                            .then(mit => {
                                if (!mit) {
                                    return res.status(404).send('Không tìm thấy sản phẩm');
                                }
                                res.render("indexChung/detail", { 
                                    mit: mongooseToObject(mit),
                                    userInfo: mongooseToObject(userInfo)  // Truyền thông tin user
                                });
                            })
                            .catch(err => {
                                console.error(err);
                                res.status(500).send('Lỗi server');
                            });
                    })
                    .catch(err => {
                        console.error(err);
                        renderWithMit(); // Nếu lỗi user, vẫn hiển thị sản phẩm
                    });
            } catch (error) {
                console.error(error);
                renderWithMit(); // Nếu lỗi token, vẫn hiển thị sản phẩm
            }
        } else {
            renderWithMit(); // Trường hợp không có token
        }
    }
    
}

module.exports = new UserController;