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
  number: string;
}

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${baseApi}/auth/users`);
      setUsers(response.data.users);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const normalize = (value: string) => {
    return value.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  };

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      normalize(user.number).includes(normalize(searchQuery))
    );
  });

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    return match ? `${match[1]}-${match[2]}-${match[3]}` : phone;
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
        <Typography sx={{ paddingY: 2, fontSize: 30 }}>Users List</Typography>
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
        <Input
          placeholder="Search in here..."
          sx={{ flex: 2 }}
          value={searchQuery}
          onChange={handleSearch}
        />
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
              <th style={{ width: "25%" }}>User's Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th style={{ width: "60px" }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>
                    {capitalize(user.firstName)} {capitalize(user.lastName)}
                  </td>
                  <td>{user.email}</td>
                  <td>{formatPhoneNumber (user.number)}</td>
                  <td>
                    <Link
                      to={`/user-detail/${user._id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Typography
                        color="primary"
                        sx={{ cursor: "pointer", display: "flex" }}
                      >
                        More
                      </Typography>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: "1rem" }}
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Sheet>
    </Container>
  );
};

export default UsersList;
