import { io } from "socket.io-client";

const socket = io("https://fashion-store-u2cg.onrender.com");

export default socket;