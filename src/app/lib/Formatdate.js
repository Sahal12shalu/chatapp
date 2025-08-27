import { format, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns';

export function formatWhatsAppTime(dateInput) {
  const date = new Date(dateInput);

  if (isToday(date)) {
    return format(date, 'p'); // 2:30 PM
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  if (isThisWeek(date, { weekStartsOn: 1 })) {
    return format(date, 'EEEE'); // Monday, Tuesday
  }

  if (isThisYear(date)) {
    return format(date, 'MMM d'); // Aug 10
  }

  return format(date, 'MMM d, yyyy'); // Aug 10, 2023
}
