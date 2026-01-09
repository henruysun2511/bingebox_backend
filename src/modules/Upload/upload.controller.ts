import { Request, Response } from "express";

export const uploadImage = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "Không có file" });
  }

  return res.json({
    url: (req.file as any).path,   
    publicId: (req.file as any).filename,
  });
};