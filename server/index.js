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

// =========================================
// DATABASE
// =========================================

connectDB();

// =========================================
// EXPRESS APP
// =========================================

const app = express();

// Create HTTP server
const server = http.createServer(app);

// =========================================
// CORS
// =========================================

const allowedOrigins = [
    "http://localhost:5173",
    "https://fashion-store-frontend-zco2.onrender.com",
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests without an origin
            // such as Postman
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error("Not allowed by CORS")
            );
        },
        credentials: true,
    })
);

// =========================================
// SOCKET.IO
// =========================================

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    },
});

// Make Socket.IO available inside controllers
app.set("io", io);

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
        console.log(
            "User disconnected:",
            socket.id
        );
    });
});

// =========================================
// MIDDLEWARE
// =========================================

app.use(express.json());

// Serve uploaded images
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
    console.log(
        `Server is running on port ${PORT}`
    );
});

