import http from "http";
import { Server } from "socket.io";

let io: Server;

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_2,
].filter((origin): origin is string => Boolean(origin));

export const initIo = (server: http.Server) => {
  io = new Server(server, {
    cors: { origin: allowedOrigins.length ? allowedOrigins : "*" }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
  });

  return io;
};

export const getIo = (): Server => {
  if (!io) {
    throw new Error("Socket.io chưa được khởi tạo!");
  }
  return io;
};