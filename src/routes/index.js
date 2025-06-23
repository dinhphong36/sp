const userRoutes = require("./User");
const adminRoutes = require("./admin");
function routes(app){
    app.use("/", adminRoutes)
    app.use("/", userRoutes);

}

module.exports = routes;