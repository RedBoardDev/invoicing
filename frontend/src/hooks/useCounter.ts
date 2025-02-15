import { useCallback, useState } from "react";

export interface UseCounterReturn {
	count: number;
	increment: (amount?: number) => void;
	decrement: (amount?: number) => void;
	reset: () => void;
	setCount: (value: number) => void;
}

interface UseCounterOptions {
	min?: number;
	max?: number;
	initial?: number;
}

/**
 * Custom hook for managing numeric counter state
 *
 * @param options - Configuration options
 * @param options.initial - Initial value (default: 0)
 * @param options.min - Minimum allowed value
 * @param options.max - Maximum allowed value
 *
 * @example
 * const { count, increment } = useCounter({ initial: 5, min: 0 });
 * <button onClick={() => increment(2)}>Count: {count}</button>
 */
export function useCounter({
	initial = 0,
	min,
	max,
}: UseCounterOptions = {}): UseCounterReturn {
	const [count, setCount] = useState(initial);

	const clamp = useCallback(
		(value: number) =>
			Math.min(
				Math.max(value, min ?? Number.NEGATIVE_INFINITY),
				max ?? Number.POSITIVE_INFINITY,
			),
		[min, max],
	);

	const increment = useCallback(
		(amount = 1) => setCount((c) => clamp(c + amount)),
		[clamp],
	);

	const decrement = useCallback(
		(amount = 1) => setCount((c) => clamp(c - amount)),
		[clamp],
	);

	const reset = useCallback(() => setCount(initial), [initial]);
	const setCountClamped = useCallback(
		(value: number) => setCount(clamp(value)),
		[clamp],
	);

	return {
		count,
		increment,
		decrement,
		reset,
		setCount: setCountClamped,
	};
}
