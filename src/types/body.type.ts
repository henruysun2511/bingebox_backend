import { GenderEnum } from "@/shares/constants/enum";

interface IActorBody {
    name: string;
    bio?: string;
    avatar: string;
    nationality?: string;
    gender?: GenderEnum;
}

export type { IActorBody };

interface IRegisterBody {
    username: string;
    email: string;
    password: string;
    fullName?: string;
    avatar?: string;
    birth?: Date;
}
export type { IRegisterBody };

interface ILoginBody {
    username: string;
    password: string;
}
export type { ILoginBody };

