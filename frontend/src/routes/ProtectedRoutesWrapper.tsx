import { PulseLoader } from "@components/common";
import { ROUTE_PATHS } from "@config/routePaths";
import { useAuth } from "@hooks/useAuth";
import type React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoutesWrapper: React.FC = () => {
	const { isAuthenticated, loading } = useAuth();
	const location = useLocation();

	if (loading) return <PulseLoader />;

	// if (!isAuthenticated) {
	// 	return (
	// 		<Navigate
	// 			to={ROUTE_PATHS.error.unauthorized}
	// 			state={{ from: location }}
	// 			replace
	// 		/>
	// 	);
	// }

	return <Outlet />;
};

export default ProtectedRoutesWrapper;
