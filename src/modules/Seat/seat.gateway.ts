import { Server, Socket } from "socket.io";

export function registerSeatSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("Client connected:", socket.id);

    /* JOIN ROOM THEO SUẤT CHIẾU */
    socket.on("join-showtime", (showtimeId: string) => {
      const roomName = `showtime-${showtimeId}`;
      socket.join(roomName);
      console.log(`Socket ${socket.id} joined room: ${roomName}`);
    });

    /* HOLD GHẾ (Khi khách đang chọn, chưa bấm đặt) */
    socket.on("hold-seat", ({ showtimeId, seatId }) => {
      // Dùng to(...) để gửi cho tất cả người khác TRỪ người vừa gửi
      socket.to(`showtime-${showtimeId}`).emit("seat:held", { seatId });
    });

    /* RELEASE GHẾ (Khi khách bỏ chọn) */
    socket.on("release-seat", ({ showtimeId, seatId }) => {
      socket.to(`showtime-${showtimeId}`).emit("seat:released", { seatId });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}