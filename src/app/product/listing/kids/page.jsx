// import { productsByCategory } from "../../../../services/product/index";
// import CommonProductsListing from "../../../../components/CommonProductsListing";
import CategoryWiseProductsListing from "../../../../components/CategoryWiseProductsListing";

const KidsCategory = async () => {
  // const getAllCategoryProducts = await productsByCategory("kids");

  return (
    // <CommonProductsListing
    //   data={getAllCategoryProducts && getAllCategoryProducts.data}
    // />

    <CategoryWiseProductsListing category="kids" />
  );
};

export default KidsCategory;
