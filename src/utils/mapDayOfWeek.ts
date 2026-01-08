import { DayOfWeekEnum } from "@/shares/constants/enum";

export function mapDayOfWeek(date: Date): DayOfWeekEnum {
  const day = date.getDay(); // 0–6
  const map: Record<number, DayOfWeekEnum> = {
    0: DayOfWeekEnum.SUNDAY,
    1: DayOfWeekEnum.MONDAY,
    2: DayOfWeekEnum.TUESDAY,
    3: DayOfWeekEnum.WEDNESDAY,
    4: DayOfWeekEnum.THURSDAY,
    5: DayOfWeekEnum.FRIDAY,
    6: DayOfWeekEnum.SATURDAY,
  };
  return map[day];
}