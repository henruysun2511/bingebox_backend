import mongoose from "mongoose";
import { IBaseDocument } from "../../shares/bases/baseDocument";
import { GenderEnum, LoginTypeEnum } from "../../shares/constants/enum";
import { IMembership } from "../membership/membership.interface";

interface IUser extends IBaseDocument {
    _id: mongoose.Types.ObjectId;
    username: string;
    email: string;
    password?: string;
    fullName?: string;
    banner?: string;
    tags?: string[];
    avatar?: string;
    birth?: Date;
    gender?: GenderEnum;
    googleId?: string;
    provider?: LoginTypeEnum;
    role: mongoose.Types.ObjectId;
    membership?: mongoose.Types.ObjectId | IMembership;
    currentPoints: number;
    totalSpending: number;
    isBlocked: boolean;
}

export type { IUser };
