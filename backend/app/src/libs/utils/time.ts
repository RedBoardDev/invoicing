/**
 * Adds a number of years to the current epoch time.
 * @param year - The number of years to add.
 * @returns The new epoch time in milliseconds after adding the specified number of years.
 */
export const addYearsToEpoch = (year: number): number => new Date().getTime() + year * 365 * 24 * 60 * 60;

/**
 * Adds a number of months to the current epoch time.
 * @param month - The number of months to add.
 * @returns The new epoch time in milliseconds after adding the specified number of months.
 */
export const addMonthsToEpoch = (month: number): number => new Date().getTime() + month * 30 * 24 * 60 * 60;

/**
 * Adds a number of weeks to the current epoch time.
 * @param week - The number of weeks to add.
 * @returns The new epoch time in milliseconds after adding the specified number of weeks.
 */
export const addWeeksToEpoch = (week: number): number => new Date().getTime() + week * 7 * 24 * 60 * 60;

/**
 * Adds a number of days to the current epoch time.
 * @param day - The number of days to add.
 * @returns The new epoch time in milliseconds after adding the specified number of days.
 */
export const addDaysToEpoch = (day: number): number => new Date().getTime() + day * 24 * 60 * 60;

/**
 * Removes a number of years from the current date and returns the ISO string representation of the resulting date.
 * @param year - The number of years to remove.
 * @returns The ISO string representation of the date after removing the specified number of years.
 */
export const removeYearsToISOString = (year: number): string => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - year);
  return date.toISOString();
};

/**
 * Vérifie si une date est aujourd'hui.
 * @param date - La date à vérifier.
 * @returns Vrai si la date est aujourd'hui, faux sinon.
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Vérifie si une date est dans le futur.
 * @param date - La date à vérifier.
 * @returns Vrai si la date est dans le futur, faux sinon.
 */
export const isFutureDate = (date: Date): boolean => date > new Date();

/**
 * Vérifie si une date est dans le passé.
 * @param date - La date à vérifier.
 * @returns Vrai si la date est dans le passé, faux sinon.
 */
export const isPastDate = (date: Date): boolean => date < new Date();
