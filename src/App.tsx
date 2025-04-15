import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Sidebar from "./components/Sidebar";
import { Route, Routes, useLocation } from "react-router-dom";
import { Navigate } from 'react-router-dom';  // Add this import
import UsersList from "./components/pages/usersList";
import ProductsList from "./components/pages/productsList";
import AdminRoute from "./AdminRoute"; // Import AdminRoute
import LoginComponent from "./components/auth/login";
import ProductDetail from "./components/pages/detail-pages/product-detail";
import UsersDetail from "./components/pages/detail-pages/user-detail";

export default function JoyOrderDashboardTemplate() {
  let location = useLocation();

  const hiddenSideBar = location.pathname === "/";

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        {!hiddenSideBar && <Sidebar />}
        <Routes>
          <Route element={<AdminRoute />}>
            <Route path="/users-list" element={<UsersList />} />
            <Route path="/products-list" element={<ProductsList />} />
            <Route path="/product-detail/:id" element={<ProductDetail />} />
            <Route path="/user-detail/:id" element={<UsersDetail />} />
          </Route>
          <Route path="/" element={<LoginComponent />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </CssVarsProvider>
  );
}
