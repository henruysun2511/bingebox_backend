import { AgePermissionTypeEnum, BookingStatusEnum, DayOfWeekEnum, GenderEnum, LoginTypeEnum, MovieStatusEnum, PaymentStatusEnum, PermissionMethodTypeEnum, SeatLayoutTypeEnum, SubtitleTypeEnum, TicketStatusEnum } from "@/shares/constants/enum";
import mongoose from "mongoose";
import { IBaseDocument } from "../shares/bases/baseDocument";
import { BaseStatusEnum } from './../shares/constants/enum';

interface IUser extends IBaseDocument {
    _id: mongoose.Types.ObjectId;
    username: string;
    email: string;
    password?: string;
    fullName?: string;
    avatar?: string;
    birth?: Date;
    gender?: GenderEnum;
    googleId?: string;
    provider?: LoginTypeEnum;
    role: mongoose.Types.ObjectId;
    membership?: mongoose.Types.ObjectId | IMembership;
    currentPoints: number; // Điểm hiện đang có để tiêu dùng
    totalSpending: number;
    isBlocked: boolean;
}

export type { IUser };

interface IMembership extends IBaseDocument {
    _id?: mongoose.Types.ObjectId;
    name: string; // "Silver", "Gold", "Diamond"
    minSpending: number; // Số tiền tối thiểu đã tiêu để đạt hạng này
    pointAccumulationRate: number; // Tỷ lệ tích điểm (VD: 0.05 tức là tích 5% giá trị đơn)
    discountRate: number; // Giảm giá trực tiếp cho thành viên (VD: 0.02 tức giảm 2%)
}
export type { IMembership };

interface IRole extends IBaseDocument {
    _id?: mongoose.Types.ObjectId;
    name: string,
    description?: string,
    permissions: mongoose.Types.ObjectId[];
}

export type { IRole };

interface IPermission extends IBaseDocument {
    _id?: mongoose.Types.ObjectId;
    name: string,
    path: string,
    method: PermissionMethodTypeEnum,
    description?: string
}

export type { IPermission };

interface ISession extends IBaseDocument {
    _id?: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    refreshToken: string;
    expiresAt: Date;
}
export type { ISession };

interface IActor extends IBaseDocument {
    _id?: mongoose.Types.ObjectId;
    name: string;
    bio?: string;
    avatar: string;
    nationality?: string;
    gender?: GenderEnum;
}
export type { IActor };

interface ICategory extends IBaseDocument {
    _id?: mongoose.Types.ObjectId;
    name: string;
}
export type { ICategory };

interface IMovie extends IBaseDocument {
    _id?: mongoose.Types.ObjectId;
    name: string;
    duration: number;
    releaseDate: Date;
    director?: string;
    description: string;
    subtitle?: SubtitleTypeEnum;
    poster: string;
    banner: string;
    trailer: string;
    actors: mongoose.Types.ObjectId[];
    categories: mongoose.Types.ObjectId[];
    nationality?: string;
    agePermission: AgePermissionTypeEnum;
    status: MovieStatusEnum;
    format?: string[];
    likes: mongoose.Types.ObjectId[];
    likeCount: number;
}

export type { IMovie };

interface IShowtime extends IBaseDocument {
    _id?: mongoose.Types.ObjectId;
    movie: mongoose.Types.ObjectId;
    room: mongoose.Types.ObjectId;
    startTime: Date
    endTime: Date
    status: BaseStatusEnum
    timeslot: mongoose.Types.ObjectId;
}

export type { IShowtime };

interface ITimeSlot extends IBaseDocument {
    _id?: mongoose.Types.ObjectId,
    name: string,
    startTime: string,
    endTime: string,
}

export type { ITimeSlot };

interface IRoom extends IBaseDocument {
    _id?: mongoose.Types.ObjectId,
    name: string,
    cinema: mongoose.Types.ObjectId,
    format: mongoose.Types.ObjectId,
    status: BaseStatusEnum;
    seatLayout: {
        type: SeatLayoutTypeEnum;
        rows?: number;
        columns?: number;
        width?: number;
        height?: number;
    };
    totalSeats: number;
}

export type { IRoom };

