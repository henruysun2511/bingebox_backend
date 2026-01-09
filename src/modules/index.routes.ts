import { Router } from "express";
import actorRouter from "./Actor/actor.route";
import ageTypeRouter from "./AgeType/ageType.route";
import authRouter from "./Auth/auth.route";
import bookingRouter from "./Booking/booking.route";
import categoryRouter from "./Category/category.route";
import cinemaRouter from "./Cinema/cinema.route";
import commentRouter from "./Comment/comment.route";
import foodRouter from "./Food/food.routes";
import formatRoomRouter from "./FormatRoom/formatRoom.route";
import membershipRouter from "./Membership/membership.route";
import movieRouter from "./Movie/movie.route";
import permissionRouter from "./Permission/permission.route";
import quickTicketBuyingRouter from "./QuickTicketBuying/quickTicketBuying.route";
import roleRouter from "./Role/role.route";
import roomRouter from "./Room/room.route";
import seatRouter from "./Seat/seat.route";
import seatTypeoRouter from "./SeatType/seatType.route";
import showtimeRouter from "./Showtime/showtime.route";
import ticketRouter from "./Ticket/ticket.route";
import ticketPriceRouter from "./TicketPrice/ticketPrice.route";
import timeSlotRouter from "./TimeSlot/timeSlot.route";
import userRouter from "./User/user.route";
import voucherRouter from "./Voucher/voucher.route";
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

export default router;