import { useCallback, useState } from "react";

export interface UseToggleReturn {
	value: boolean;
	toggle: () => void;
	setTrue: () => void;
	setFalse: () => void;
}

/**
 * A custom hook for handling boolean state with toggle functionality
 *
 * @param initialValue - Initial boolean value (default: false)
 *
 * @returns {Object} Toggle utilities
 * @returns {boolean} value - Current state
 * @returns {() => void} toggle - Toggle the state
 * @returns {() => void} setTrue - Set state to true
 * @returns {() => void} setFalse - Set state to false
 *
 * @example
 * const { value, toggle } = useToggle();
 */
export function useToggle(initialValue = false): UseToggleReturn {
	const [value, setValue] = useState(initialValue);

	const toggle = useCallback(() => setValue((v) => !v), []);
	const setTrue = useCallback(() => setValue(true), []);
	const setFalse = useCallback(() => setValue(false), []);

	return { value, toggle, setTrue, setFalse };
}
