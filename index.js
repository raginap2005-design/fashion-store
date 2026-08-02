const express = require("express");

const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.conifg();

connectDB();

const app = express();
 app.get("./", (req, res) =>{
    res.send("Server is running...");
 });

 const PORT = process.env.PORT || 5000;

 app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
 });