// import { BookingStatusEnum, PaymentStatusEnum, TicketStatusEnum } from "@/shares/constants/enum";
// import { AppError } from "@/utils/appError";

// export class PaymentService {
//     async createVNPayPayment(bookingId: string, ipAddr: string) {
//         const booking = await BookingModel.findById(bookingId);

//         if (!booking)
//             throw new AppError("Booking không tồn tại", 404);

//         if (booking.bookingStatus !== BookingStatusEnum.PENDING)
//             throw new AppError("Booking không hợp lệ", 400);

//         if (booking.expiresAt < new Date())
//             throw new AppError("Booking đã hết hạn", 400);

//         const vnpTxnRef = Date.now().toString();

//         await PaymentModel.create({
//             booking: booking._id,
//             amount: booking.finalAmount,
//             method: "VNPAY",
//             status: PaymentStatusEnum.PENDING,
//             vnpTxnRef
//         });

//         const vnpParams = buildVNPayParams({
//             amount: booking.finalAmount,
//             txnRef: vnpTxnRef,
//             ipAddr
//         });

//         const paymentUrl = VNPayConfig.vnpUrl + "?" + vnpParams;
//         return paymentUrl;
//     }

//     async handleVNPayCallback(vnpParams: any) {
//         const isValid = verifyVNPaySignature(vnpParams);
//         if (!isValid) throw new AppError("Invalid signature", 400);

//         const payment = await PaymentModel.findOne({
//             vnpTxnRef: vnpParams.vnp_TxnRef
//         }).populate("booking");

//         if (!payment) throw new AppError("Payment not found", 404);

//         if (vnpParams.vnp_ResponseCode === "00") {
//             /* ===== SUCCESS ===== */
//             payment.status = PaymentStatusEnum.SUCCESS;
//             await payment.save();

//             await BookingModel.updateOne(
//                 { _id: payment.booking },
//                 { bookingStatus: BookingStatusEnum.SUCCESS }
//             );

//             await TicketModel.updateMany(
//                 { booking: payment.booking },
//                 {
//                     status: TicketStatusEnum.PAID,
//                     expiresAt: null
//                 }
//             );

//             // cộng điểm + upgrade membership
//             await MembershipService.confirmAfterPayment(payment.booking);

//             return "Thanh toán thành công";
//         }

//         /* ===== FAILED ===== */
//         payment.status = PaymentStatusEnum.FAILED;
//         await payment.save();

//         await BookingModel.updateOne(
//             { _id: payment.booking },
//             { bookingStatus: BookingStatusEnum.FAILED }
//         );

//         await TicketModel.updateMany(
//             { booking: payment.booking },
//             { status: TicketStatusEnum.CANCELLED }
//         );

//         return "Thanh toán thất bại";
//     }
// }