import { BrowserRouter as Router } from "react-router-dom";
import { ConfigProvider, Spin } from "antd";
import enEN from "antd/locale/en_US";
import { Suspense } from "react";
import theme from "@config/antdTheme";

import { AuthProvider } from "@contexts/AuthContext";
import { ErrorBoundary } from "@components/errors";
import AppRoutes from "./routes";

const App = () => (
  <ConfigProvider locale={enEN} theme={theme}>
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
