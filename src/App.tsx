import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Sidebar from "./components/Sidebar";
import { Route, Routes, useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom"; // Add this import
import UsersList from "./components/pages/usersList";
import ProductsList from "./components/pages/productsList";
import AdminRoute from "./AdminRoute"; // Import AdminRoute
import LoginComponent from "./components/auth/login";
import ProductDetail from "./components/pages/detail-pages/product-detail";
import UsersDetail from "./components/pages/detail-pages/user-detail";
import Messages from "./components/pages/messages/messages";
import EmailLists from "./components/pages/messages/email";
import EmailLayout from "./components/pages/messages/layout";

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
            <Route path="/messages" element={<Messages />} />
            <Route path="/emails" element={<EmailLists />} />
            <Route path="/product-detail/:id" element={<ProductDetail />} />
            <Route path="/user-detail/:id" element={<UsersDetail />} />
            <Route path="/messages" element={<EmailLayout />}>
              <Route index element={<EmailLists />} />
              <Route path=":id" element={<Messages />} />
            </Route>
          </Route>
          <Route path="/" element={<LoginComponent />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </CssVarsProvider>
  );
}
