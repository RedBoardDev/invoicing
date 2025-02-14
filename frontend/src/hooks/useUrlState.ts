import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type NavigateMode = "push" | "replace";
type UrlState = Record<string, string | number | boolean | undefined>;

interface UseUrlStateOptions {
	navigateMode?: NavigateMode;
}

const useUrlState = <T extends UrlState>(
	initialState?: T,
	options?: UseUrlStateOptions,
): [T, (newState: Partial<T>) => void] => {
	const { navigateMode = "push" } = options || {};
	const location = useLocation();
	const navigate = useNavigate();

	const parseQuery = useCallback(() => {
		const searchParams = new URLSearchParams(location.search);
		const params: UrlState = {};

		for (const [key, value] of searchParams.entries()) {
			if (value === "true") params[key] = true;
			else if (value === "false") params[key] = false;
			else if (!Number.isNaN(Number(value))) params[key] = Number(value);
			else params[key] = value;
		}

		return params as T;
	}, [location.search]);

	const [state, setState] = useState<T>(() => ({
		...(initialState || {}),
		...parseQuery(),
	}));

	const updateUrl = useCallback(
		(newParams: Record<string, unknown>) => {
			const searchParams = new URLSearchParams(location.search);

			// Update URLSearchParams
			for (const [key, value] of Object.entries(newParams)) {
				if (value === undefined || value === null) {
					searchParams.delete(key);
				} else {
					searchParams.set(key, String(value));
				}
			}

			// Build new path
			const newSearch = searchParams.toString();
			const newPath = `${location.pathname}${newSearch ? `?${newSearch}` : ""}${location.hash}`;

			// Navigate with new URL
			navigate(newPath, {
				replace: navigateMode === "replace",
				state: location.state,
			});
		},
		[location, navigate, navigateMode],
	);

	const setUrlState = useCallback(
		(newState: Partial<T>) => {
			setState((prev) => {
				const mergedState = { ...prev, ...newState };
				updateUrl(mergedState);
				return mergedState;
			});
		},
		[updateUrl],
	);

	// Sync state with URL changes (back/forward navigation)
	useEffect(() => {
		const parsedQuery = parseQuery();
		setState((prev) => ({ ...prev, ...parsedQuery }));
	}, [parseQuery]);

	return [state, setUrlState];
};

export default useUrlState;
