const fs = require("fs");

// ===============================
// ID CỦA MÀY
// ===============================

const AGE = {
  CHILD: "69948c4998173b661f2b7c38",
  U22: "69948e8d83e9246748f6ea52",
  ADULT: "69948fb983e9246748f6ea68",
};

const FORMAT = {
  STANDARD: "698443b7285ca06541dc3113",
  IMAX: "6984441b285ca06541dc311f",
  THREE_D: "69844427285ca06541dc3125",
};

const SEAT = {
  STANDARD: "6984485b285ca06541dc3152",
  VIP: "69844875285ca06541dc3159",
  SWEETBOX: "6984488d285ca06541dc315e",
};

const TIME = {
  BEFORE_12: "69885d7875aca88b9501b76b",
  FROM_12_17: "698849dc67ab5f59e88c3e43",
  FROM_17_23: "69884a0267ab5f59e88c3e49",
  AFTER_23: "69884a7967ab5f59e88c3e52",
};

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const WEEKEND = ["FRIDAY", "SATURDAY", "SUNDAY"];

// ===============================
// BẢNG GIÁ 2D NGƯỜI LỚN
// ===============================

const PRICE_2D = {
  weekday: {
    BEFORE_12: { STANDARD: 55000, VIP: 65000, SWEETBOX: 140000 },
    FROM_12_17: { STANDARD: 70000, VIP: 75000, SWEETBOX: 160000 },
    FROM_17_23: { STANDARD: 80000, VIP: 85000, SWEETBOX: 180000 },
    AFTER_23: { STANDARD: 65000, VIP: 70000, SWEETBOX: 150000 },
  },
  weekend: {
    BEFORE_12: { STANDARD: 70000, VIP: 80000, SWEETBOX: 170000 },
    FROM_12_17: { STANDARD: 80000, VIP: 85000, SWEETBOX: 180000 },
    FROM_17_23: { STANDARD: 90000, VIP: 95000, SWEETBOX: 200000 },
    AFTER_23: { STANDARD: 75000, VIP: 80000, SWEETBOX: 170000 },
  },
};

// ===============================
// BẢNG GIÁ 3D NGƯỜI LỚN (THEO ẢNH)
// ===============================

const PRICE_3D = {
  weekday: {
    BEFORE_12: { STANDARD: 60000, VIP: 80000, SWEETBOX: 160000 },
    FROM_12_17: { STANDARD: 80000, VIP: 90000, SWEETBOX: 180000 },
    FROM_17_23: { STANDARD: 100000, VIP: 110000, SWEETBOX: 220000 },
    AFTER_23: { STANDARD: 100000, VIP: 110000, SWEETBOX: 220000 },
  },
  weekend: {
    BEFORE_12: { STANDARD: 80000, VIP: 100000, SWEETBOX: 200000 },
    FROM_12_17: { STANDARD: 100000, VIP: 110000, SWEETBOX: 220000 },
    FROM_17_23: { STANDARD: 130000, VIP: 140000, SWEETBOX: 280000 },
    AFTER_23: { STANDARD: 120000, VIP: 130000, SWEETBOX: 260000 },
  },
};

let result = [];

// ===============================
// GENERATE 2D
// ===============================

DAYS.forEach((day) => {
  const type = WEEKEND.includes(day) ? "weekend" : "weekday";

  Object.keys(TIME).forEach((timeKey) => {
    Object.keys(SEAT).forEach((seatKey) => {
      const basePrice = PRICE_2D[type][timeKey][seatKey];

      // Người lớn
      result.push({
        timeSlot: TIME[timeKey],
        ageType: AGE.ADULT,
        formatRoom: FORMAT.STANDARD,
        seatType: SEAT[seatKey],
        dayOfWeek: day,
        finalPrice: basePrice,
      });

      // Trẻ em -20%
      result.push({
        timeSlot: TIME[timeKey],
        ageType: AGE.CHILD,
        formatRoom: FORMAT.STANDARD,
        seatType: SEAT[seatKey],
        dayOfWeek: day,
        finalPrice: Math.round(basePrice * 0.8),
      });

      // U22 chỉ áp dụng 2D Mon-Fri
      if (!WEEKEND.includes(day)) {
        result.push({
          timeSlot: TIME[timeKey],
          ageType: AGE.U22,
          formatRoom: FORMAT.STANDARD,
          seatType: SEAT[seatKey],
          dayOfWeek: day,
          finalPrice: 55000,
        });
      }
    });
  });
});

// ===============================
// GENERATE 3D (NO U22)
// ===============================

DAYS.forEach((day) => {
  const type = WEEKEND.includes(day) ? "weekend" : "weekday";

  Object.keys(TIME).forEach((timeKey) => {
    Object.keys(SEAT).forEach((seatKey) => {
      const basePrice = PRICE_3D[type][timeKey][seatKey];

      // Người lớn
      result.push({
        timeSlot: TIME[timeKey],
        ageType: AGE.ADULT,
        formatRoom: FORMAT.THREE_D,
        seatType: SEAT[seatKey],
        dayOfWeek: day,
        finalPrice: basePrice,
      });

      // Trẻ em -20%
      result.push({
        timeSlot: TIME[timeKey],
        ageType: AGE.CHILD,
        formatRoom: FORMAT.THREE_D,
        seatType: SEAT[seatKey],
        dayOfWeek: day,
        finalPrice: Math.round(basePrice * 0.8),
      });
    });
  });
});

// ===============================
// GENERATE IMAX (KHÔNG PHÂN GHẾ)
// ===============================

DAYS.forEach((day) => {
  Object.keys(TIME).forEach((timeKey) => {
    // Người lớn 170k
    result.push({
      timeSlot: TIME[timeKey],
      ageType: AGE.ADULT,
      formatRoom: FORMAT.IMAX,
      seatType: SEAT.STANDARD,
      dayOfWeek: day,
      finalPrice: 170000,
    });

    // U22 130k
    result.push({
      timeSlot: TIME[timeKey],
      ageType: AGE.U22,
      formatRoom: FORMAT.IMAX,
      seatType: SEAT.STANDARD,
      dayOfWeek: day,
      finalPrice: 130000,
    });

    // Trẻ em 130k
    result.push({
      timeSlot: TIME[timeKey],
      ageType: AGE.CHILD,
      formatRoom: FORMAT.IMAX,
      seatType: SEAT.STANDARD,
      dayOfWeek: day,
      finalPrice: 130000,
    });
  });
});

console.log("Total records:", result.length);

fs.writeFileSync(
  "ticket-price.json",
  JSON.stringify(result, null, 2),
  "utf-8"
);

console.log("✅ File ticket-price.json created!");