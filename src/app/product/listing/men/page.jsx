import { productsByCategory } from "../../../../services/product/index";
import CommonProductsListing from "../../../../components/CommonProductsListing";

const MenCategory = async () => {
  const getAllCategoryProducts = await productsByCategory("men");

  return (
    <CommonProductsListing
      data={getAllCategoryProducts && getAllCategoryProducts.data}
    />
  );
};

export default MenCategory;
