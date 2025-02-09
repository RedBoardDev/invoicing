import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Toutes les routes protégées seront rendues via le ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          {/* Autres routes protégées */}
        </Route>
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
