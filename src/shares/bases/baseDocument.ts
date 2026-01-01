import { Types } from 'mongoose';

interface IBaseDocument {
  isDeleted: boolean;

  deletedAt?: Date;
  deletedBy?: Types.ObjectId;

  createdAt: Date;
  createdBy?: Types.ObjectId;

  updatedAt?: Date;
  updatedBy?: Types.ObjectId;
}

export type { IBaseDocument };

