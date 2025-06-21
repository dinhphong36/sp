const newRoutes = require("./new");
const userRoutes = require("./User");
const adminRoutes = require("./admin");
function routes(app){
    app.use("/admin", adminRoutes)
    app.use("/", newRoutes);
    app.use("/", userRoutes);

}

module.exports = routes;