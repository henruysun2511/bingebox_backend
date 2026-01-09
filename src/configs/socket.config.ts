import { Server } from "socket.io";

let io: Server;

export const initIo = (server: any) => {
  io = new Server(server, {
    cors: { origin: "*" }
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