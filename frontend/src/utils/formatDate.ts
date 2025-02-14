/**
 * Formats a date according to specified pattern
 *
 * @param date - Date object or ISO string
 * @param format - Format pattern (default: 'YYYY-MM-DD')
 *
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date(2023, 0, 15)) // "2023-01-15"
 * formatDate('2023-01-15T00:00:00', 'DD/MM/YYYY') // "15/01/2023"
 */
export function formatDate(date: Date | string, format = "YYYY-MM-DD"): string {
	const parsedDate = new Date(date);

	if (Number.isNaN(parsedDate.getTime())) {
		throw new Error("Invalid date input");
	}

	const padWithZero = (n: number) => n.toString().padStart(2, "0");

	const parts = {
		YYYY: parsedDate.getFullYear(),
		MM: padWithZero(parsedDate.getMonth() + 1),
		DD: padWithZero(parsedDate.getDate()),
		HH: padWithZero(parsedDate.getHours()),
		mm: padWithZero(parsedDate.getMinutes()),
		ss: padWithZero(parsedDate.getSeconds()),
	};

	return format.replace(
		/YYYY|MM|DD|HH|mm|ss/g,
		(match) => parts[match as keyof typeof parts]?.toString() || match,
	);
}
