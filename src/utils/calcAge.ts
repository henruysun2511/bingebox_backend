export function calcAge(birth?: Date | string): number {
  if (!birth) return 0;

  // Ép kiểu về Date để đảm bảo có các hàm getFullYear, getMonth...
  const birthDate = new Date(birth);
  
  // Kiểm tra nếu date không hợp lệ (Invalid Date)
  if (isNaN(birthDate.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}