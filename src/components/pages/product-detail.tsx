import { useParams } from "react-router-dom";
import { ProDetailCon } from "../styles"
import { BlogsMockData } from "../blogs.mock";


const ProductDetail = () => {
    let { id } = useParams();
  
    const data = BlogsMockData.find((value) => value.id.toString() === id);
  
  return (
    <ProDetailCon>
        product-detail
        <h1>{data?.header}</h1>
    </ProDetailCon>
  )
}

export default ProductDetail