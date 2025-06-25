const path = require("path");
const { engine } = require("express-handlebars");
const express = require("express");
const morgan = require("morgan");
const routes = require("./routes");
const jwt = require("jsonwebtoken");
const db = require("./config/config");
require("dotenv").config(); // Load biến môi trường

const app = express();
const PORT = process.env.PORT || 3000; // Dùng biến môi trường PORT nếu có

// Kết nối DB
db.connectDB();

// Middleware
app.use(morgan("combined"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(cookieParser()); // mở nếu cần

// Template engine
app.engine(".hbs", engine({
    extname: ".hbs",
    helpers: {
        eq: (a, b) => a == b,
        sum: (a, b) => a + b
    }
}));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "resources", "view"));

// Routes
routes(app);

// Server
app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});
