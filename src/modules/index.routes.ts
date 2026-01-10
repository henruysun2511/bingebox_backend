import { Router } from "express";
import actorRouter from "./actor/actor.route";
import ageTypeRouter from "./ageType/ageType.route";
import authRouter from "./auth/auth.route";
import blogRouter from "./blog/blog.route";
import bookingRouter from "./booking/booking.route";
import categoryRouter from "./category/category.route";
import cinemaRouter from "./cinema/cinema.route";
import commentRouter from "./comment/comment.route";
import dashboardRouter from "./dashboard/dashboard.route";
import foodRouter from "./food/food.routes";
import formatRoomRouter from "./formatRoom/formatRoom.route";
import membershipRouter from "./membership/membership.route";
import movieRouter from "./movie/movie.route";
import permissionRouter from "./permission/permission.route";
import quickTicketBuyingRouter from "./quickTicketBuying/quickTicketBuying.route";
import roleRouter from "./role/role.route";
import roomRouter from "./room/room.route";
import seatRouter from "./seat/seat.route";
import seatTypeoRouter from "./seatType/seatType.route";
import showtimeRouter from "./showtime/showtime.route";
import ticketRouter from "./ticket/ticket.route";
import ticketPriceRouter from "./ticketPrice/ticketPrice.route";
import timeSlotRouter from "./timeSlot/timeSlot.route";
import uploadRouter from "./upload/upload.route";
import userRouter from "./user/user.route";
import voucherRouter from "./voucher/voucher.route";
const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/age-types", ageTypeRouter);
router.use("/memberships", membershipRouter);
router.use("/roles", roleRouter);
router.use("/permissions", permissionRouter);

router.use("/actors", actorRouter);
router.use("/categories", categoryRouter);
router.use("/movies", movieRouter);
router.use("/comments", commentRouter);

router.use("/cinemas", cinemaRouter);
router.use("/rooms", roomRouter);
router.use("/format-rooms", formatRoomRouter);

router.use("/showtimes", showtimeRouter);
router.use("/time-slots", timeSlotRouter);

router.use("/seats", seatRouter);
router.use("/seat-types", seatTypeoRouter);

router.use("/foods", foodRouter);

router.use("/tickets", ticketRouter);
router.use("/ticket-prices", ticketPriceRouter);
router.use("/quick-ticket-buyings", quickTicketBuyingRouter);

router.use("/vouchers", voucherRouter);

router.use("/bookings", bookingRouter);
router.use("/dashboards", dashboardRouter);

router.use("/blogs", blogRouter);

router.use("/upload", uploadRouter);

export default router;