const express = require("express");

const cors = require("cors");

const dotenv = require("dotenv");

const connectDB = require("./config/db");

const categoryRoutes = require("./routes/categoryRoutes");

const productRoutes = require("./routes/productRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes); 
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

 app.get("/", (req, res) =>{
    res.send("Server is running...");
 });

 const PORT = process.env.PORT || 5000;

 app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
 });