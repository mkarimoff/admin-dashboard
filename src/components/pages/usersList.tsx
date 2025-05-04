import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Skeleton from "@mui/joy/Skeleton";
import { Box, Button, Input, Typography } from "@mui/joy";
import { Link } from "react-router-dom";
import { Container } from "../styles";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseApi } from "../utils/api";
import ExcelJS from "exceljs";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseApi}/auth/users`);
      setUsers(response.data.users);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
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

  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    // Define columns
    worksheet.columns = [
      { header: "No", key: "no", width: 10 },
      { header: "User's Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Contact", key: "contact", width: 15 },
    ];

    // Add table data
    filteredUsers.forEach((user, index) => {
      worksheet.addRow({
        no: index + 1,
        name: `${capitalize(user.firstName)} ${capitalize(user.lastName)}`,
        email: user.email,
        contact: formatPhoneNumber(user.number),
      });
    });

    // Add table to worksheet
    worksheet.addTable({
      name: "UsersTable",
      ref: "A1",
      headerRow: true,
      totalsRow: false,
      style: {
        theme: "TableStyleMedium2",
        showRowStripes: true,
      },
      columns: [
        { name: "No", filterButton: false },
        { name: "User's Name", filterButton: false },
        { name: "Email", filterButton: false },
        { name: "Contact", filterButton: false },
      ],
      rows: filteredUsers.map((user, index) => [
        index + 1,
        `${capitalize(user.firstName)} ${capitalize(user.lastName)}`,
        user.email,
        formatPhoneNumber(user.number),
      ]),
    });

    // Apply borders to all cells
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        if (rowNumber === 1) {
          cell.font = { bold: true };
        }
      });
    });

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "users_list.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderSkeletonRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <tr key={`skeleton-${index}`}>
        <td>
          <Skeleton variant="text" width={40} />
        </td>
        <td>
          <Skeleton variant="text" width={150} />
        </td>
        <td>
          <Skeleton variant="text" width={200} />
        </td>
        <td>
          <Skeleton variant="text" width={100} />
        </td>
        <td>
          <Skeleton variant="text" width={40} />
        </td>
      </tr>
    ));
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
          <Button color="success" onClick={handleDownloadExcel}>
            Download Excel
          </Button>
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
            {loading ? (
              renderSkeletonRows()
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>
                    {capitalize(user.firstName)} {capitalize(user.lastName)}
                  </td>
                  <td>{user.email}</td>
                  <td>{formatPhoneNumber(user.number)}</td>
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