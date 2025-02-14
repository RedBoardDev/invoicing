/**
 * Performs deep equality check between two values
 *
 * @param a - First value
 * @param b - Second value
 *
 * @returns true if values are deeply equal
 *
 * @example
 * deepEqual({ a: 1 }, { a: 1 }) // true
 * deepEqual([1, [2]], [1, [2]]) // true
 */
export function deepEqual(a: unknown, b: unknown): boolean {
	// Strict equality for primitive types
	if (a === b) return true;

	// Handle null/undefined cases
	if (a == null || b == null) return a === b;

	// Check constructor match
	if (a.constructor !== b.constructor) return false;

	// Handle Array comparison
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		return a.every((val, i) => deepEqual(val, b[i]));
	}

	// Handle Date comparison
	if (a instanceof Date && b instanceof Date) {
		return a.getTime() === b.getTime();
	}

	// Handle Object comparison
	if (typeof a === "object" && typeof b === "object") {
		const keysA = Object.keys(a);
		const keysB = Object.keys(b);

		if (keysA.length !== keysB.length) return false;

		return keysA.every(
			(key) =>
				Object.prototype.hasOwnProperty.call(b, key) &&
				deepEqual(
					(a as Record<string, unknown>)[key],
					(b as Record<string, unknown>)[key],
				),
		);
	}

	// Fallback for other types
	return false;
}
