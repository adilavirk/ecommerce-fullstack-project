import { getAllProducts } from "../../../../services/product/index";
import CommonProductsListing from "../../../../components/CommonProductsListing";

const AllProducts = async () => {
  const getAllClientProducts = await getAllProducts();

  return (
    <CommonProductsListing
      data={getAllClientProducts && getAllClientProducts.data}
    />
  );
};

export default AllProducts;
