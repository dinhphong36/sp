class adminController {
    index(req, res) {
        res.render("admin/admin");
    }
}   
module.exports = new adminController;
