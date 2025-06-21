const path = require("path");
const { engine } = require("express-handlebars");
const express = require("express");
const app = express();
const port = 3000;
const morgan = require("morgan");
const routes = require("./routes");
const jwt = require('jsonwebtoken');
const db = require("./config/config");
db.connectDB();

//Template engine
app.use(morgan("combined"));
app.use(express.static(path.join(__dirname, "public")));
app.engine(".hbs", engine({ 
    extname: ".hbs" 
}));

//Middleware
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 



app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "resources/view"));

routes(app);

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
    
});