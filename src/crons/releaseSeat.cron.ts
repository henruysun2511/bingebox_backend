import cron from "node-cron";
import BookingModel from "../modules/Booking/booking.schema";
import TicketModel from "../modules/Ticket/ticket.schema";
import { BookingStatusEnum, TicketStatusEnum } from "../shares/constants/enum";


export function startReleaseSeatCron() {
    cron.schedule("*/1 * * * *", async () => {
        const now = new Date();

        try {
            /* ================== RELEASE TICKETS ================== */
            const releasedTickets = await TicketModel.updateMany(
                {
                    status: TicketStatusEnum.UNPAID,
                    expiresAt: { $lt: now }
                },
                {
                    status: TicketStatusEnum.CANCELLED,
                    expiresAt: null
                }
            );

            /* ================== CANCEL BOOKINGS ================== */
            await BookingModel.updateMany(
                {
                    bookingStatus: BookingStatusEnum.PENDING,
                    expiresAt: { $lt: now }
                },
                {
                    bookingStatus: BookingStatusEnum.FAILED
                }
            );

            if (releasedTickets.modifiedCount > 0) {
                console.log(
                    `[CRON] Released ${releasedTickets.modifiedCount} seats`
                );
            }

        } catch (err) {
            console.error("[CRON] Release seat error:", err);
        }
    });
}