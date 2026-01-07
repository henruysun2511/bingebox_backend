export function buildTicketPriceQuery(query: any) {
    const filter: any = { isDeleted: false };

    if (query.timeSlot) filter.timeSlot = query.timeSlot;
    if (query.ageType) filter.ageType = query.ageType;
    if (query.formatRoom) filter.formatRoom = query.formatRoom;
    if (query.seatType) filter.seatType = query.seatType;
    if (query.dayOfWeek) filter.dayOfWeek = query.dayOfWeek;

    // Lọc theo khoảng giá
    if (query.minPrice || query.maxPrice) {
        filter.finalPrice = {};
        if (query.minPrice) filter.finalPrice.$gte = Number(query.minPrice);
        if (query.maxPrice) filter.finalPrice.$lte = Number(query.maxPrice);
    }

    return { filter };
}