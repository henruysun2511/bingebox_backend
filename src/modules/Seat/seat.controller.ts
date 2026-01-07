import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { SeatService } from "./seat.service";

const seatService = new SeatService();

export const updateSeat = catchAsync(async (req: Request, res: Response) => {
    const { roomId } = req.params; 
    const { seats } = req.body;   
    
    const result = await seatService.updateSeat(roomId, seats, req.user!._id.toString());
    return success(res, result, "Cập nhật sơ đồ ghế thành công");
});

export const getSeatsByRoom = catchAsync(async (req: Request, res: Response) => {
    const { roomId } = req.params;
    
    const seats = await seatService.getSeatsByRoomId(roomId);
    
    return success(
        res, 
        seats, 
        "Lấy danh sách ghế theo phòng thành công"
    );
});