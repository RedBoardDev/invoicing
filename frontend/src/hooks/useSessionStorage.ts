import { useCallback, useEffect, useState } from "react";

type SetStateAction<T> = T | ((prevState: T) => T);

/**
 * Hook for synchronizing state with sessionStorage
 *
 * @param key - Storage key
 * @param initialValue - Initial value if no stored value
 *
 * @returns [storedValue, setValue] - State and setter
 *
 * @example
 * const [sessionToken, setSessionToken] = useSessionStorage('token', '');
 */
export function useSessionStorage<T>(
	key: string,
	initialValue: T,
): [T, (value: SetStateAction<T>) => void] {
	const readValue = useCallback((): T => {
		if (typeof window === "undefined") return initialValue;

		try {
			const item = window.sessionStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.warn(`Error reading sessionStorage key "${key}":`, error);
			return initialValue;
		}
	}, [key, initialValue]);

	const [storedValue, setStoredValue] = useState<T>(readValue);

	const setValue = useCallback(
		(value: SetStateAction<T>) => {
			try {
				const newValue = value instanceof Function ? value(storedValue) : value;

				window.sessionStorage.setItem(key, JSON.stringify(newValue));
				setStoredValue(newValue);

				window.dispatchEvent(new Event("session-storage"));
			} catch (error) {
				console.warn(`Error setting sessionStorage key "${key}":`, error);
			}
		},
		[key, storedValue],
	);

	useEffect(() => {
		setStoredValue(readValue());
	}, [readValue]);

	useEffect(() => {
		const handleStorageChange = () => setStoredValue(readValue());

		window.addEventListener("storage", handleStorageChange);
		window.addEventListener("session-storage", handleStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
			window.removeEventListener("session-storage", handleStorageChange);
		};
	}, [readValue]);

	return [storedValue, setValue];
}
