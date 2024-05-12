import { productsByCategory } from "../../../../services/product/index";
import CommonProductsListing from "../../../../components/CommonProductsListing";

const WomenCategory = async () => {
  const getAllCategoryProducts = await productsByCategory("women");

  return (
    <CommonProductsListing
      data={getAllCategoryProducts && getAllCategoryProducts.data}
    />
  );
};

export default WomenCategory;
