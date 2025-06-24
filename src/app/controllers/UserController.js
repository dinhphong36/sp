const User = require("../models/User");
const mit = require("../models/mit");
const Cart = require("../models/Cart");
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
    login(req,res,next){
        res.render('indexChung/login');
        
    }

    //[POST] /logined
    logined(req, res, next) {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
        }
    
        User.findOne({ username: username })
            .then(user => {
                if (!user) {
                    return res.json({ message: 'Tài khoản không tồn tại' });
                }
                
                // So sánh mật khẩu (cần thêm bcrypt để mã hóa mật khẩu)
                if (user.password !== password) {
                    return res.json({ message: 'Sai mật khẩu' });
                }
    
                // Tạo token
                const token = jwt.sign(
                    { _id: user._id, role: user.role }, 
                    'mk',
                    { expiresIn: '1d' } // Thêm thời hạn cho token
                );
    
                // Lưu token vào cookie
                res.cookie('token', token, { 
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000 // 1 ngày
                });
    
                return res.json({ 
                    message: 'Đăng nhập thành công', 
                    role: user.role,
                    token: token 
                });
            })
            .catch(error => {
                console.error('Lỗi đăng nhập:', error);
                return res.status(500).json({ message: 'Đã xảy ra lỗi' });
            });
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
    //post /cart/:id
    addToCart(req, res, next) {
        const quantity = parseInt(req.body.quantity, 10);
        const id = req.params.id;
    
        console.log(quantity);
    
        mit.findOne({ _id: id })
            .then(mit => {
                if (!mit) {
                    return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
                }
    
                // Tìm sản phẩm trong giỏ hàng (không phân biệt người dùng)
                Cart.findOne({ name: mit.name })
                    .then(existingItem => {
                        if (existingItem) {
                            // Nếu đã có sản phẩm trong giỏ, cập nhật số lượng
                            return Cart.findByIdAndUpdate(
                                existingItem._id,
                                { $inc: { quantity: quantity } },
                                { new: true }
                            ).then(() => {
                                return res.json({ message: 'Cập nhật thành công' });
                            });
                        } else {
                            // Nếu chưa có, thêm mới vào giỏ hàng
                            const newOrder = new Cart({
                                userId: null, // Không có user đăng nhập
                                name: mit.name,
                                image: mit.image,
                                price: mit.price,
                                info: mit.info,
                                quantity: quantity
                            });
    
                            return newOrder.save()
                                .then(() => {
                                    return res.json({ message: 'Thêm thành công' });
                                });
                        }
                    })
                    .catch(error => {
                        console.error("Lỗi khi kiểm tra giỏ hàng:", error);
                        return res.status(500).json({ message: 'Lỗi server khi truy vấn giỏ hàng' });
                    });
            })
            .catch(error => {
                console.error("Lỗi khi truy vấn sản phẩm:", error);
                return res.status(500).json({ message: 'Lỗi server khi truy vấn sản phẩm' });
            });
    }
    //get /order
    showOrder(req, res) {
        Cart.find({})
        .then(cart => {
            const array = cart.map(product => {
                return product.price * product.quantity;
            });
    
            const tong = array.reduce((total, value) => total + value, 0);
    
            res.render('Client/order', {
                cart: mutipleMongoToObject(cart),
                tong: tong,
            });
        })
        .catch(error => {
            console.error("Lỗi khi truy vấn giỏ hàng:", error);
            res.status(500).send("Lỗi server");
        });
    
    }
    //post /update-order/:id
    updateOrder(req, res) {
        const quantity = req.body.quantity;
        const id = req.params.id;
        console.log(quantity);
        
        // Cập nhật không cần token
        Cart.updateOne({ _id: id }, { quantity: quantity })
            .then(() => {
                return res.json({ message: 'Cập nhật thành công' });
            })
            .catch(error => {
                console.error('Lỗi khi cập nhật giỏ hàng:', error);
                return res.status(500).json({ message: 'Lỗi server khi cập nhật' });
            });
    
    }
    //post /delete-order/:id
    deleteOrder(req, res) {
        const id = req.params.id;
        console.log(id);
        
        // Xóa không cần token
        Cart.deleteOne({ _id: id })
            .then(() => {
                return res.json({ message: 'Xóa thành công' });
            })
            .catch(error => {
                console.error('Lỗi khi xóa giỏ hàng:', error);
                return res.status(500).json({ message: 'Lỗi server khi xóa sản phẩm' });
            });
    }
}

module.exports = new UserController;