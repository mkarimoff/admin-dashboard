import axios from "axios";
import {
  ProDetailCon,
  ImageGallery,
  MainImagePlaceholder,
  ThumbnailRow,
  ThumbnailPlaceholder,
} from "../../styles";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // for accessing URL params
import { baseApi } from "../../utils/api";
import { Button } from "@mui/joy";
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
  MainImage: String;
  image2: String;
  image3: String;
  image4: String;
  createdAt: string;
}

const ProductDetail = () => {
  const theme = useTheme();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) fetchProductById(id);
  }, [id]);

  const fetchProductById = async (productId: string) => {
    try {
      const response = await axios.get(
        `${baseApi}/products/getProduct/${productId}`
      );
      setProduct(response.data.product);
    } catch (error) {
      console.error("Failed to fetch product by ID", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseApi}/products/getProducts`);
      setProduct(response.data.products);
      navigate("/products-list");
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error("Failed to fetch products.");
      console.error("Failed to fetch products", error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${baseApi}/products/delete/${id}`);
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product.");
      console.error("Failed to delete product", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
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
              <MainImagePlaceholder>
                <img
                  src={`${baseApi}/${product.MainImage}`}
                  alt="Main image"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </MainImagePlaceholder>

              <ThumbnailRow>
                {[product.image2, product.image3, product.image4].map(
                  (img, idx) => (
                    <ThumbnailPlaceholder key={idx}>
                      <img
                        src={`${baseApi}/${img}`}
                        alt={`Product image`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    </ThumbnailPlaceholder>
                  )
                )}
              </ThumbnailRow>
            </ImageGallery>

            <div>
              <h2>
                <strong>Title:</strong>
                {product.title}
              </h2>
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
                <strong>Type:</strong> {product.type}
              </p>
              <p className="desc">
                <strong>Description:</strong>
                {product.description}
              </p>
            </div>
          </div>
          <div className="buttons-wrap">
            <Button color="success" onClick={() => navigate(-1)}>
              Go Back
            </Button>
            <Button color="danger" onClick={() => deleteProduct(product._id)}>
              Delete
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
