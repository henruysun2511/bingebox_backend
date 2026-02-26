const fs = require("fs");

// ===============================
// ID
// ===============================

const AGE = {
  CHILD: "69948c4998173b661f2b7c38",
  U22: "69948e8d83e9246748f6ea52",
  ADULT: "69948fb983e9246748f6ea68",
};

const FORMAT = {
  STANDARD: "698443b7285ca06541dc3113", // 2D
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
// BASE PRICE TABLE
// ===============================

const PRICE_2D = {
  weekday: {
    BEFORE_12: 55000,
    FROM_12_17: 70000,
    FROM_17_23: 80000,
    AFTER_23: 65000,
  },
  weekend: {
    BEFORE_12: 70000,
    FROM_12_17: 80000,
    FROM_17_23: 90000,
    AFTER_23: 75000,
  },
};

const PRICE_3D = {
  weekday: {
    BEFORE_12: 60000,
    FROM_12_17: 80000,
    FROM_17_23: 100000,
    AFTER_23: 90000,
  },
  weekend: {
    BEFORE_12: 80000,
    FROM_12_17: 100000,
    FROM_17_23: 130000,
    AFTER_23: 110000,
  },
};

let result = [];

// ===============================
// GENERATE FULL 756
// ===============================

DAYS.forEach((day) => {
  const isWeekend = WEEKEND.includes(day);
  const type = isWeekend ? "weekend" : "weekday";

  Object.keys(FORMAT).forEach((formatKey) => {
    Object.keys(TIME).forEach((timeKey) => {
      Object.keys(SEAT).forEach((seatKey) => {
        Object.keys(AGE).forEach((ageKey) => {
          let basePrice = 0;

          // ==========================
          // FORMAT LOGIC
          // ==========================

          if (formatKey === "STANDARD") {
            basePrice = PRICE_2D[type][timeKey];

            if (seatKey === "VIP") basePrice += 10000;
            if (seatKey === "SWEETBOX") basePrice += 80000;
          }

          if (formatKey === "THREE_D") {
            basePrice = PRICE_3D[type][timeKey];

            if (seatKey === "VIP") basePrice += 20000;
            if (seatKey === "SWEETBOX") basePrice += 100000;
          }

          if (formatKey === "IMAX") {
            basePrice = isWeekend ? 190000 : 170000;

            if (seatKey === "VIP") basePrice += 20000;
            if (seatKey === "SWEETBOX") basePrice += 80000;
          }

          // ==========================
          // AGE LOGIC
          // ==========================

          let finalPrice = basePrice;

          if (ageKey === "CHILD") {
            finalPrice = Math.round(basePrice * 0.8);
          }

          if (ageKey === "U22") {
            finalPrice = Math.round(basePrice * 0.9);
          }

          result.push({
            timeSlot: TIME[timeKey],
            ageType: AGE[ageKey],
            formatRoom: FORMAT[formatKey],
            seatType: SEAT[seatKey],
            dayOfWeek: day,
            finalPrice,
          });
        });
      });
    });
  });
});

console.log("Total records:", result.length);

fs.writeFileSync(
  "ticket-price-full.json",
  JSON.stringify(result, null, 2),
  "utf-8"
);

console.log("✅ File ticket-price-full.json created!");