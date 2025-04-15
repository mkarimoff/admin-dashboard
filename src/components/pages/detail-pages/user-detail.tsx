import axios from "axios";
import { ProDetailCon } from "../../styles";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { baseApi } from "../../utils/api";
import { Button } from "@mui/joy";
import { toast } from "react-toastify";
import { useTheme } from "@mui/joy/styles";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  number: number;
  address: string;
  role: string;
  createdAt: string;
}

const UsersDetail = () => {
  const theme = useTheme();
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) fetchUserById(id);
  }, [id]);

  const fetchUserById = async (userId: string) => {
    try {
      const response = await axios.get(`${baseApi}/auth/getUser/${userId}`);
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user by ID", error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`${baseApi}/auth/deleteUser/${id}`);
      toast.success("User deleted successfully");
      setUser(null); // clear the deleted user's data
      navigate("/users-list");
    } catch (error) {
      toast.error("Failed to delete user.");
      console.error("Failed to delete user", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const capitalizeWords = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <ProDetailCon
      style={{
        background: theme.palette.mode === "light" ? "#fefcfcd5" : "#313233a0",
        color: theme.palette.text.primary,
        boxShadow:
          theme.palette.mode === "light"
            ? "rgba(0, 0, 0, 0.35) 0px 5px 15px"
            : "rgba(255, 255, 255, 0.777) 0px 5px 15px",
        padding: "2rem",
        borderRadius: "12px",
      }}
    >
      {user ? (
        <>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <h2>User's Details</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                rowGap: "1rem",
                columnGap: "2rem",
              }}
            >
              <div>
                <strong>First Name:</strong>
              </div>
              <div>{capitalize(user.firstName)}</div>

              <div>
                <strong>Last Name:</strong>
              </div>
              <div>{capitalize(user.lastName)}</div>

              <div>
                <strong>Email:</strong>
              </div>
              <div>{user.email}</div>

              <div>
                <strong>Address:</strong>
              </div>
              <div>{capitalizeWords(user.address)}</div>

              <div>
                <strong>Number:</strong>
              </div>
              <div>{user.number}</div>
              <div>
                <strong>Registered At:</strong>
              </div>
              <div>{formatDate(user.createdAt)}</div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "2rem",
              }}
            >
              <Button color="success" onClick={() => navigate(-1)}>
                Go Back
              </Button>
              <Button color="danger" onClick={() => deleteUser(user._id)}>
                Delete
              </Button>
            </div>
          </div>
        </>
      ) : (
        <p>Loading user's details...</p>
      )}
    </ProDetailCon>
  );
};

export default UsersDetail;
