import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import { Box, Button, Input, Typography } from "@mui/joy";
import { Link } from "react-router-dom";
import { Container } from "../styles";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseApi } from "../utils/api";


interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: number;
  number: number;
  address: string;
}

const UsersList = () => {



  const [users, setUsers] = useState<User[]>([]);
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState<number | "">("");
  // const [number, setNumber] = useState<number | "">("");
  // const [address, setAddress] = useState("");
  // const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${baseApi}/products/getUsers`);
      setUsers(response.data.products);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };
  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            paddingY: 2,
            fontSize: 30,
          }}
        >
          Users List
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="success">Download Excel</Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "end",
          mb: 4,
          alignItems: "center",
        }}
      >
        <Input placeholder="Search in here…" sx={{ flex: 2 }} />

        <Button>Search</Button>
      </Box>

      <Sheet variant="soft" sx={{ pt: 1, borderRadius: "sm" }}>
        <Table
          stripe="odd"
          hoverRow
          sx={{
            captionSide: "top",
            "& tbody": { bgcolor: "background.surface" },
          }}
        >
          <thead>
            <tr>
              <th style={{ width: "60px" }}>No</th>
              <th style={{ width: "25%" }}>User Name</th>

              <th>email</th>
              <th>contact</th>
              <th style={{ width: "60px" }}></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user,index) => (
              <tr key={user._id}>
                <td>{index +1}</td>
                <td>{user.firstName}</td>
                <td>{user.email}</td>
                <td>{user.number}</td>

                <td>
                  <Link to={":id"} style={{ textDecoration: "none" }}>
                    <Typography color="primary" sx={{ cursor: "pointer" }}>
                      view
                    </Typography>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </Container>
  );
};

export default UsersList;