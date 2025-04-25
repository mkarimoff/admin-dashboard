import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import {
  Box,
  Button,
  CircularProgress,
  Input,
  Modal,
  ModalDialog,
  Typography,
} from "@mui/joy";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { Link } from "react-router-dom";
import { Container, ProductModal } from "../styles";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApi } from "../utils/api";
import { useColorScheme } from "@mui/joy/styles";
import { useTheme } from "@mui/joy/styles";
import { toast } from "react-toastify";

interface Product {
  _id: string;
  title: string;
  price: number;
  discount: number;
  quantity: number;
  description: string;
  type: string;
  MainImage: string;
  image2: string;
  image3: string;
  image4: string;
}

interface ImageState {
  file: File | null;
  preview: string;
}

const ProductsList = () => {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const handleClose = () => setOpenAdd(false);
  const handleCloseEdit = () => setOpenEdit(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [discount, setDiscount] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [MainImage, setMainImage] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [image3, setImage3] = useState<File | null>(null);
  const [image4, setImage4] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState<{ [key: string]: boolean }>({});


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseApi}/products/getProducts`);
      const products: Product[] = response.data.products;

      setProducts(products);
      setFilteredProducts(products);
    } catch (error) {
      toast.error("Failed to fetch products.");
    }
  };

  const addProduct = async () => {
    setError(null);

    if (
      !title ||
      !quantity ||
      !price ||
      discount === "" ||
      !description ||
      !type
    ) {
      setError("All fields are required, including an image.");
      return;
    }

    if (typeof price !== "number" || price <= 0) {
      setError("Price must be a valid number greater than zero.");
      return;
    }

    try {
      setLoading(true); // Set loading to true when the request starts

      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price.toString());
      formData.append("description", description);
      formData.append("discount", discount.toString());
      formData.append("quantity", quantity.toString());
      formData.append("type", type);

      if (MainImage) formData.append("MainImage", MainImage);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      await axios.post(`${baseApi}/products/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fetchProducts();
      setTitle("");
      setPrice("");
      setDescription("");
      setType("");
      setDiscount("");
      setQuantity("");
      setMainImage(null);
      setImage2(null);
      setImage3(null);
      setImage4(null);
      setOpenAdd(false);
      toast.success("Product added successfully!");
    } catch (error) {
      toast.error("Failed to add product.");
      setError("Failed to add product. Please try again.");
    } finally {
      setLoading(false); // Reset loading state after the request is complete
    }
  };

  const [imageStates, setImageStates] = useState<ImageState[]>([
    { file: null, preview: "" },
    { file: null, preview: "" },
    { file: null, preview: "" },
    { file: null, preview: "" },
  ]);

  const [editData, setEditData] = useState({
    title: "",
    price: "" as string | number,
    description: "",
    discount: "" as string | number,
    quantity: "" as string | number,
    type: "",
  });

  const handleOpenEdit = (product: Product) => {
    setProductId(product._id);
    setEditData({
      title: product.title,
      price: product.price,
      description: product.description,
      discount: product.discount,
      quantity: product.quantity,
      type: product.type,
    });

    setImageStates([
      { file: null, preview: product.MainImage || "" }, // baseApi qo‘shilmadi
      { file: null, preview: product.image2 || "" },
      { file: null, preview: product.image3 || "" },
      { file: null, preview: product.image4 || "" },
    ]);

    setOpenEdit(true);
  };

  const handleSaveEdit = async () => {
    const formData = new FormData();

    formData.append("title", editData.title);
    formData.append("price", editData.price ? editData.price.toString() : "0");
    formData.append(
      "quantity",
      editData.quantity ? editData.quantity.toString() : "0"
    );
    formData.append(
      "discount",
      editData.discount ? editData.discount.toString() : "0"
    );
    formData.append("description", editData.description);
    formData.append("type", editData.type);

    if (imageStates[0].file) formData.append("MainImage", imageStates[0].file);
    if (imageStates[1].file) formData.append("image2", imageStates[1].file);
    if (imageStates[2].file) formData.append("image3", imageStates[2].file);
    if (imageStates[3].file) formData.append("image4", imageStates[3].file);

    try {
      const { data } = await axios.put(
        `${baseApi}/products/update/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success("Product updated successfully!");
        fetchProducts();
        setOpenEdit(false);
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImageStates = [...imageStates];
      newImageStates[index] = { file, preview: URL.createObjectURL(file) };
      setImageStates(newImageStates);

      if (index === 0) setMainImage(file);
      if (index === 1) setImage2(file);
      if (index === 2) setImage3(file);
      if (index === 3) setImage4(file);
    }
  };

  const handleFilter = () => {
    let filtered = [...products];

    if (search) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter((product) => product.type === category);
    }

    if (priceFilter) {
      const priceRange = priceFilter.split("-");
      if (priceRange.length === 2) {
        const minPrice = parseFloat(priceRange[0]);
        const maxPrice = parseFloat(priceRange[1]);
        filtered = filtered.filter(
          (product) => product.price >= minPrice && product.price <= maxPrice
        );
      }
    }

    setFilteredProducts(filtered);
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setPriceFilter("");
    setFilteredProducts(products);
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
                    gap: "9px",
                    marginLeft: "-35px",
                  }}
                >
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        width: "80px",
                        height: "90px",
                        border: "2px dashed #ccc",
                        borderRadius: "12px",
                        cursor: "pointer",
                        overflow: "hidden",
                        marginTop: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        fontSize: "10px",
                        backgroundColor:
                          mode === "dark"
                            ? theme.palette.background.level1
                            : "white",
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

                      <input
                        type="file"
                        id={`image-upload-${index}`}
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleFileChange(e, index)}
                      />
                      {imageStates[index].file ? (
                        <img
                          src={URL.createObjectURL(imageStates[index].file!)}
                          alt={`image-${index}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            fontSize: "40px",
                            color: "#aaa",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          +
                        </span>
                      )}
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
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setPrice(isNaN(val) ? 0 : val);
                        }}
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
                        type="text"
                        placeholder="Discount"
                        value={discount}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setDiscount(isNaN(val) ? 0 : val);
                        }}
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
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setQuantity(isNaN(val) ? 0 : val);
                        }}
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
                        <option value="">Select type</option>
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
                  <Button onClick={addProduct} disabled={loading}>
                    {loading ? (
                      <CircularProgress sx={{ marginRight: "10px" }} />
                    ) : (
                      "Add"
                    )}
                  </Button>
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
        <Input
          placeholder="Search by title…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 2 }}
        />
        <Select
          placeholder="Category"
          value={category}
          onChange={(event, value) => {
            setCategory(value);
          }}
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
          <Option value="">All Categories</Option>
          <Option value="chair">Chair</Option>
          <Option value="drawer">Drawer</Option>
          <Option value="sofa">Sofa</Option>
          <Option value="table">Table</Option>
        </Select>

        <Select
          placeholder="Price"
          value={priceFilter}
          onChange={(event, value) => setPriceFilter(value)}
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
          <Option value="">All Prices</Option>
          <Option value="0-100">0 - 100</Option>
          <Option value="101-500">101 - 500</Option>
          <Option value="501-1000">501 - 1000</Option>
          <Option value="1001-5000">1001 - 5000</Option>
        </Select>

        <Button onClick={handleFilter}>FILTER</Button>
        <Button variant="soft" onClick={handleReset}>
          RESET
        </Button>
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
              <th style={{ width: "30%" }}>Title</th>
              <th>image</th>
              <th>price</th>
              <th>type</th>
              <th style={{ width: "60px" }}></th>
              <th style={{ width: "60px" }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, index) => (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  <td>
                    {product.title.charAt(0).toUpperCase() +
                      product.title.slice(1)}
                  </td>
                  <td>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {imgLoading[product._id] !== false && (
                        <CircularProgress size="sm" />
                      )}
                      <img
                        src={product.MainImage}
                        alt="product image"
                        onLoad={() =>
                          setImgLoading((prev) => ({
                            ...prev,
                            [product._id]: false,
                          }))
                        }
                        onError={() =>
                          setImgLoading((prev) => ({
                            ...prev,
                            [product._id]: false,
                          }))
                        }
                        style={{
                          display:
                            imgLoading[product._id] === false
                              ? "block"
                              : "none",
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "solid black 1px",
                        }}
                      />
                    </div>
                  </td>

                  <td>{product.price}$</td>
                  <td>
                    {product.type.charAt(0).toUpperCase() +
                      product.type.slice(1)}
                  </td>
                  <td>
                    <div>
                      <Typography
                        color="primary"
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleOpenEdit(product)}
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

                          <ProductModal>
                            <div className="inputs-con">
                              <div className="inputs-wrap">
                                <input
                                  type="text"
                                  placeholder="Title"
                                  value={editData.title}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      title: e.target.value,
                                    })
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
                                  placeholder="Price"
                                  value={editData.price}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    setEditData({
                                      ...editData,
                                      price: isNaN(val) ? 0 : val,
                                    });
                                  }}
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
                                  value={editData.description}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      description: e.target.value,
                                    })
                                  }
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
                                  type="text"
                                  placeholder="Discount"
                                  value={editData.discount}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    setEditData({
                                      ...editData,
                                      discount: isNaN(val) ? 0 : val,
                                    });
                                  }}
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
                                  placeholder="Quantity"
                                  value={editData.quantity}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    setEditData({
                                      ...editData,
                                      quantity: isNaN(val) ? 0 : val,
                                    });
                                  }}
                                  style={{
                                    background:
                                      theme.palette.mode === "light"
                                        ? "#F5F5F5"
                                        : theme.palette.background.surface,
                                    color: theme.palette.text.primary,
                                  }}
                                />

                                <select
                                  value={editData.type}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      type: e.target.value,
                                    })
                                  }
                                  style={{
                                    background:
                                      theme.palette.mode === "light"
                                        ? "#F5F5F5"
                                        : theme.palette.background.surface,
                                    color: theme.palette.text.primary,
                                  }}
                                >
                                  <option value="">Select type</option>
                                  <option value="chair">Chair</option>
                                  <option value="drawer">Drawer</option>
                                  <option value="sofa">Sofa</option>
                                  <option value="table">Table</option>
                                </select>

                                {error && (
                                  <p
                                    style={{ color: "red", fontWeight: "bold" }}
                                  >
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
                            <Button color="success" onClick={handleCloseEdit}>
                              Cancel
                            </Button>
                            <Button onClick={handleSaveEdit}>Save</Button>
                          </Typography>
                        </ModalDialog>
                      </Modal>
                    </div>
                  </td>
                  <td>
                    <Link
                      to={`/product-detail/${product._id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Typography color="primary" sx={{ cursor: "pointer" }}>
                        View
                      </Typography>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Sheet>
    </Container>
  );
};

export default ProductsList;
