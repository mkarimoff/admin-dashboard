import axios from "axios";
import {
  ProDetailCon,
  ImageGallery,
  MainImagePlaceholder,
  ThumbnailRow,
  ThumbnailPlaceholder,
} from "../../styles";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { baseApi } from "../../utils/api";
import { Button, Divider, CircularProgress } from "@mui/joy";
import { toast } from "react-toastify";
import { useTheme } from "@mui/joy/styles";

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
  createdAt: string;
}

const ProductDetail = () => {
  const theme = useTheme();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<(string | null)[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) fetchProductById(id);
  }, [id]);

  const fetchProductById = async (productId: string) => {
    try {
      const response = await axios.get(`${baseApi}/products/getProduct/${productId}`);
      const prod: Product = response.data.product;
      setProduct(prod);
      setImages([
        prod.MainImage,
        prod.image2 || null,
        prod.image3 || null,
        prod.image4 || null,
      ]);
    } catch (error) {
    }
  };

  const fetchProducts = async () => {
    try {
      await axios.get(`${baseApi}/products/getProducts`);
      navigate("/products-list");
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error("Failed to fetch products.");
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    try {
      await axios.delete(`${baseApi}/products/delete/${id}`);
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product.");
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailClick = (index: number) => {
    setMainImageIndex(index);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const capitalizeWords = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <ProDetailCon
      style={{
        background: theme.palette.mode === "light" ? "#fefcfcd5" : "#31323383",
        color: theme.palette.text.primary,
        boxShadow:
          theme.palette.mode === "light"
            ? "rgba(0, 0, 0, 0.35) 0px 5px 15px"
            : "rgba(255, 255, 255, 0.777) 0px 5px 15px",
      }}
    >
      {product ? (
        <>
          <div style={{ display: "flex", gap: "20px" }}>
            <ImageGallery>
              <MainImagePlaceholder style={{ width: "340px", height: "400px" }}>
                {images[mainImageIndex] ? (
                  <img
                    src={images[mainImageIndex] as string}
                    alt="Main image"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#f0f0f0",
                      color: "#999",
                      fontStyle: "italic",
                    }}
                  >
                    No image
                  </div>
                )}
              </MainImagePlaceholder>

              <ThumbnailRow>
                {images.slice(1).map((img, idx) => (
                  <ThumbnailPlaceholder
                    key={idx}
                    style={{
                      width: "102px",
                      height: "100px",
                      cursor: img ? "pointer" : "default",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: img ? "#fff" : "#f0f0f0",
                      color: "#999",
                      fontSize: "12px",
                      fontStyle: "italic",
                    }}
                    onClick={() => img && handleThumbnailClick(idx + 1)}
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 2}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    ) : (
                      "No image"
                    )}
                  </ThumbnailPlaceholder>
                ))}
              </ThumbnailRow>
            </ImageGallery>

            <div>
              <h2>
                <strong>Title: </strong>
                {capitalizeWords(product.title)}
              </h2>
              <Divider />
              <p>
                <strong>Registered At:</strong> {formatDate(product.createdAt)}
              </p>
              <p>
                <strong>Price:</strong> ${product.price}
              </p>
              <p>
                <strong>Discount:</strong> {product.discount}%
              </p>
              <p>
                <strong>Quantity:</strong> {product.quantity}
              </p>
              <p>
                <strong>Type:</strong> {capitalize(product.type)}
              </p>
              <p className="desc">
                <strong>Description: </strong>
                {capitalize(product.description)}
              </p>
            </div>
          </div>

          <div className="buttons-wrap">
            <Button color="success" onClick={() => navigate(-1)}>
              Go Back
            </Button>
            <Button
              color="danger"
              onClick={() => deleteProduct(product._id)}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress sx={{ marginRight: "10px" }} />
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </>
      ) : (
        <p>Loading product's details...</p>
      )}
    </ProDetailCon>
  );
};

export default ProductDetail;
