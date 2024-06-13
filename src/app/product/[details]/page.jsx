import CommonDetailsPage from "../../../components/CommonDetailsPage";
import { ProductById } from "../../../services/product";

const ProductDetails = async ({ params }) => {
  const productDetailsData = await ProductById(params.details);

  return (
    <CommonDetailsPage item={productDetailsData && productDetailsData.data} />
  );
};

export default ProductDetails;
