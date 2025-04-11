import axios from "axios";
import {
  ProDetailCon,
  ImageGallery,
  MainImagePlaceholder,
  ThumbnailRow,
  ThumbnailPlaceholder,
} from "../styles";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // for accessing URL params
import { baseApi } from "../utils/api";
import { Button } from "@mui/joy";

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
}

const ProductDetail = () => {
  const { id } = useParams(); // get product ID from URL
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

  return (
    <ProDetailCon>
      {product ? (
        <>
          <div style={{ display: "flex", gap: "20px" }}>
            <ImageGallery>
              <MainImagePlaceholder>{product.MainImage}</MainImagePlaceholder>
              <ThumbnailRow>
                <ThumbnailPlaceholder>{product.image2}</ThumbnailPlaceholder>
                <ThumbnailPlaceholder>{product.image3}</ThumbnailPlaceholder>
                <ThumbnailPlaceholder>{product.image4}</ThumbnailPlaceholder>
              </ThumbnailRow>
            </ImageGallery>

            <div>
              <h2>
                <strong>Title:</strong>
                {product.title}
              </h2>
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
            <Button color="success" onClick={() => navigate(-1)}>Go Back</Button>
            <Button color="danger">Delete</Button>
          </div>
        </>
      ) : (
        <p>Loading product...</p>
      )}
    </ProDetailCon>
  );
};

export default ProductDetail;
