import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { DashboardService } from "./dashboard.service";

const service = new DashboardService();

const getQueryDates = (req: Request) => {
    const { from, to } = req.query;
    return {
        fromDate: from ? new Date(from as string) : undefined,
        toDate: to ? new Date(to as string) : undefined
    };
};

export const getRevenueStats = catchAsync(async (req: Request, res: Response) => {
    const { fromDate, toDate } = getQueryDates(req);
    const result = await service.getRevenueStatsByMonth(fromDate, toDate);
    return success(res, result, "Lấy thống kê doanh thu thành công");
});

export const getTicketSales = catchAsync(async (req: Request, res: Response) => {
    const { fromDate, toDate } = getQueryDates(req);
    const result = await service.getTicketSalesByMonth(fromDate, toDate);
    return success(res, result, "Lấy thống kê số lượng vé thành công");
});

export const getTopMovies = catchAsync(async (req: Request, res: Response) => {
    const { fromDate, toDate } = getQueryDates(req);
    const result = await service.getTopMoviesByMonth(fromDate, toDate);
    return success(res, result, "Lấy danh sách phim doanh thu cao thành công");
});

export const getTopCustomers = catchAsync(async (req: Request, res: Response) => {
    const result = await service.getTop5SpendingCustomers();
    return success(res, result, "Lấy danh sách khách hàng thân thiết thành công");
});

export const getCustomerGrowth = catchAsync(async (req: Request, res: Response) => {
    const { fromDate, toDate } = getQueryDates(req);
    const result = await service.getCustomerGrowthByMonth(fromDate, toDate);
    return success(res, result, "Lấy thống kê tăng trưởng khách hàng thành công");
});

export const getMembershipDist = catchAsync(async (req: Request, res: Response) => {
    const result = await service.getMembershipDistribution();
    return success(res, result, "Lấy phân bổ hạng thành viên thành công");
});

export const getHourlySales = catchAsync(async (req: Request, res: Response) => {
    const { fromDate, toDate } = getQueryDates(req);
    const result = await service.getTicketCountByHour(fromDate, toDate);
    return success(res, result, "Lấy thống kê vé theo khung giờ thành công");
});

export const getOccupancyStats = catchAsync(async (req: Request, res: Response) => {
    const result = await service.getOccupancyStatsByMonth();
    return success(res, result, "Lấy tỷ lệ lấp đầy phòng chiếu thành công");
});