export enum LoginTypeEnum {
    LOCAL = 'local',
    GOOGLE = 'google',
}

export enum PermissionMethodTypeEnum {
    POST = 'POST',
    GET = 'GET',
    PATCH = 'PATCH',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export enum GenderEnum {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

export enum MovieStatusEnum {
    COMING_SOON = 'COMING_SOON',
    NOW_SHOWING = 'NOW_SHOWING',
    ENDED = 'ENDED',
}

export enum SubtitleTypeEnum {
    NONE = 'NONE',
    SUBTITLE = 'SUBTITLE',
    DUBBING = 'DUBBING',
}

export enum AgePermissionTypeEnum {
    P = "P",
    K = "K",
    T13 = "T13",
    T16 = "T16",
    T18 = "T18",
}

export enum DayOfWeekEnum {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY",
}

export enum BaseStatusEnum {
    ACTIVE = "active",
    INACTIVE = "inactive"
}

export enum SeatLayoutTypeEnum {
    GRID = "GRID",
    FREE = "FREE"
}

export enum TicketStatusEnum {
    PAID = "paid",
    UNPAID = "unpaid",
    CANCELLED = "cancelled"
}

export enum BookingStatusEnum {
    SUCCESS = "success",
    PENDING = "pending",
    FAILED = "failed"
}

export enum PaymentStatusEnum {
    PENDING = "pending",
    SUCCESS = "success",
    FAILED = "failed"
}