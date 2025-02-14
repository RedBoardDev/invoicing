const APP_NAME = "APP";

export const saveToSessionStorage = (
	key: string,
	value: unknown,
	prefix = `${APP_NAME}_data`,
): boolean => {
	try {
		const completeKey = `${prefix}-${key}`;

		if (
			!value ||
			(typeof value === "object" && Object.keys(value).length === 0)
		)
			return false;
		const serializedValue = JSON.stringify(value);
		if (!serializedValue || serializedValue.length < 1) return false;

		sessionStorage.setItem(completeKey, serializedValue);
		return true;
	} catch (error) {
		console.error("Error saving to sessionStorage:", error);
		return false;
	}
};

export const getFromSessionStorage = (
	key: string,
	prefix = `${APP_NAME}_data`,
): unknown | undefined => {
	try {
		const serializedValue = sessionStorage.getItem(`${prefix}-${key}`);
		if (!serializedValue || serializedValue.length < 1) return undefined;

		return JSON.parse(serializedValue);
	} catch (error) {
		console.error("Error reading from sessionStorage:", error);
		return undefined;
	}
};

export const removeFromSessionStorage = (
	key: string,
	prefix = `${APP_NAME}_data`,
): boolean => {
	try {
		sessionStorage.removeItem(`${prefix}-${key}`);
		return true;
	} catch (error) {
		console.error("Error removing from sessionStorage:", error);
		return false;
	}
};

export function clearKareData(prefix = `${APP_NAME}_data`) {
	for (const key of Object.keys(sessionStorage)) {
		if (key.startsWith(`${prefix}-`)) {
			sessionStorage.removeItem(key);
		}
	}
}
