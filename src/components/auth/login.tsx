import { Box, Button, FormControl, FormLabel, Input } from "@mui/joy";
import { Link } from "react-router-dom";

const LoginComponent = () => {
  return (
    <>
      <FormControl
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          textAlign: "center",
        }}
      >
        <Box>
          {/* Email */}
          <FormLabel>이메일:</FormLabel>
          <Input placeholder="Email" sx={{ width: "280px" }} />
        </Box>
        <Box
          sx={{
            m: 1,
          }}
        >
          {/* Password */}
          <FormLabel>비밀번호:</FormLabel>
          <Input placeholder="password" sx={{ width: "280px" }} />
        </Box>
        <Box sx={{ display: "grid", gap: 1, width: "280px", mt: 1 }}>
          {/* login */}
          <Link
            to={"/out-rourcing-worker-list"}
            style={{ textDecoration: "none", width: "280px" }}
          >
            <Button variant="solid" sx={{ width: "280px" }}>
              로그인
            </Button>
          </Link>
          {/* register */}
          {/* <Link
            to={"/sign-up"}
            style={{ textDecoration: "none", width: "280px" }}
          >
            <Button variant="outlined" sx={{ width: "280px" }}>
              회원가입
            </Button>
          </Link> */}
        </Box>
      </FormControl>
    </>
  );
};

export default LoginComponent;