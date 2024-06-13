import { getAllProducts } from "../../../../services/product/index";
import CommonProductsListing from "../../../../components/CommonProductsListing";

const AllProducts = async () => {
  // const getAllClientProducts = await getAllProducts();

  return <CommonProductsListing />;
};

export default AllProducts;
