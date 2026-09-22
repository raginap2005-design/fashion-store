const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

connectDB();

const app = express();

// Create HTTP server
const server = http.createServer(app);

// =========================================
// SOCKET.IO
// =========================================

app.use(
    cors({
        origin: "https://fashion-store-frontend-zco2.onrender.com",
    })
);

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Make Socket.IO available in controllers
const io = new Server(server, {
    cors: {
        origin: "https://fashion-store-frontend-zco2.onrender.com",
        methods: ["GET", "POST"],
    },
});

app.use(express.json());

app.use("/uploads", express.static("uploads"));

// =========================================
// ROUTES
// =========================================

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

// =========================================
// TEST ROUTE
// =========================================

app.get("/", (req, res) => {
    res.send("Server is running...");
});

// =========================================
// SERVER
// =========================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});