interface ICinema extends IBaseDocument {
    _id?: mongoose.Types.ObjectId,
    name: string,
    location: string,
    description?: string,
    image?: string,
    province?: string
}
export type { ICinema };

interface IFormatRoom extends IBaseDocument {
    _id?: mongoose.Types.ObjectId,
    name: string,
    description?: string,
    image?: string,
}
export type { IFormatRoom };

interface ISeat {
    _id?: mongoose.Types.ObjectId;
    room: mongoose.Types.ObjectId;
    code: string;

    row?: number;
    column?: number;

    position?: {
        x: number;
        y: number;
    };
    isBlocked?: boolean; //ô trống?
    seatType: mongoose.Types.ObjectId;
    isCoupleSeat: boolean; //ghế đôi?
    partnerSeat?: mongoose.Types.ObjectId; //id ghế đôi
}

export type { ISeat };

interface ISeatType extends IBaseDocument {
    _id: mongoose.Types.ObjectId,
    name: string,
    color: string
}

export type { ISeatType };

interface IAgeType {
    _id: mongoose.Types.ObjectId,
    name: string,
    minAge: number,
    maxAge: number
}

export type { IAgeType };

interface ITicketPrice extends IBaseDocument {
    _id: mongoose.Types.ObjectId,
    timeSlot: mongoose.Types.ObjectId,
    ageType: mongoose.Types.ObjectId,
    formatRoom: mongoose.Types.ObjectId,
    seatType: mongoose.Types.ObjectId,
    dayOfWeek: DayOfWeekEnum,
    finalPrice: number
}

export type { ITicketPrice };

interface ITicket extends IBaseDocument {
    _id: mongoose.Types.ObjectId;
    booking: mongoose.Types.ObjectId;
    showtime: mongoose.Types.ObjectId;
    seat: mongoose.Types.ObjectId;
    ticketPrice: mongoose.Types.ObjectId;
    price: number;
    qrCode: string;
    status: TicketStatusEnum;
    expiresAt: Date;
}

export type { ITicket };

interface IVoucher {
    _id: mongoose.Types.ObjectId,
    name: string,
    description: string,
    startTime: Date,
    endTime: Date,
    minOrderValue: number,
    maxDiscountAmount: number,
    usedCount: number,
    maxUsage: number,
    code: string,
    status: BaseStatusEnum
}

export type { IVoucher };

interface IFood extends IBaseDocument {
    _id: mongoose.Types.ObjectId,
    name: string,
    image: string,
    price: Number
}

export type { IFood };

interface IBooking extends IBaseDocument {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    showtime: mongoose.Types.ObjectId;
    foods: {
        foodId: mongoose.Types.ObjectId;
        quantity: number;
        priceAtBooking: number;
    }[];
    voucher?: mongoose.Types.ObjectId;
    pointsUsed?: number; // Số điểm khách quyết định dùng cho đơn này
    pointsEarned?: number; // Số điểm khách sẽ nhận được sau khi thanh toán thành công
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    bookingStatus: BookingStatusEnum; // PENDING, SUCCESS, FAILED, EXPIRED
    expiresAt: Date; // Thời hạn thanh toán để giữ ghế
}

export type { IBooking };

interface IPayment extends IBaseDocument {
    _id: mongoose.Types.ObjectId;
    booking: mongoose.Types.ObjectId; // Trỏ tới đơn hàng tổng
    transactionId: string; // Mã giao dịch từ cổng thanh toán (VNPAY/Momo)
    amount: number;
    method: string;
    status: PaymentStatusEnum;
}
export type { IPayment };

interface IComment extends IBaseDocument {
    user: mongoose.Types.ObjectId;
    movie: mongoose.Types.ObjectId;
    content: string;
    rating: number;
    likesCount: number;
    replyCount: number;
    parent?: mongoose.Types.ObjectId;
    likes: mongoose.Types.ObjectId[];
}
export type { IComment };

interface IBlog extends IBaseDocument {
    title: string;
    slug: string;
    content: string;
    thumbnail?: string;
    author: mongoose.Types.ObjectId;
    views: number;
    isPublished: boolean;
}

export type { IBlog };


