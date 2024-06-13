// import { productsByCategory } from "../../../../services/product/index";
import CategoryWiseProductsListing from "../../../../components/CategoryWiseProductsListing";

const MenCategory = async () => {
  // const getAllCategoryProducts = await productsByCategory("men");
  // console.log(getAllCategoryProducts.data);

  return (
    // <CategoryWiseProductsListing
    //   data={getAllCategoryProducts && getAllCategoryProducts.data}
    // />

    <CategoryWiseProductsListing category="men" />
  );
};

export default MenCategory;
