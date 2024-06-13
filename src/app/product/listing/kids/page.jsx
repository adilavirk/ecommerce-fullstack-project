import { productsByCategory } from "../../../../services/product/index";
import CommonProductsListing from "../../../../components/CommonProductsListing";

const KidsCategory = async () => {
  const getAllCategoryProducts = await productsByCategory("kids");

  return (
    <CommonProductsListing
      data={getAllCategoryProducts && getAllCategoryProducts.data}
    />
  );
};

export default KidsCategory;
