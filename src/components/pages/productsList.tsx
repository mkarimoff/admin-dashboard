import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import { Box, Button, Input, Modal, ModalDialog, Typography } from "@mui/joy";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { Link } from "react-router-dom";
import { Container, ProductModal } from "../styles";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApi } from "../utils/api"
import { useColorScheme } from "@mui/joy/styles";
import { useTheme } from "@mui/joy/styles"; // add this if not already

interface Product {
  _id: string;
  title: string;
  price: number;
  discount: number;
  quantity: number;
  description: string;
  type: string;
  // image: string;
}

const ProductsList = () => {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const handleClose = () => setOpenAdd(false);
  const handleCloseEdit = () => setOpenEdit(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [discount, setDiscount] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  // const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  // const [imagePreviews, setImagePreviews] = React.useState<string[]>(
  //   Array(4).fill("https://via.placeholder.com/150")
  // );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseApi}/products/getProducts`);
      setProducts(response.data.products);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const addProduct = async () => {
    setError(null); // Reset error on new submission

    if (!title || !price || !description || !quantity || !discount || !type) {
      setError("All fields are required, including an image.");
      return;
    }

    if (typeof price !== "number" || price <= 0) {
      setError("Price must be a valid number greater than zero.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price.toString());
      formData.append("description", description);
      formData.append("discount", discount.toString());
      formData.append("quantity", quantity.toString());
      formData.append("type", type);
      // formData.append("image", image); // ✅ Send image

      await axios.post(`${baseApi}/products/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // ✅ Important for file uploads
        },
      });

      fetchProducts();
      setTitle("");
      setPrice("");
      setDescription("");
      setType("");
      setDiscount("");
      setQuantity("");
      // setImage(null);
      setOpenAdd(false); // Close modal after success
    } catch (error) {
      console.error("Failed to add product", error);
      setError("Failed to add product. Please try again.");
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
        <Typography sx={{ paddingY: 2, fontSize: 30 }}>
          Products List
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="success">Download Excel</Button>
          <div>
            <Button onClick={() => setOpenAdd(true)}>Add New Product</Button>
            <Modal
              open={openAdd}
              onClose={handleClose}
              slotProps={{
                backdrop: {
                  sx: {
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(4px)",
                  },
                },
              }}
            >
              <ModalDialog
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-30%, -50%)",
                  width: 800,

                  bgcolor:
                    mode === "dark" ? theme.palette.background.level1 : "white", // dynamically changes
                  border: "1px solid black",
                  borderColor: theme.palette.divider,
                  p: 10,
                }}
              >
                <Typography
                  level="h4"
                  component="h2"
                  sx={{ marginLeft: "-35px" }}
                >
                  Add New Product
                </Typography>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginLeft: "-35px",
                  }}
                >
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        width: "80px",
                        height: "80px",
                        border: "2px dashed #ccc",
                        borderRadius: "12px",
                        cursor: "pointer",
                        overflow: "hidden",
                        marginTop: "10px",
                      }}
                      onClick={() =>
                        document
                          .getElementById(`image-upload-${index}`)
                          ?.click()
                      }
                    >
                      {index === 0 && (
                        <div
                          style={{
                            position: "absolute",
                            top: "4px",
                            left: "4px",
                            backgroundColor: "#1976d2",
                            color: "white",
                            fontSize: "10px",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            zIndex: 2,
                          }}
                        >
                          Main
                        </div>
                      )}
                      {/* <input
                        type="file"
                        id={`image-upload-${index}`}
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setImagePreviews((prev) => {
                                const updated = [...prev];
                                updated[index] = reader.result as string;
                                return updated;
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        style={{ display: "none" }}
                      />
                      <img
                        src={imagePreviews[index]}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      /> */}
                    </div>
                  ))}
                </div>

                <ProductModal>
                  <div className="inputs-con">
                    <div className="inputs-wrap">
                      <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                          background:
                            theme.palette.mode === "light"
                              ? "#F5F5F5"
                              : theme.palette.background.surface,
                          color: theme.palette.text.primary,
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Price"
                        value={price}
                        onChange={(e) =>
                          setPrice(
                            e.target.value ? parseFloat(e.target.value) : ""
                          )
                        }
                        style={{
                          background:
                            theme.palette.mode === "light"
                              ? "#F5F5F5"
                              : theme.palette.background.surface,
                          color: theme.palette.text.primary,
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{
                          background:
                            theme.palette.mode === "light"
                              ? "#F5F5F5"
                              : theme.palette.background.surface,
                          color: theme.palette.text.primary,
                        }}
                      />
                    </div>
                    <div className="inputs-wrap">
                      <input
                        type="number"
                        placeholder="Discount"
                        value={discount}
                        onChange={(e) =>
                          setDiscount(
                            e.target.value ? parseFloat(e.target.value) : ""
                          )
                        }
                        style={{
                          background:
                            theme.palette.mode === "light"
                              ? "#F5F5F5"
                              : theme.palette.background.surface,
                          color: theme.palette.text.primary,
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            e.target.value ? parseFloat(e.target.value) : ""
                          )
                        }
                        style={{
                          background:
                            theme.palette.mode === "light"
                              ? "#F5F5F5"
                              : theme.palette.background.surface,
                          color: theme.palette.text.primary,
                        }}
                      />
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        style={{
                          background:
                            theme.palette.mode === "light"
                              ? "#F5F5F5"
                              : theme.palette.background.surface,
                          color: theme.palette.text.primary,
                        }}
                      >
                        <option value="" disabled selected hidden>
                          Type
                        </option>
                        <option value="chair">Chair</option>
                        <option value="drawer">Drawer</option>
                        <option value="sofa">Sofa</option>
                        <option value="table">Table</option>
                      </select>
                      {error && (
                        <p style={{ color: "red", fontWeight: "bold" }}>
                          {error}
                        </p>
                      )}
                    </div>
                  </div>
                </ProductModal>

                <Typography
                  sx={{
                    mt: 2,
                    display: "flex",
                    gap: "10px",
                    marginLeft: "530px",
                  }}
                >
                  <Button color="success" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button onClick={addProduct}>Add</Button>
                </Typography>
              </ModalDialog>
            </Modal>
          </div>
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
        <Select
          placeholder="Category"
          indicator={<KeyboardArrowDown />}
          sx={{
            flex: 2,
            [`& .${selectClasses.indicator}`]: {
              transition: "0.2s",
              [`&.${selectClasses.expanded}`]: {
                transform: "rotate(-180deg)",
              },
            },
          }}
        >
          <Option value="chair">Chair</Option>
          <Option value="drawer">Drawer</Option>
          <Option value="table">Table</Option>
          <Option value="sofa">Sofa</Option>
        </Select>
        <Select
          placeholder="Price"
          indicator={<KeyboardArrowDown />}
          sx={{
            flex: 1,
            [`& .${selectClasses.indicator}`]: {
              transition: "0.2s",
              [`&.${selectClasses.expanded}`]: {
                transform: "rotate(-180deg)",
              },
            },
          }}
        >
          <Option value="dog">Dog</Option>
          <Option value="cat">Cat</Option>
          <Option value="fish">Fish</Option>
          <Option value="bird">Bird</Option>
        </Select>

        <Button>FILTER</Button>
        <Button variant="soft">RESET</Button>
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
              <th style={{ width: "25%" }}>Title</th>
              <th>image</th>
              <th>price</th>
              <th>type</th>
              <th style={{ width: "60px" }}></th>
              <th style={{ width: "60px" }}></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product._id}>
                <td>{index + 1}</td>
                <td>{product.title}</td>
                <td>image</td>
                <td>{product.price}$</td>
                <td>{product.type}</td>
                <td>
                  <div>
                    <Typography
                      color="primary"
                      sx={{ cursor: "pointer" }}
                      onClick={() => setOpenEdit(true)}
                    >
                      Edit
                    </Typography>
                    <Modal
                      open={openEdit}
                      onClose={handleClose}
                      slotProps={{
                        backdrop: {
                          sx: {
                            backgroundColor: "rgba(255, 255, 255, 0.03)",
                            backdropFilter: "blur(2px)",
                          },
                        },
                      }}
                    >
                      <ModalDialog
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-30%, -50%)",
                          width: 800,
                          bgcolor:
                            mode === "dark"
                              ? theme.palette.background.level1
                              : "white",
                          border: "1px solid",
                          borderColor: theme.palette.divider,
                          p: 10,
                        }}
                      >
                        <Typography
                          level="h4"
                          component="h2"
                          sx={{ marginLeft: "-35px" }}
                        >
                          Edit product
                        </Typography>

                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            marginLeft: "-35px",
                          }}
                        >
                          {[0, 1, 2, 3].map((index) => (
                            <div
                              key={index}
                              style={{
                                position: "relative",
                                width: "80px",
                                height: "80px",
                                border: "2px dashed #ccc",
                                borderRadius: "12px",
                                cursor: "pointer",
                                overflow: "hidden",
                                marginTop: "10px",
                              }}
                              onClick={() =>
                                document
                                  .getElementById(`image-upload-${index}`)
                                  ?.click()
                              }
                            >
                              {index === 0 && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "4px",
                                    left: "4px",
                                    backgroundColor: "#1976d2",
                                    color: "white",
                                    fontSize: "10px",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    zIndex: 2,
                                  }}
                                >
                                  Main
                                </div>
                              )}
                              {/* <input
                                type="file"
                                id={`image-upload-${index}`}
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setImagePreviews((prev) => {
                                        const updated = [...prev];
                                        updated[index] =
                                          reader.result as string;
                                        return updated;
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                style={{ display: "none" }}
                              />
                              <img
                                src={imagePreviews[index]}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              /> */}
                            </div>
                          ))}
                        </div>

                        <ProductModal>
                          <div className="inputs-con">
                            <div className="inputs-wrap">
                              <input
                                type="text"
                                placeholder="Title"
                                style={{
                                  background:
                                    theme.palette.mode === "light"
                                      ? "#F5F5F5"
                                      : theme.palette.background.surface,
                                  color: theme.palette.text.primary,
                                }}
                              />
                              <input
                                type="text"
                                placeholder="Price"
                                style={{
                                  background:
                                    theme.palette.mode === "light"
                                      ? "#F5F5F5"
                                      : theme.palette.background.surface,
                                  color: theme.palette.text.primary,
                                }}
                              />
                              <input
                                type="text"
                                placeholder="Description"
                                style={{
                                  background:
                                    theme.palette.mode === "light"
                                      ? "#F5F5F5"
                                      : theme.palette.background.surface,
                                  color: theme.palette.text.primary,
                                }}
                              />
                            </div>
                            <div className="inputs-wrap">
                              <input
                                type="number"
                                placeholder="Discount"
                                style={{
                                  background:
                                    theme.palette.mode === "light"
                                      ? "#F5F5F5"
                                      : theme.palette.background.surface,
                                  color: theme.palette.text.primary,
                                }}
                              />
                              <input
                                type="number"
                                placeholder="Quantity"
                                style={{
                                  background:
                                    theme.palette.mode === "light"
                                      ? "#F5F5F5"
                                      : theme.palette.background.surface,
                                  color: theme.palette.text.primary,
                                }}
                              />
                              <select
                                style={{
                                  background:
                                    theme.palette.mode === "light"
                                      ? "#F5F5F5"
                                      : theme.palette.background.surface,
                                  color: theme.palette.text.primary,
                                }}
                              >
                                <option value="" disabled selected hidden>
                                  Type
                                </option>
                                <option value="chair">Chair</option>
                                <option value="drawer">Drawer</option>
                                <option value="sofa">Sofa</option>
                                <option value="table">Table</option>
                              </select>
                            </div>
                          </div>
                        </ProductModal>

                        <Typography
                          sx={{
                            mt: 2,
                            display: "flex",
                            gap: "10px",
                            marginLeft: "530px",
                          }}
                        >
                          <Button color="success" onClick={handleCloseEdit}>
                            Cancel
                          </Button>
                          <Button>Edit</Button>
                        </Typography>
                      </ModalDialog>
                    </Modal>
                  </div>
                </td>
                <td>
                  <Link
                    to={"/product-detail"}
                    style={{ textDecoration: "none" }}
                  >
                    <Typography color="primary" sx={{ cursor: "pointer" }}>
                      View
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

export default ProductsList;
