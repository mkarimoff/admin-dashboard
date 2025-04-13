import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Sidebar from "./components/Sidebar";
import { Route, Routes, useLocation } from "react-router-dom";
import UsersList from "./components/pages/usersList";
import ProductsList from "./components/pages/productsList";
import ProductDetail from "./components/pages/product-detail";
import AdminRoute from "./AdminRoute"; // Import AdminRoute
import LoginComponent from "./components/auth/login";

export default function JoyOrderDashboardTemplate() {
  let location = useLocation();

  const hiddenSideBar =
    location.pathname === "/" || location.pathname === "/sign-up";

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
          </Route>
          <Route path="/" element={<LoginComponent />} />
        </Routes>
      </Box>
    </CssVarsProvider>
  );
}
