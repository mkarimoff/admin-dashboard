import React from "react";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import List from "@mui/joy/List";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ColorSchemeToggle from "./ColorSchemaToggle";
import GroupIcon from "@mui/icons-material/Group";
import { closeSidebar } from "../utils";
import Modal from "@mui/joy/Modal";
import Button from "@mui/joy/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg"

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ FIXED: moved useNavigate inside the component
  const [open, setOpen] = React.useState<boolean>(false);

  const isActive = (path: any) => location.pathname === path;
  const handleLogout = () => {
    navigate("/"); // ✅ clear logout handler
  };

  return (
    <>
      <Sheet
        className="Sidebar"
        sx={{
          position: { xs: "fixed", md: "sticky" },
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
            md: "none",
          },
          transition: "transform 0.4s, width 0.4s",
          zIndex: 10000,
          height: "100dvh",
          width: "var(--Sidebar-width)",
          top: 0,
          p: 2,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRight: "1px solid",
          borderColor: "divider",
        }}
      >
        <GlobalStyles
          styles={(theme) => ({
            ":root": {
              "--Sidebar-width": "220px",
              [theme.breakpoints.up("lg")]: {
                "--Sidebar-width": "240px",
              },
            },
          })}
        />
        <Box
          className="Sidebar-overlay"
          sx={{
            position: "fixed",
            zIndex: 9998,
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            opacity: "var(--SideNavigation-slideIn)",
            backgroundColor: "var(--joy-palette-background-backdrop)",
            transition: "opacity 0.4s",
            transform: {
              xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
              lg: "translateX(-100%)",
            },
          }}
          onClick={() => closeSidebar()}
        />
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <img src={logo} alt="logo" style={{width:'30px'}} />
          <Typography level="title-lg">Furnimall.</Typography>
          <ColorSchemeToggle sx={{ ml: "auto" }} />
        </Box>
        <Divider />
        <Box
          sx={{
            minHeight: 0,
            overflow: "hidden auto",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            [`& .${listItemButtonClasses.root}`]: {
              gap: 1.5,
            },
          }}
        >
          <List
            size="sm"
            sx={{
              gap: 1,
              "--List-nestedInsetStart": "30px",
              "--ListItem-radius": (theme) => theme.vars.radius.sm,
            }}
          >

            <Link
              to={"/products-list"}
              style={{ textDecoration: "none" }}
            >
              <ListItemButton
                sx={{
                  backgroundColor: isActive("/products-list")
                    ? "#3d87db4a"
                    : "transparent",
                }}
              >
                <DashboardRoundedIcon />
                <ListItemContent>
                  <Typography level="title-sm">Products</Typography>
                </ListItemContent>
              </ListItemButton>
            </Link>

            <Link
              to={"/users-list"}
              style={{ textDecoration: "none" }}
            >
              <ListItemButton
                sx={{
                  backgroundColor: isActive("/users-list")
                    ? "#3d87db4a"
                    : "transparent",
                }}
              >
                <GroupIcon />
                <ListItemContent>
                  <Typography level="title-sm">Users</Typography>
                </ListItemContent>
              </ListItemButton>
            </Link>

            <Link
              to={"/emails"}
              style={{ textDecoration: "none" }}
            >
              <ListItemButton
                sx={{
                  backgroundColor: isActive("/email")
                    ? "#3d87db4a"
                    : "transparent",
                }}
              >
                <QuestionAnswerRoundedIcon />
                <ListItemContent>
                  <Typography level="title-sm">Emails</Typography>
                </ListItemContent>
                <Chip size="sm" color="primary" variant="solid">
                  4
                </Chip>
              </ListItemButton>
            </Link>
            
          </List>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={() => setOpen(true)}
        >
          <Typography level="title-sm">Logout</Typography>
          <IconButton size="sm" variant="plain" color="neutral">
            <LogoutRoundedIcon />
          </IconButton>
        </Box>
      </Sheet>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{ maxWidth: 500, borderRadius: "md", p: 3, boxShadow: "lg" }}
        >
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            sx={{ fontWeight: "lg", mb: 1 }}
          >
            Are you sure you want to log out?
          </Typography>
          <Box sx={{ display: "grid", gap: 2 }}>
            <Button variant="solid" color="danger" onClick={handleLogout}>
              Yes
            </Button>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              No
            </Button>
          </Box>
        </Sheet>
      </Modal>
    </>
  );
}
