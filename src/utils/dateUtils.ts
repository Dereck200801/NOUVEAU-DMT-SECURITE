/**
 * Utility functions for date handling
 */

/**
 * Normalizes a date to YYYY-MM-DD format
 * @param dateInput Date object, date string, or date-like string
 * @returns Normalized date string in YYYY-MM-DD format
 */
export function normalizeDate(dateInput: Date | string): string {
  console.log('Normalizing date:', dateInput);
  let date: Date;
  
  if (typeof dateInput === 'string') {
    // Check if it's already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      console.log('Date is already normalized:', dateInput);
      return dateInput;
    }
    
    // Parse the date string
    date = new Date(dateInput);
  } else {
    date = dateInput;
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', dateInput);
    throw new Error('Invalid date');
  }
  
  const year = date.getFullYear();
  // getMonth() returns 0-11, so add 1 and pad with leading zero if needed
  const month = String(date.getMonth() + 1).padStart(2, '0');
  // pad with leading zero if needed
  const day = String(date.getDate()).padStart(2, '0');
  
  const normalized = `${year}-${month}-${day}`;
  console.log('Normalized date:', normalized);
  return normalized;
}

/**
 * Creates a date string in YYYY-MM-DD format
 * @param year Year
 * @param month Month (1-12)
 * @param day Day of month
 * @returns Date string in YYYY-MM-DD format
 */
export function createDateString(year: number, month: number, day: number): string {
  console.log(`Creating date string for: ${year}-${month}-${day}`);
  // Ensure month is 1-12
  if (month < 1 || month > 12) {
    console.error('Invalid month:', month);
    throw new Error('Invalid month');
  }
  
  // Format month and day with leading zeros
  const formattedMonth = String(month).padStart(2, '0');
  const formattedDay = String(day).padStart(2, '0');
  
  const dateString = `${year}-${formattedMonth}-${formattedDay}`;
  console.log('Created date string:', dateString);
  return dateString;
}

/**
 * Compares two dates (can be Date objects or strings)
 * @param date1 First date
 * @param date2 Second date
 * @returns true if dates are the same day, false otherwise
 */
export function areSameDay(date1: Date | string, date2: Date | string): boolean {
  const normalizedDate1 = normalizeDate(date1);
  const normalizedDate2 = normalizeDate(date2);
  
  console.log(`Comparing dates: ${normalizedDate1} === ${normalizedDate2} -> ${normalizedDate1 === normalizedDate2}`);
  
  return normalizedDate1 === normalizedDate2;
} 