import { useCallback, useState } from "react";

export interface UseCounterReturn {
	count: number;
	increment: () => void;
	decrement: () => void;
	reset: () => void;
	setCount: (value: number) => void;
}

/**
 * A custom hook for managing a numeric counter
 *
 * @param initialValue - Initial count value (default: 0)
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 *
 * @returns {Object} Counter utilities
 */
export function useCounter(
	initialValue = 0,
	min = Number.NEGATIVE_INFINITY,
	max: number = Number.POSITIVE_INFINITY,
): UseCounterReturn {
	const [count, setCount] = useState(initialValue);

	const boundedSet = useCallback(
		(value: number) => setCount(Math.min(Math.max(value, min), max)),
		[min, max],
	);

	const increment = useCallback(
		() => boundedSet(count + 1),
		[count, boundedSet],
	);
	const decrement = useCallback(
		() => boundedSet(count - 1),
		[count, boundedSet],
	);
	const reset = useCallback(
		() => boundedSet(initialValue),
		[initialValue, boundedSet],
	);

	return {
		count,
		increment,
		decrement,
		reset,
		setCount: boundedSet,
	};
}
