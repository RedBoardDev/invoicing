import { ConfigProvider, Spin } from "antd";
import enEN from "antd/locale/en_US";
import { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { ErrorBoundary } from "@components/errors";
import antdTheme from "@config/antdTheme";
import { AuthProvider } from "@contexts/AuthProvider";
import AppRoutes from "./routes";

const App = () => (
	<ConfigProvider locale={enEN} theme={antdTheme}>
		<ErrorBoundary>
			<AuthProvider>
				<Router>
					<Suspense
						fallback={<Spin size="large" style={{ marginTop: "20%" }} />}
					>
						<AppRoutes />
					</Suspense>
				</Router>
			</AuthProvider>
		</ErrorBoundary>
	</ConfigProvider>
);

export default App;
