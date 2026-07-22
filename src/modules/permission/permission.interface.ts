import mongoose from "mongoose";
import { IBaseDocument } from "../../shares/bases/baseDocument";
import { PermissionMethodTypeEnum } from "../../shares/constants/enum";

interface IPermission extends IBaseDocument {
    _id?: mongoose.Types.ObjectId;
    name: string,
    path: string,
    method: PermissionMethodTypeEnum,
    module: string,
    description?: string
}

export type { IPermission };
