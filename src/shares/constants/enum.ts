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
  MON = "MON",
  TUE = "TUE",
  WED = "WED",
  THU = "THU",
  FRI = "FRI",
  SAT = "SAT",
  SUN = "SUN",
}


export enum BaseStatusEnum {
    ACTIVE = "active",
    INACTIVE = "inactive"
}

export enum BookingStatusEnum {
    SUCCESS = "success",
    FAILED = "failed"
}

export enum PaymentStatusEnum {
    PENDING = "pending",
    PAID = "paid",
    CANCELLED = "cancelled"
}