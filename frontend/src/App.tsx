import { ConfigProvider, Spin, message } from "antd";
import enEN from "antd/locale/en_US";
import { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { ErrorBoundary } from "@components/errors";
import antdTheme from "@config/antdTheme";
import { AuthProvider } from "@contexts/AuthProvider";
import { MessageContext } from "@contexts/MessageContext";
import AppRoutes from "./routes";

const App = () => {
	const [messageApi, contextHolder] = message.useMessage();

	return (
		<MessageContext.Provider value={messageApi}>
			<ConfigProvider locale={enEN} theme={antdTheme}>
				<ErrorBoundary>
					<AuthProvider>
						<Router>
							<Suspense
								fallback={<Spin size="large" style={{ marginTop: "20%" }} />}
							>
								{contextHolder}
								<AppRoutes />
							</Suspense>
						</Router>
					</AuthProvider>
				</ErrorBoundary>
			</ConfigProvider>
		</MessageContext.Provider>
	);
};

export default App;
