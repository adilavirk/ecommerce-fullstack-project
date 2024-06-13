// import { productsByCategory } from "../../../../services/product/index";
// import CommonProductsListing from "../../../../components/CommonProductsListing";
import CategoryWiseProductsListing from "../../../../components/CategoryWiseProductsListing";

const WomenCategory = async () => {
  // const getAllCategoryProducts = await productsByCategory("women");

  return (
    // <CommonProductsListing
    //   data={getAllCategoryProducts && getAllCategoryProducts.data}
    // />
    <CategoryWiseProductsListing category="women" />
  );
};

export default WomenCategory;
