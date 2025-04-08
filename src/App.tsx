import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Sidebar from "./components/Sidebar";
import { Route, Routes, useLocation } from "react-router-dom";
import UsersList from "./components/pages/usersList";
import ProductsList from "./components/pages/productsList";
import LoginComponent from "./components/auth/login";
import ProductDetail from "./components/pages/product-detail";

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
          <Route path="/" element={<LoginComponent />} />
          <Route path="/users-list" element={<UsersList />} />
          <Route path="/products-list" element={<ProductsList />} />
          <Route path="/product-detail" element={<ProductDetail />} />
        </Routes>
      </Box>
    </CssVarsProvider>
  );
}