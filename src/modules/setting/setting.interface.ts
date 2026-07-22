import { IBaseDocument } from "../../shares/bases/baseDocument";
import { BaseStatusEnum } from "../../shares/constants/enum";

interface ISetting extends IBaseDocument {
    logo: string;
    name: string;
    company: string;
    email: string;
    address: string;
    hotline: string;
    workHours?: string;
    social?: {
        facebook?: string;
        instagram?: string;
        tiktok?: string;
        zalo?: string;
    }
    banner?: [{
        image: string,
        link: string,
        isActive: BaseStatusEnum
    }];
    popup?: [
        {
            image: string,
            link: string,
            isActive: BaseStatusEnum
        }
    ]
    metaTitle: String,
    metaDescription: String,
}

export type { ISetting };
