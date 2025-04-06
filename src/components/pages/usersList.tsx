import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import { Box, Button, Input, Typography } from "@mui/joy";
import { Link } from "react-router-dom";
import { Container } from "../styles";

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const UsersList = () => {
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
            {rows.map((row) => (
              <tr key={row.name}>
                <td>1</td>
                <td>{row.name}</td>
                <td>{row.calories}</td>
                <td>{row.fat}</td>

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